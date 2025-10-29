import { StyleSheet,View,Text } from "react-native";
import Square from "../Components/SplashSquare"
import image from '../../assets/ifH7mYy2.jpg'
import Typewriter from "../Components/Typewriter";

export default function SplashPage2(){
    return(
        <View style={style.container}>

        <Text style={style.Logo}>SocialSecurity</Text>

        <Square
            image={image}
        />
            <Typewriter
                text="Social media has become a central part of daily life, allowing people to share their thoughts, photos, and experiences with a global audience instantly. As more personal information is shared online, the risk of identity theft, impersonation, and other cybercrimes has grown significantly."
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
    color: '#2E2E2E',      
    fontSize: 20,
    fontFamily: 'SpaceMono-Regular', 
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 10,
    
   },
   Logo:{
    textAlign: 'center',
    paddingTop: 70,
    fontSize: 18,
    fontWeight: 'bold',
 },

 });
 