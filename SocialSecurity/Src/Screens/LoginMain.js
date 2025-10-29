import { StyleSheet,View,Text, TextInput, Button, TouchableOpacity,KeyboardAvoidingView,Platform } from "react-native"; 
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase"
import Square from "../Components/SplashSquare"
import image from '../../assets/AjMXYycF.jpg'


export default function LoginPage(){


    const navigation = useNavigation();
    

    const handleUser= () => {
      navigation.navigate("LoginPageUser");
    };

    const handleInvestigator= () => {
      navigation.navigate("LoginPageInvestigator");
    };


    return(
        <View style={style.container}>
            
            <Text style={style.Logo}>SocialSecurity</Text>

             <Square
                        image={image}
                    />

            <View style={style.login}>

               

            <Text style={style.text1}>Log into your account</Text>
            
 
            <TouchableOpacity style={style.button} onPress={handleUser}>
                <Text style={style.buttonText}>User</Text>
            </TouchableOpacity>

            <TouchableOpacity style={style.button} onPress={handleInvestigator}>
                <Text style={style.buttonText}>Investogator</Text>
            </TouchableOpacity>

            </View>

        </View>
    );
}

const style = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#FFF7E9',
 },
 Logo:{
    textAlign: 'center',
    paddingTop: 70,
    fontSize: 18,
    fontWeight: 'bold'
 },
 text1:{
    marginTop: 0,
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Menlo',
 },
 login:{
    alignItems: 'center',
    marginTop: 0,
 },
 usernameInput: {
    marginTop: 50,
    borderWidth: 1,
    width: '80%',
    height: '50',
    borderRadius: 30,
    paddingHorizontal: 10,
 },
 passwordInput: {
    marginTop: 40,
    borderWidth: 1,
    width: '80%',
    height: '50',
    borderRadius: 30,
    paddingHorizontal: 10,
 },
 button:{
    marginTop: 50,
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: '#8EC5FC',
    width: '80%',
    height: '50',
    shadowColor: '#e6d5f5ff',            
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,   
    

 },
 buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: '5%',
    fontFamily: 'Menlo',

 },
 button2: {
   marginTop: 18,
   color: '#828282'
 }



});