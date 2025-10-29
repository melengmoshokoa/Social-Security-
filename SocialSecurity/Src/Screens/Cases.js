import { 
  StyleSheet, View, Text, Image, FlatList, 
  SafeAreaView, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import BottomNav from "../Components/BottomNav";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getLocalIP } from './getLocalIP';


export default function Cases() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


    const navigation = useNavigation();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`http://${getLocalIP()}:8000/getReports`); 
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    console.log("EVIDENCE DATA",Response);

    fetchReports();
  }, []);

  

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <SafeAreaView style={style.container}>
      <Text style={style.title}>User Reports</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => navigation.navigate("CaseDetails", { report: item })}
            >
          <View style={style.itemContainer}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/711/711769.png" }}
              style={{ width: 50, height: 50, marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={style.entity}>{item.report_title}</Text>
              <Text style={style.details} numberOfLines={3}>{item.report_details}</Text>
              <Text style={style.date}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
          </TouchableOpacity>
        )}
      />

      <BottomNav />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E9",
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "menlo",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#8EC5FC',
    marginTop: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 30,
    height: 120,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    backgroundColor: "#fff",
  },
  entity: {
    fontWeight: "bold",
    fontSize: 18,
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
});
