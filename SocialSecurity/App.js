import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashPage from './Src/Screens/SplashPage4';
import Main from "./Src/Screens/MainPage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashPage">
        <Stack.Screen name= "SplashPage" component={SplashPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
