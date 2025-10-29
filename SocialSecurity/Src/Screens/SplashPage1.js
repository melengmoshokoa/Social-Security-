import { StyleSheet,View,Text } from "react-native";
import Square from "../Components/SplashSquare"
import image from '../../assets/vN9u3Zu6.jpg'
import Typewriter from "../Components/Typewriter";

export default function SplashPage1(){
    return(
        <View style={style.container}>

        <Text style={style.Logo}>SocialSecurity</Text>

        <Square
            image={image}
        />
            <Text style={style.contraction}>
                I'm
            </Text>
            <Text style={style.name}>
                SNS
            </Text>
        </View>
    );
}

const style = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#FFF7E9',
   },
   contraction: {
    color: '#000000',
    fontSize: 80,
    marginLeft: 10,
    fontFamily: 'menlo',

   },
   name: {
    fontSize: 210,
    textAlign: 'center',
    marginLeft: 5,
    fontFamily: 'menlo',
   },
   Logo:{
    textAlign: 'center',
    paddingTop: 70,
    fontSize: 18,
    fontWeight: 'bold',
 },
 
 
 });
 