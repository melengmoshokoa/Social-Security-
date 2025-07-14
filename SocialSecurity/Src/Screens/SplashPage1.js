import { StyleSheet,View,Text } from "react-native";
import Square from "../Components/SplashSquare"

export default function SplashPage1(){
    return(
        <View style={style.container}>
        <Square
            // imageUrl={ imageUrl}
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
     backgroundColor: '#fff',
   },
   contraction: {
    color: '#000000',
    fontSize: 80,
    marginLeft: 10,

   },
   name: {
    fontSize: 210,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
   }
 
 
 });
 