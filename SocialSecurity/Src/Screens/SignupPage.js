import { StyleSheet,View,Text, TextInput, Button, TouchableOpacity,KeyboardAvoidingView,Platform } from "react-native"; 
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";

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

         navigation.navigate("Main");

        if (!email || !password || !username) {
            setError("All fields are required");
            return;
        }
        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email address format");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (username.length < 3) {
            setError("Username must be at least 3 characters long");
            return;
        }
        console.log("This is the username ", username);
      //   try {
      //       //  await signUp(email, password, username);
      //       const data = await registerUser(email, password, username);
      //       console.log("Email verification sent to " + email + ". Please verfiy your email to proceed");

      //       console.log("User Registering???");
      //       await SecureStore.setItemAsync("userToken", data.data.token);
      //       setError("");
      //       console.log("User signed up successfully");
      //       //navigate to the home page with the users info
      //       const userInfo = {
      //           userId: data.data.uid,
      //           username: data.data.username,
      //           //???     token : data.data.token
      //       };
      //       // navigation.navigate("LoginPage", { userInfo });
      //       Alert.alert("Verify Your Email", "A verification email has been sent to your email address. Please verify your email to proceed.", [{ text: "OK", onPress: () => navigation.navigate("LoginPage", { userInfo }) }]);
      //   } catch (error) {
      //       let errorMessage = "Error signing up";
      //       if (error.code === "auth/email-already-in-use") {
      //           errorMessage = "Email address is already in use";
      //       } else if (error.code === "auth/invalid-email") {
      //           errorMessage = "Invalid email address format";
      //       } else if (error.code === "auth/weak-password") {
      //           errorMessage = "Password should be at least 6 characters long";
      //       } else {
      //           console.error("Error signing up:", error);
      //           errorMessage = error.message; // Default to Firebase's error message
      //       }
      //       // console.error("Error signing up:", error);
      //       setError(errorMessage);
      //   }
    };


    return(
        <View style={style.container}>
            {/* <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={style.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}></KeyboardAvoidingView> */}

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