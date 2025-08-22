import { StyleSheet,View,Text, TextInput, Button, TouchableOpacity,KeyboardAvoidingView,Platform } from "react-native"; 
import React, {useState} from "react";

export default function LoginPage(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    return(
        <View style={style.container}>
            {/* <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={style.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}></KeyboardAvoidingView> */}

            <Text style={style.Logo}>SocialSecurity</Text>

            <View style={style.login}>

            <Text style={style.text1}>Log into your account</Text>

            <TextInput
            style={style.usernameInput}
            value = {username}
            onChangeText={setUsername}
            placeholder="Enter username"
            />
            <Text>username</Text>

            <TextInput
            style={style.passwordInput}
            value = {password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Enter Password"
            />
            <Text>password</Text>
            
            <TouchableOpacity style={style.button}>
                <Text style={style.buttonText}>Log in</Text>
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

 }



});