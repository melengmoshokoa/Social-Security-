 import { StatusBar } from 'expo-status-bar';
 import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
 import Icon from "@expo/vector-icons/MaterialIcons";
 import { useNavigation, useRoute } from "@react-navigation/native";


 export default function BottomNav() {

  const navigation = useNavigation();
  const route = useRoute();
  const { userInfo } = route.params;
  const NavMain = () => navigation.navigate("Main2", { userInfo });
  const NavCalendar = () => navigation.navigate("Calendar2", { userInfo });
  const NavSettings = () => navigation.navigate("Settings2", { userInfo });


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
  backgroundColor: '#FFF7E9',
  height: '10%',           
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',   
  bottom: 2,              
  left: 0,
  right: 0,
  paddingVertical: 10,
  elevation: 5,
},
   square: {
  backgroundColor: "#8EC5FC",
  width: '25%',
  height: '80%',
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: 5,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  paddingVertical: 10,
},
 
 });
 