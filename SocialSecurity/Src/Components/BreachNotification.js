import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from "@expo/vector-icons/MaterialIcons";
 
 export default function BreachNotifications({imageUrl}) {
   return (
     <View style={styles.container}>
       <View style={styles.square}>
         {/* <Image source={{ uri: imageUrl}} style={styles.image}/>   
               
               */}

            <View style={styles.combo2}>   

            <Text  style={styles.date}>Date of the breach</Text>

            <TouchableOpacity style={styles.icon}>
                <Icon name="arrow-forward-ios" size={23} color="#fff"/>                                                                                                                                                                                                              */}
            </TouchableOpacity>

            </View>

            <Text  style={styles.date}>Date of the breach</Text>

            <Text  style={styles.date}>Date of the breach</Text>

            <View style={styles.combo}>

            {/* <View style={styles.companyLogo}></View> */}
            
            <Text  style={styles.date}>Date of the breach</Text>

            

            <Text  style={styles.date}>Date of the breach</Text>

            </View>

            

        </View>
       <StatusBar style="auto" />
     </View>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     backgroundColor: '#fff',
     alignItems: 'center',
     marginTop: 0,
     height: '220',
   },
   square: {
     backgroundColor: "#888",
     width: '90%',
     height: '75%',
     borderRadius: 30,
     paddingTop: 10,
   },
   date: {
    paddingHorizontal: 25,
    fontWeight: 17,
    paddingTop: 5,
   },
   info: {
    paddingHorizontal: 15,
    paddingTop: 30,
    width: '53%',
   },
   companyLogo:{
     width: '35%',
     height: '68%',
     backgroundColor: '#000',
     paddingHorizontal: 65,
     paddingTop: 10,
     margin: 10,
     borderRadius: 25,
   },
   combo:{
     flexDirection: "row",
     width: '100%',
     height: '100%',
   },
   combo2:{
     flexDirection: "row",
     width: '100%',
     height: '15%',
   },
   icon:{
     position: 'absolute',
     right: 13
   }

 });
 