from flask import Flask, request, jsonify
from serpapi import GoogleSearch

app = Flask(__name__)

SERPAPI_KEY = "eef4231ef0c4222e410f9df416251a0f12f7a7922dc035dfef16de51507ff392"

@app.route('/reverse_image_search', methods=['POST'])
def reverse_image_search():
    try:
        data = request.json
        image_url = data.get('image_url')

        if not image_url:
            return jsonify({"error": "No image URL provided"}), 400

        params = {
            "api_key": SERPAPI_KEY,
            "engine": "google_reverse_image",
            "image_url": image_url,
        }

        search = GoogleSearch(params)
        results = search.get_dict()

        urls = []
        if "image_results" in results:
            for result in results["image_results"]:
                urls.append({
                    "title": result.get("title"),
                    "image_link": result.get("link"),
                    "source": result.get("source")
                })

        return jsonify({"results": urls})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
