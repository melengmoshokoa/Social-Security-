import React , { useEffect, useState }  from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import BottomNav from "../Components/BottomNav";
import axios from 'axios';
import { getLocalIP } from './getLocalIP';

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

export default function TimelineScreen({route}) {

  const { userInfo } = route.params;

  const [activities, setActivities] = useState([]);
  const API_URL = `http://${getLocalIP()}:8000`;


  useEffect(() => {
    const fetchLogs = async () => {
      try {
        console.log(userInfo)
        const response = await axios.get(`${API_URL}/logs/${userInfo.uid}`);
        const logs = response.data;

        console.log(logs)

        const timelineData = logs.map(log => {
          const date = new Date(log.created_at);
          const dayNames = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'];
          const day = dayNames[date.getDay()];
          const time = date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes() + (date.getHours()>=12?' pm':' am');

          return {
            day,
            action: log.action + (log.details ? `: ${log.details}` : ''),
            time
          };
        });

        setActivities(timelineData.reverse()); 
      } catch (error) {
        console.error("Failed to fetch logs:", error.message);
      }
    };

    fetchLogs();
  }, [userInfo]);
  
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
       
      </View>

       <BottomNav />
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF7E9',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFF7E9',
    fontFamily: 'SpaceMono-Regular', 
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'menlo',
    paddingBottom: 29,
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
    backgroundColor: '#000',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8EC5FC',
    marginVertical: 2,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontFamily: 'SpaceMono-Regular', 
  },
});
