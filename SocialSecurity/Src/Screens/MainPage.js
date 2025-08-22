import { StyleSheet,View,Text } from "react-native";
import Components from "../Components/Components"
import BottomNav from "../Components/BottomNav";


export default function MainPage(){
    return (
    <View style={style.container}>


        <View style={style.userinfo2}>
        <View style={style.userinfo}>
        <Text style={style.greeting}>GOOD MORNING ITUMELENG</Text>
        <Text style={style.message}>hope you're havinga a good day</Text>
        
        </View>

        <View style={style.square}>
            <Text>Hi EVERYONNNNNNNNNN</Text>
        </View>

        </View>


        <View style={style.box}>

        <Components
                    // imageUrl={ imageUrl}
        />

        <Components
                    // imageUrl={ imageUrl}
        />

        </View>

        <View style={style.box}>

        <Components
                    // imageUrl={ imageUrl}
        />

        <Components
                    // imageUrl={ imageUrl}
        />

        </View>

        <View style={style.box}>

        <Components
                    // imageUrl={ imageUrl}
        />

        <Components
                    // imageUrl={ imageUrl}
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
     width: '21%',
     height: '20%',
     borderRadius: '50%',
     marginTop: 55,
     marginLeft: 35,
     
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
    fontSize: 18,
   },
   box: {
    flexDirection: 'row',
    height: '23%',
   }
 
 
 });
 