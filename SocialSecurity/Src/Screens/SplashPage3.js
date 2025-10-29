import { StyleSheet,View,Text } from "react-native";
import Square from "../Components/SplashSquare"
import image from '../../assets/ZHpXSwPr.jpg'
import Typewriter from "../Components/Typewriter";

export default function SplashPage2(){
    return(
        <View style={style.container}>

        <Text style={style.Logo}>SocialSecurity</Text>

        <Square
            image={ image}
        />
            <Typewriter
            text="Social Security is your digital companion for safer social media. It allows you to report fake profiles or impersonation attempts, giving investigators the data they need to act quickly. By providing alerts and user guidance, the app empowers you to stay informed and protect your online identity."
            style={style.explanation}
            />
    
        </View>
    );
}

const style = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#FFF7E9',
   },
   explanation: {
    color: '#000000',
    fontSize: 20,
    marginLeft: 10,
    fontFamily: 'SpaceMono-Regular', 
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 10,
   },
   Logo:{
    textAlign: 'center',
    paddingTop: 70,
    fontSize: 18,
    fontWeight: 'bold'
 },

 });
 