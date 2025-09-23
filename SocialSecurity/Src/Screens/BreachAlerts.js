import { StyleSheet,View,Text, Image, ScrollView, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Components from "../Components/BreachNotification"
import BottomNav from "../Components/BottomNav";
import image1 from "../Images/200.gif"
import image2 from "../Images/222.gif"
import image3 from "../Images/123.gif"
import image4 from "../Images/333.gif"
import image5 from "../Images/444.gif"
import image6 from "../Images/111.gif"

export default function BreachAlerts(){
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [domainMap, setDomainMap] = useState({});
  const [sortKey, setSortKey] = useState("Year");


  useEffect(() => {
    fetch("https://raw.githubusercontent.com/melengmoshokoa/Social-Security-/main/breaches.json")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);

        const tempMap = {};
      json.forEach(item => {
        const entity = item.Entity;
        tempMap[entity] = `${entity.toLowerCase()}.com`;
      });
      setDomainMap(tempMap); 
      setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  

  if (loading) return <ActivityIndicator size="large" />;

  const sortedData = [...data].sort((a, b) => {
    if (sortKey === "Year") return b.Year.localeCompare(a.Year);
    if (sortKey === "Records")
      return parseInt(a.Records) - parseInt(b.Records) || 0;
    if (sortKey === "Entity") return b.Entity.localeCompare(a.Entity);
    return 0;
  });

  const renderSortButton = (label) => (
    <TouchableOpacity
      style={[
        style.sortButton,
        sortKey === label && { backgroundColor: "#000" },
      ]}
      onPress={() => setSortKey(label)}
    >
      <Text
        style={[
          style.sortButtonText,
          sortKey === label && { color: "#fff" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

    return (


      <SafeAreaView style={style.container}>
      {/* Title */}
      <Text style={style.title}>Data Breaches</Text>

      {/* Sorting bar */}
      <View style={style.sortBar}>
        {renderSortButton("Year")}
        {renderSortButton("Records")}
        {renderSortButton("Entity")}
      </View>

     <FlatList
  data={sortedData}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => {
    // get mapped domain, or fallback
    const domain = domainMap[item.Entity] || `${item.Entity.toLowerCase()}.com`;

    return (
      <View style={style.itemContainer}>
        <Image 
          source={{ uri: `https://logo.clearbit.com/${domain}` }} 
          style={{ width: 60, height: 60, marginRight: 10 , borderRadius: 30 }} 
        />
        <View style={{paddingHorizontal: 10}}>
          <Text style={style.entity}>{item.Entity}</Text>
          <Text>Records: {item.Records && item.Records !== "unknown" 
            ? item.Records.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") 
            : item.Records}</Text>
          <Text>Method: {item.Method}</Text>
          <View style={style.bubble}>
            <Text style={style.year}> {item.Year.slice(0,4)}</Text>
            <Text style={style.bubbleText}> {item.Industry}</Text>
            
          </View>
        </View>
      </View>
    );
  }}
/>
</SafeAreaView>
);
}

const style = StyleSheet.create({
   safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
   container: {
     flex: 1,
     backgroundColor: '#fff',
   },
   scrollContent: {
    paddingBottom: 50, 
  },
  title: {
    fontSize: 30, 
    fontWeight: '600', 
    marginTop: 20, 
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  itemContainer:{
    flexDirection: "row", 
    alignItems: "center",
    borderWidth: 2,
    marginTop: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 30,
    height: 120,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 7,
  },
  entity:{
    fontWeight: 'bold',
    fontSize: 18,
  },
  bubble:{
    flexDirection: "row",
    paddingHorizontal: 1,
    paddingTop: 8,
    alignItems: 'center',
  },
  year:{
    backgroundColor: '#240505ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    color: '#f8f6f6ff',
    marginHorizontal: 10,
  },
  bubbleText: {
  backgroundColor: '#eee',
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 15,
  fontSize: 12,
  color: '#333',
},
sortBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sortButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 19,
    paddingVertical: 6,
    borderRadius: 25,
    marginRight: 10,
    height: 40,
    alignItems: 'center',
    // width: 95,

  },
  sortButtonText: { 
    fontSize: 20,
    color: "#333" },

   
 });
 