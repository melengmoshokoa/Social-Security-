import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import BottomNav from "../Components/BottomNav";

const activities = [
  { day: 'MON', action: 'Checked username', time: '17:00 pm' },
  { day: 'TUES', action: 'Checked username', time: '17:00 pm' },
  { day: 'THURS', action: 'Check password weakness', time: '18:00 pm' },
  { day: 'FRI', action: 'Checked username', time: '17:00 pm' },
  { day: 'MON', action: 'Checked username', time: '17:00 pm' },
  { day: 'TUES', action: 'Checked username', time: '17:00 pm' },
  { day: 'THURS', action: 'Check password weakness', time: '18:00 pm' },
  { day: 'FRI', action: 'Checked username', time: '17:00 pm' },
];

export default function TimelineScreen() {
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
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 35,
  },
  scrollContent: {
    paddingBottom: 50, 
  },
  row: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'center',
  },
  leftColumn: {
    width: 60,
    alignItems: 'center',
  },
  day: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: '500',
  },
  lineContainer: {
    alignItems: 'center',
  },
  verticalLine: {
    width: 2,
    height: 20,
    backgroundColor: '#888',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#888',
    marginVertical: 2,
  },
  card: {
    flex: 1,
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 12,
  },
  action: {
    fontSize: 14,
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
});
