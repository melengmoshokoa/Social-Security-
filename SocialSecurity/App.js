import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashPage from './Src/Screens/SplashPage1';
import SplashPage2 from './Src/Screens/SplashPage2';
import SplashPage3 from './Src/Screens/SplashPage3';
import SplashPage4 from './Src/Screens/SplashPage4';
import Calendar from './Src/Screens/Calendar';
import IncidentCenter from './Src/Screens/IncidentCenter';
import IdentityScanner from './Src/Screens/IdentityScanner';
import Login from './Src/Screens/LoginPage';
import Main from './Src/Screens/MainPage';
import Settings from './Src/Screens/Settings';
import SignupPage from "./Src/Screens/SignupPage";
import Breachs from "./Src/Screens/BreachAlerts";
import Passwords from "./Src/Screens/Passwords";
import Images from "./Src/Screens/ImageGuard";
import Logs from "./Src/Screens/LogAnalysis";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name= "SplashPage" component={SplashPage} />
        <Stack.Screen name= "SplashPage2" component={SplashPage2} />
        <Stack.Screen name= "SplashPage3" component={SplashPage3} />
        <Stack.Screen name= "SplashPage4" component={SplashPage4} />
        <Stack.Screen name= "Login" component={Login} />
        <Stack.Screen name= "SignupPage" component={SignupPage} />
        <Stack.Screen name= "Calendar" component={Calendar} />
        <Stack.Screen name= "IncidentCenter" component={IncidentCenter} />
        <Stack.Screen name= "IdentityScanner" component={IdentityScanner} />
        <Stack.Screen name= "Breachs" component={Breachs} />
        <Stack.Screen name= "Passwords" component={Passwords} />
        <Stack.Screen name= "Images" component={Images} />
        <Stack.Screen name= "Logs" component={Logs} />
        <Stack.Screen name= "Main" component={Main} />
        <Stack.Screen name= "Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
