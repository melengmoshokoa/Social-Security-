 import { StatusBar } from 'expo-status-bar';
 import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
 import Icon from "@expo/vector-icons/MaterialIcons";
 import { useNavigation } from "@react-navigation/native";



 export default function BottomNav({imageUrl}) {

  const navigation = useNavigation();

  const NavMain = () => {
      navigation.navigate("Main");
    };

    const NavCalendar = () => {
      navigation.navigate("Calendar");
    };

    const NavSettings = () => {
      navigation.navigate("Settings");
    };


   return (
     <View style={styles.container}>
       <TouchableOpacity style={styles.square} onPress={NavCalendar}>
        <Icon name="calendar-today" size={23} color="#fff" />
         {/* <Image source={{ uri: imageUrl}} style={styles.image}/>                                                                                                                                                                                                               */}
       </TouchableOpacity>
       <TouchableOpacity style={styles.square} onPress={NavMain}>
        <Icon name="hive" size={25} color="#fff" />
         {/* <Image source={{ uri: imageUrl}} style={styles.image}/>                                                                                                                                                                                                               */}
       </TouchableOpacity>
       <TouchableOpacity style={styles.square} onPress={NavSettings}>
        <Icon name="settings" size={25} color="#fff" />
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
     paddingTop: 10


   },
   contraction: {
 
   },
   name: {}
 
 
 });
 