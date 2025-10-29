import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashPage from './Src/Screens/SplashPage';
import SplashPage1 from './Src/Screens/SplashPage1';
import SplashPage2 from './Src/Screens/SplashPage2';
import SplashPage3 from './Src/Screens/SplashPage3';
import SplashPage4 from './Src/Screens/SplashPage4';
import Calendar from './Src/Screens/Calendar';
import Calendar2 from './Src/Screens/Calendar copy';
import IncidentCenter from './Src/Screens/IncidentCenter';
import IncidentCenter2 from './Src/Screens/IncidentCentercopy';
import IdentityScanner from './Src/Screens/IdentityScanner';
import Login from './Src/Screens/LoginMain';
import LoginPageUser from './Src/Screens/LoginPageUser';
import LoginPageInvestigator from './Src/Screens/LoginPageInvestigator';
import Main from './Src/Screens/MainPage';
import Main2 from './Src/Screens/MainPageInvestigator';
import Settings from './Src/Screens/Settings';
import Settings2 from './Src/Screens/Settings copy';
import SignupPageInvestigator from "./Src/Screens/SignupPageInvestigator";
import SignupPageUser from "./Src/Screens/SignupPageUser";
import Breachs from "./Src/Screens/BreachAlerts";
import Passwords from "./Src/Screens/Passwords";
import Images from "./Src/Screens/ImageGuard";
import Logs from "./Src/Screens/LogAnalysis";
import Cases from "./Src/Screens/Cases";
import CaseDetails from "./Src/Screens/CaseDetails";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashPage">
        <Stack.Screen name= "SplashPage" component={SplashPage} />
        <Stack.Screen name= "SplashPage1" component={SplashPage1} />
        <Stack.Screen name= "SplashPage2" component={SplashPage2} />
        <Stack.Screen name= "SplashPage3" component={SplashPage3} />
        <Stack.Screen name= "SplashPage4" component={SplashPage4} />
        <Stack.Screen name= "Login" component={Login} />
        <Stack.Screen name= "LoginPageUser" component={LoginPageUser} />
        <Stack.Screen name= "LoginPageInvestigator" component={LoginPageInvestigator} />
        <Stack.Screen name= "SignupPageInvestigator" component={SignupPageInvestigator} />
        <Stack.Screen name= "SignupPageUser" component={SignupPageUser} />
        <Stack.Screen name= "Calendar" component={Calendar} />
        <Stack.Screen name= "Calendar2" component={Calendar2} />
        <Stack.Screen name= "IncidentCenter" component={IncidentCenter} />
        <Stack.Screen name= "IncidentCenter2"component={IncidentCenter2}/>
        <Stack.Screen name= "IdentityScanner" component={IdentityScanner} />
        <Stack.Screen name= "Breachs" component={Breachs} />
        <Stack.Screen name= "Passwords" component={Passwords} />
        <Stack.Screen name= "Images" component={Images} />
        <Stack.Screen name= "Logs" component={Logs} />
        <Stack.Screen name= "Main" component={Main} />
        <Stack.Screen name= "Main2" component={Main2} />
        <Stack.Screen name= "Cases" component={Cases} />
        <Stack.Screen name= "CaseDetails" component={CaseDetails} />
        <Stack.Screen name= "Settings" component={Settings} />
        <Stack.Screen name= "Settings2" component={Settings2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
