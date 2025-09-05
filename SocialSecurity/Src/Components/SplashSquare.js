 import { StatusBar } from 'expo-status-bar';
 import { StyleSheet, Text, View } from 'react-native';
 
 export default function SplashSquare({imageUrl}) {
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
     alignItems: 'center',
     marginTop: 10,
     height: '55%',
   },
   square: {
     backgroundColor: "#000000",
     width: '75%',
     height: '80%',
     borderRadius: 30,
     marginTop: 50
   },
   contraction: {
 
   },
   name: {}
 
 
 });
 