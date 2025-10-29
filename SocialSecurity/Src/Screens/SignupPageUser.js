import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from "react-native"; 
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import axios from "axios";
import image from '../../assets/92377be413940d8fb433998cbbae6d83-removebg-preview.png'
import { getLocalIP } from './getLocalIP';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    // Make sure this matches your Flask server port
    const API_URL = `http://${getLocalIP()}:8000`; // Changed to match Flask port

    const handleExistingUser = () => {
        navigation.navigate("LoginPageUser"); 
    };

    const createUser = async (firebase_uid, username, email) => {
        try {
            console.log("Sending user data to PostgreSQL...");
            const res = await axios.post(`${API_URL}/users`, { 
                firebase_uid, 
                username, 
                email 
            });
            console.log("User created in PostgreSQL:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error creating user in PostgreSQL:", error.response?.data || error.message);
            throw error;
        }
    };

    const handleSignup = async () => {
        if (!username || !email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            console.log("Creating Firebase user...");
            
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const firebase_uid = user.uid;

            console.log("Firebase user created:", firebase_uid);

            // 2. Update Firebase profile with username
            await updateProfile(user, { 
                displayName: username 
            });
            console.log("Firebase profile updated");

            // 3. Create user in PostgreSQL
            await createUser(firebase_uid, username, email);
            console.log("User successfully created in both Firebase and PostgreSQL");

            // 4. Navigate to main screen
            const userInfo = {
                username: username,
                email: email,
                uid: firebase_uid
            };

            navigation.navigate("Main", { userInfo });

        } catch (error) {
            console.error("Signup error:", error);
            let errorMessage = "Signup failed. Please try again.";
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already registered.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password should be at least 6 characters.";
            } else if (error.response) {
                // Axios error (PostgreSQL)
                errorMessage = "Database error: " + (error.response.data?.message || "Failed to create user");
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.Logo}>SocialSecurity</Text>

            <View style={styles.login}>
                <Text style={styles.text1}>Create an account</Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TextInput
                    style={styles.usernameInput}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter username"
                    autoCapitalize="none"
                />
                <Text>username</Text>

                <TextInput
                    style={styles.emailInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email@domain.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <Text>email</Text>

                <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    placeholder="Enter Password"
                    autoCapitalize="none"
                />
                <Text>password</Text>
                
                <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]} 
                    onPress={handleSignup}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleExistingUser}>
                    <Text style={styles.button2}>Have an account? Login</Text>
                </TouchableOpacity>
            </View>
            <Image source={image} style={styles.image} resizeMode="contain"/>  
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF7E9',
    },
    Logo: {
        textAlign: 'center',
        paddingTop: 70,
        fontSize: 18,
        fontWeight: 'bold'
    },
    text1: {
        marginTop: 50,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'menlo',
    },
    login: {
        alignItems: 'center',
        marginTop: 30,
    },
    usernameInput: {
        marginTop: 50,
        borderWidth: 1,
        width: '80%',
        height: 50,
        borderRadius: 30,
        paddingHorizontal: 10,
    },
    passwordInput: {
        marginTop: 40,
        borderWidth: 1,
        width: '80%',
        height: 50,
        borderRadius: 30,
        paddingHorizontal: 10,
    },
    emailInput: {
        marginTop: 40,
        borderWidth: 1,
        width: '80%',
        height: 50,
        borderRadius: 30,
        paddingHorizontal: 10,
    },
    button: {
        marginTop: 50,
        borderWidth: 1,
        borderRadius: 30,
        backgroundColor: '#8EC5FC',
        width: '80%',
        height: 50,
        justifyContent: 'center',
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
        fontFamily: 'menlo',
    },
    button2: {
        marginTop: 18,
        color: '#828282'
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    image: {
     width: '100%',
    flex: 1,            
    borderRadius: 30,
    marginTop: 20,
    },
});