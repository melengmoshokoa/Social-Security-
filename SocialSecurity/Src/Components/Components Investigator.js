 import { StatusBar } from 'expo-status-bar';
 import { StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native';
 import { BlurView } from "expo-blur";
 import { LinearGradient } from 'expo-linear-gradient';
 import { useNavigation, useRoute  } from "@react-navigation/native";
 


 export default function Components({imageUrl, pageName, navName, userInfo}) {

 
  console.log("USER ID2",userInfo);

  const navigation = useNavigation();
    
      const Nav= () => {
          navigation.navigate(navName,{userInfo});
        };
    

   return (
     <View style={styles.container}>
       <View style={styles.square}>
        <TouchableOpacity onPress={Nav}>
         <Image source={imageUrl} style={styles.image} resizeMode="cover" /> 
         </TouchableOpacity>                                                                                                                                                                                                             
       </View>
       {/* <BlurView intensity={5} tint="light" style={styles.glass}>
        
       </BlurView> */}

       <Text style={styles.text}>{pageName}</Text>
       
       <StatusBar style="auto" />

     </View>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     backgroundColor: '#FFF7E9',
     paddingHorizontal: 10,
     marginTop: 10,
     height: '90%',
     width: '100%',
   },
   square: {
     backgroundColor: "#000000",
     width: '99%',
     height: '98%',
     borderRadius: 30,
     shadowColor: 'black',
     shadowOffset: {width: 0, height: 4},
     shadowOpacity: 0.25,
     shadowRadius: 4,
     backgroundColor: "rgba(0, 0, 0, 0.3)",
   },
   image: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  glass: {
    position: "absolute",
    bottom: 0,
    left: 6,
    right: 0,
    padding: 8,
    backgroundColor: "rgba(0.1, 0.1, 255, 0.1)", 
    width: '102%',
    height: '101%',
    paddingHorizontal: 10,
    borderRadius: 30,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,          
    textAlign: "center",  
    textShadowColor: "rgba(0,0,0,0.7)",  
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 0,
    paddingVertical: 5,
    position: "absolute",
    bottom: 0,
    left: 6,
    right: 0,
    padding: 8,
  },
 
 
 });
 