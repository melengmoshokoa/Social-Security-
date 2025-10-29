 import { StatusBar } from 'expo-status-bar';
 import { StyleSheet, Text, View, Image } from 'react-native';
 
 export default function SplashSquare({image}) {
   return (
     <View style={styles.container}>
       <View style={styles.square}>
         <Image source={image} style={styles.image} />                                                                                                                                                                                                           
       </View>
       <StatusBar style="auto" />
     </View>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     backgroundColor: '#FFF7E9',
     alignItems: 'center',
     marginTop: 10,
     height: '50%',
   },
   square: {
    //  backgroundColor: "#000000",
     width: '75%',
     height: '90%',
     borderRadius: 30,
     marginTop: 10,
     shadowColor: '#000000ff',
     shadowOffset: { width: 0, height: 8 },
     shadowOpacity: 0.3,
     shadowRadius: 10,
   },
   contraction: {
 
   },
   name: {},
   image: {
     width: '100%',
     height: '95%',
     borderRadius: 30,
    }
 
 
 });
 