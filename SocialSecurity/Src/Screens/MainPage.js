import { StyleSheet,View,Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Components from "../Components/Components"
import BottomNav from "../Components/BottomNav";
import image1 from "../Images/200.gif"
import image2 from "../Images/222.gif"
import image3 from "../Images/123.gif"
import image4 from "../Images/333.gif"
import image5 from "../Images/444.gif"
import image6 from "../Images/111.gif"

export default function MainPage(){

    return (
    <View style={style.container}>


        <View style={style.userinfo2}>
        <View style={style.userinfo}>
        <Text style={style.greeting}>GOOD MORNING ITUMELENG</Text>
        <Text style={style.message}>hope you're havinga a good day</Text>
        
        </View>

        <View style={style.square}>
            
        </View>

        </View>


        <View style={style.box}>

        <Components
                    imageUrl={image1}
                    pageName="Incident Center"
                    navName="IncidentCenter"
                    
        />

        <Components
                    imageUrl={image2}
                    pageName="Log Analysis"
                    navName="Logs"
        />

        </View>

        <View style={style.box}>

        <Components
                    imageUrl={image3}
                    pageName="Identity Scanner"
                    navName="IdentityScanner"
        />

        <Components
                    imageUrl={image4}
                    pageName="Breach Alerts"
                    navName="Breachs"
        />

        </View>

        <View style={style.box}>

        <Components
                    imageUrl={image5}
                    pageName="Image Guard"
                    navName="Images"
        />

        <Components
                    imageUrl={image6}
                    pageName="Password Saftey"
                    navName="Passwords"
        />

        </View>

        <BottomNav/>
        
    </View>
);
}

const style = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
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
   },
   greeting: {
    paddingTop: 65,
    paddingHorizontal: 15,
    fontWeight: 'bold',
    fontSize: 20,
   },
   box: {
    flexDirection: 'row',
    height: '23%',
   },
 
 
 });
 