import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import BottomNav from "../Components/BottomNav";

export default function TimelineScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Report</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>

            <TextInput
             style={styles.incident}
             placeholder="Title of Incident"
            />

             <TextInput
             style={styles.description}
             placeholder="Description"
            />

            <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>

        </ScrollView>
       <BottomNav />
      </View>

       
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    justifyItems: 'center'
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyItems: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 35,
  },
  scrollContent: {
    // paddingBottom: 50,  
  },
  incident: {
    marginTop: 0,
    borderWidth: 1,
    width: '95%',
    height: '50',
    borderRadius: 30,
    paddingHorizontal: 10,
    justifyItems: 'center'
  },
  description: {
    marginTop: 25,
    borderWidth: 1,
    width: '95%',
    height: '180',
    borderRadius: 30,
    paddingHorizontal: 10,
    justifyItems: 'center'
  },
  button:{
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: '#000',
    width: '95%',
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