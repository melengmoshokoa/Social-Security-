import { StyleSheet,View,Text } from "react-native";
import Square from "../Components/SplashSquare"

export default function SplashPage2(){
    return(
        <View style={style.container}>
        <Square
            // imageUrl={ imageUrl}
        />
            <Text style={style.explanation}>
                I am a security companion that keeps you safe while your online 
            </Text>
    
        </View>
    );
}

const style = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
   },
   explanation: {
    color: '#000000',
    fontSize: 20,
    marginLeft: 10,
    marginTop: 10,
   },

 });
 