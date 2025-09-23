import { StyleSheet,View,Text, TextInput, Button, TouchableOpacity,KeyboardAvoidingView,Platform } from "react-native"; 
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase"


export default function LoginPage(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const navigation = useNavigation();
    

    const handleNewUser = () => {
      navigation.navigate("SignupPage");
    };

    const LoginUser = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const idToken = await userCredential.user.getIdToken();

    const response = await fetch("http://10.0.0.120:5000/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken }),
    });


    console.log(response);
    if (!response.ok){
      throw {status: response.status, message: response.text()};
    }

    const userInfo = {
        username : username,
        email : email
    }

    navigation.navigate("Main", {userInfo});
  } catch (error) {
    console.log("Login failed:", error.message);
  }
};




    return(
        <View style={style.container}>
            
            <Text style={style.Logo}>SocialSecurity</Text>

            <View style={style.login}>

            <Text style={style.text1}>Log into your account</Text>

            <TextInput
            style={style.usernameInput}
            value = {username}
            onChangeText={setUsername}
            placeholder="Enter username"
            />

            <TextInput
            style={style.usernameInput}
            value = {email}
            onChangeText={setEmail}
            placeholder="Enter email"
            />
            

            <TextInput
            style={style.passwordInput}
            value = {password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Enter Password"
            />
            

             <TouchableOpacity
                            style={style.forgot}
                            onPress={() => {
                                navigation.navigate("ForgotPasswordPage");
                            }}>
                            <Text style={style.button2}>Forgot password?</Text>
                        </TouchableOpacity>
            
            <TouchableOpacity style={style.button} onPress={LoginUser}>
                <Text style={style.buttonText}>Log in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNewUser}>
                <Text style={style.button2}>Don't have an account? Sign up</Text>
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