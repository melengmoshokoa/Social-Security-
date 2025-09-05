import { StyleSheet,View,Text, Image, ScrollView, SafeAreaView  } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Components from "../Components/BreachNotification"
import BottomNav from "../Components/BottomNav";
import image1 from "../Images/200.gif"
import image2 from "../Images/222.gif"
import image3 from "../Images/123.gif"
import image4 from "../Images/333.gif"
import image5 from "../Images/444.gif"
import image6 from "../Images/111.gif"

export default function MainPage(){

    return (
<SafeAreaView style={style.safeArea}>
    <View style={style.container}>
        <Text style={style.title}>Breachs</Text>

        <ScrollView contentContainerStyle={style.scrollContent}>

        <Components
                    imageUrl={image1}
                    pageName="Incident Center"
                    navName="IncidentCenter"           
        />

        <Components
                    imageUrl={image1}
                    pageName="Incident Center"
                    navName="IncidentCenter"           
        />

        <Components
                    imageUrl={image1}
                    pageName="Incident Center"
                    navName="IncidentCenter"           
        />

        <Components
                    imageUrl={image1}
                    pageName="Incident Center"
                    navName="IncidentCenter"           
        />
        
        </ScrollView>
        

        <BottomNav/>
        
    </View>

</SafeAreaView>
);
}

const style = StyleSheet.create({
   safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
   container: {
     flex: 1,
     backgroundColor: '#fff',
   },
   scrollContent: {
    paddingBottom: 50, 
  },
  title: {
    fontSize: 30, 
    fontWeight: '600', 
    marginTop: 20, 
    marginBottom: 20,
    paddingHorizontal: 20,
  },
   
 });
 