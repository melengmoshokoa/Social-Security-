from fastapi import FastAPI
from pydantic import BaseModel
from apify_client import ApifyClient
import pandas as pd
import joblib
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Instagram S&S API")

fake_real_model = joblib.load("fake2_real_model.pkl")
fake_real_features = fake_real_model.feature_names_in_

automated_model = joblib.load("automated_model.pkl")
automated_features = automated_model.feature_names_in_


APIFY_TOKEN = os.getenv("APIFY_TOKEN")
apify_client = ApifyClient(APIFY_TOKEN)

def scrape_instagram(username: str):
    run_input = {
        "usernames": [username],
        "resultsType": "details",
        "resultsLimit": 1
    }

    # use the official Instagram Profile Scraper
    run = apify_client.actor("apify/instagram-profile-scraper").call(run_input=run_input)

    items = []
    for item in apify_client.dataset(run["defaultDatasetId"]).iterate_items():
        items.append(item)

    if not items:
        return None
    return items[0]

class UsernameRequest(BaseModel):
    username: str

@app.post("/api/model/predict_from_username")
def predict_from_username(request: UsernameRequest):
    username = request.username
    
    profile_data = scrape_instagram(username) or {}

    print("Scraped Data:", profile_data)

    main_profile_table = pd.DataFrame([{
        "Username": profile_data.get("username"),
        "Full Name": profile_data.get("fullName"),
        "Followers": profile_data.get("followers"),
        "Following": profile_data.get("followings"),
        "Private": profile_data.get("is_private"),
        "Verified": profile_data.get("verified"),
        "Biography": profile_data.get("biography"),
        "Profile Pic URL": profile_data.get("profile_picture")
    }])

    # --- Build table for related profiles (top 5) ---
    related_profiles = profile_data.get("relatedProfiles", [])[:5]
    related_profiles_table = pd.DataFrame([
        {
            "Username": rp.get("username"),
            "Full Name": rp.get("full_name"),
            "Private": rp.get("is_private"),
            "Verified": rp.get("is_verified"),
            "Profile Pic URL": rp.get("profile_pic_url")
        }
        for rp in related_profiles
    ])

    def count_posts_by_caption(profile_data: dict) -> int:
        
            count = 0

            def recursive_search(data):
                nonlocal count
                if isinstance(data, dict):
                    for key, value in data.items():
                        if key == "commentsCount":
                            count += 1
                        else:
                            recursive_search(value)
                elif isinstance(data, list):
                    for item in data:
                        recursive_search(item)

            recursive_search(profile_data)
            return count




    # Map scraped data to model features
    fake_real_input = {
        "userFollowerCount": profile_data.get("followersCount", 0),
        "userFollowingCount": profile_data.get("followsCount", 0),
        "userBiographyLength": len(profile_data.get("biography", "")),
        "userMediaCount": count_posts_by_caption(profile_data),
        "userHasProfilPic": 1 if profile_data.get("profilePicUrl") else 0,
        "userIsPrivate": 1 if profile_data.get("private", False) else 0,
        "usernameDigitCount": sum(c.isdigit() for c in profile_data.get("username", "")),
        "usernameLength": len(profile_data.get("username", ""))
    }

    automated_input = {
        "userMediaCount": count_posts_by_caption(profile_data),
        "userFollowerCount": profile_data.get("followersCount", 0),
        "userFollowingCount": profile_data.get("followsCount", 0),
        "userHasHighlighReels": 1 if profile_data.get("highlightReelCount", 0) > 0 else 0,
        "userHasExternalUrl": 1 if profile_data.get("externalUrls") else 0,
        "userTagsCount": profile_data.get("taggedPostsCount", 0),  # check if this exists
        "userBiographyLength": len(profile_data.get("biography", "")),
        "usernameLength": len(profile_data.get("username", "")),
        "usernameDigitCount": sum(c.isdigit() for c in profile_data.get("username", ""))
    }

    # 3️⃣ Convert to DataFrames
    fake_real_df = pd.DataFrame([fake_real_input])
    automated_df = pd.DataFrame([automated_input])

    print(fake_real_df)
    print(dict(zip(fake_real_features, fake_real_model.feature_importances_)))
    print(automated_df)
    print(dict(zip(automated_features, automated_model.feature_importances_)))


    # 4️⃣ Make predictions
    fake_real_pred = fake_real_model.predict(fake_real_df)[0]
    fake_real_conf = fake_real_model.predict_proba(fake_real_df).max()
    fake_real_importances = dict(zip(fake_real_features, fake_real_model.feature_importances_))

    print("Yohhhhhh",fake_real_model.predict_proba(fake_real_df))


    automated_pred = automated_model.predict(automated_df)[0]
    automated_conf = automated_model.predict_proba(automated_df).max()
    automated_importances = dict(zip(automated_features, automated_model.feature_importances_))

    # 5️⃣ Return combined results
    return {
        "username": username,
        "scraped_data": profile_data,
        "main_profile_table": main_profile_table.to_dict(orient="records"),
        "related_profiles_table": related_profiles_table.to_dict(orient="records"),
        "fake_real": {
            "prediction": int(fake_real_pred),
            "confidence": float(fake_real_conf),
            "feature_importances": fake_real_importances
        },
        "automated": {
            "prediction": int(automated_pred),
            "confidence": float(automated_conf),
            "feature_importances": automated_importances
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005, log_level="info")
