 import { StatusBar } from 'expo-status-bar';
 import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
 
 export default function BottomNav({imageUrl}) {
   return (
     <View style={styles.container}>
       <TouchableOpacity style={styles.square}>
         {/* <Image source={{ uri: imageUrl}} style={styles.image}/>                                                                                                                                                                                                               */}
       </TouchableOpacity>
       <TouchableOpacity style={styles.square}>
         {/* <Image source={{ uri: imageUrl}} style={styles.image}/>                                                                                                                                                                                                               */}
       </TouchableOpacity>
       <TouchableOpacity style={styles.square}>
         {/* <Image source={{ uri: imageUrl}} style={styles.image}/>                                                                                                                                                                                                               */}
       </TouchableOpacity>
       <StatusBar style="auto" />
     </View>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     backgroundColor: '#fff',
     paddingHorizontal: 10,
    //  paddingTop: 10,
     height: '7%',
     width: '100%',
     paddingBottom: 10,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     marginLeft: 5,
     marginTop: 10,
   },
   square: {
     backgroundColor: "#000000",
     width: '25%',
     height: '100%',
     borderRadius: 30,
     paddingHorizontal: 30,
     alignItems: 'center',
     marginLeft: 5,
     marginTop: 30,
     shadowColor: 'black',
     shadowOffset: {width: 0, height: 4},
     shadowOpacity: 0.25,
     shadowRadius: 4,


   },
   contraction: {
 
   },
   name: {}
 
 
 });
 