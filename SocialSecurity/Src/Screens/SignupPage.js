import { StyleSheet,View,Text, TextInput, Button, TouchableOpacity,KeyboardAvoidingView,Platform } from "react-native"; 
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import {auth} from "../../firebase"
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function SignupPage(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState("");

    const navigation = useNavigation();

    const handleExistingUser = () => {
        navigation.navigate("Login"); 
    };

    const handleSignup = async () => {

 try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const idToken = await userCredential.user.getIdToken();
    await updateProfile(userCredential.user, { displayName: username });

    // const response = await fetch("http://10.0.0.120:8081/verify", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ token: idToken }),
    // });

    // console.log("*********");
    // console.log(response.text());
    // if (!response.ok) {
    //     throw new Error("This email is already being used");
    // }

    const userInfo = {
        username : username,
        email : email
    }

    navigation.navigate("Main", { userInfo });
  } catch (error) {
    setError(error.message);
  }
};
    


    return(
        <View style={style.container}>
            
            <Text style={style.Logo}>SocialSecurity</Text>

            <View style={style.login}>

            <Text style={style.text1}>Create an account</Text>

            <TextInput
            style={style.usernameInput}
            value = {username}
            onChangeText={setUsername}
            placeholder="Enter username"
            />
            <Text>username</Text>

            <TextInput
            style={style.emailInput}
            value = {email}
            onChangeText={setEmail}
            placeholder="Email@domain.com"
            />
            <Text>email</Text>

            <TextInput
            style={style.passwordInput}
            value = {password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Enter Password"
            />
            <Text>password</Text>
            
            <TouchableOpacity style={style.button} onPress={handleSignup}>
                <Text style={style.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleExistingUser}>
                            <Text style={style.button2}>Have an account? Login</Text>
                        </TouchableOpacity>

            </View>

        </View>
    );
}

const style = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#fff',
 },
 Logo:{
    textAlign: 'center',
    paddingTop: 70,
    fontSize: 18,
    fontWeight: 'bold'
 },
 text1:{
    marginTop: 50,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
 },
 login:{
    alignItems: 'center',
    marginTop: 30,
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
 emailInput: {
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
    backgroundColor: '#000',
    width: '80%',
    height: '50',

 },
 buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: '5%',

 },
 button2: {
   marginTop: 18,
   color: '#828282'
 }



});