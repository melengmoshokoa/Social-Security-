import { StyleSheet,View,Text, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Components from "../Components/Components Investigator"
import BottomNav from "../Components/BottomNav Invest";
import image1 from "../../../SocialSecurity/assets/iEc2lRM7.jpg"
import image2 from "../../../SocialSecurity/assets/oKi8wAGL.jpg"
import image4 from "../../../SocialSecurity/assets/End00Rjn.jpg"
import image6 from "../../../SocialSecurity/assets/Etn-Fg-W.jpg"

export default function MainPageInvestigator(){

    const route = useRoute();
    const { userInfo } = route.params;

    
  console.log("USER ID",userInfo);

    const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

    return (
    <View style={style.container}>


        <View style={style.userinfo2}>
        <View style={style.userinfo}>
        <Text style={style.greeting}>{getGreeting().toUpperCase()} {userInfo.username}</Text>
        <Text style={style.message}>hope you're havinga a good day</Text>
        
        </View>

        <View style={style.square}>
            
        </View>

        </View>


        <View style={style.box}>

        <Components
                    imageUrl={image1}
                    pageName="Cases"
                    navName="Cases"
                    userInfo={userInfo}
                    
        />

        </View>

        <View style={style.box}>

        <Components
                    imageUrl={image2}
                    pageName="Anomaly Detection"
                    navName="IncidentCenter2"
                    userInfo={userInfo}
        />


        </View>

        <View style={style.box}>

        <Components
                    imageUrl={image6}
                    pageName="Image Guard"
                    navName="Images"
                    userInfo={userInfo}
        />

        </View>

        <View style={style.box}>

        <Components
                    imageUrl={image4}
                    pageName="Identity Scanner"
                    navName="IdentityScanner"
                    userInfo={userInfo}
        />


        </View>

        <BottomNav userInfo={userInfo}/>
        
    </View>
);
}

const style = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#FFF7E9',
   },
   userinfo:{
    width: '65%',
   },
   userinfo2:{
    flexDirection: 'row',
    height: '19%',

   },
   square: {
     paddingTop: 80,
     backgroundColor: "#000000",
     width: 80,
     height: 70,
     borderRadius: 60,
     marginTop: 55,
     marginLeft: 35,
     borderWidth: 1,
     borderColor: '#828282'
     
   },
   message: {
    paddingTop: 5,
    paddingHorizontal: 17,
    paddingBottom: 20,
    fontFamily: 'SpaceMono-Regular', 
   },
   greeting: {
    paddingTop: 65,
    paddingHorizontal: 15,
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'menlo',
   },
   box: {
     paddingTop: 8,
    height: '16%',
   },
 
 
 });
 