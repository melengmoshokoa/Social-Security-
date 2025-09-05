import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import BottomNav from "../Components/BottomNav";

export default function AccountSettings() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Timeline</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activities.map((item, index) => (
            <View key={index} style={styles.row}>
              {/* Left column with day and timeline */}
              <View style={styles.leftColumn}>
                <Text style={styles.day}>{item.day}</Text>
                <View style={styles.lineContainer}>
                  {index !== 0 && <View style={styles.verticalLine} />}
                  <View style={styles.dot} />
                  {index !== activities.length - 1 && <View style={styles.verticalLine} />}
                </View>
              </View>

              {/* Right column with activity card */}
              <View style={styles.card}>
                <Text style={styles.action}>{item.action}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          ))}


        </ScrollView>
       <BottomNav />
      </View>

       
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  
});
