 import { StatusBar } from 'expo-status-bar';
 import { StyleSheet, Text, View } from 'react-native';
 
 export default function Components({imageUrl}) {
   return (
     <View style={styles.container}>
       <View style={styles.square}>
         {/* <Image source={{ uri: imageUrl}} style={styles.image}/>                                                                                                                                                                                                               */}
       </View>
       <StatusBar style="auto" />
     </View>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     backgroundColor: '#fff',
     paddingHorizontal: 10,
     marginTop: 10,
     height: '90%',
     width: '50%',
   },
   square: {
     backgroundColor: "#000000",
     width: '100%',
     height: '99%',
     borderRadius: 30,
   },
   contraction: {
 
   },
   name: {}
 
 
 });
 