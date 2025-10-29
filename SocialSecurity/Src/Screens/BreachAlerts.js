import { StyleSheet,View,Text, Image, ScrollView, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Components from "../Components/Components"
import BottomNav from "../Components/BottomNav";


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
        sortKey === label && { backgroundColor: "#8EC5FC" },
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
    const domain = domainMap[item.Entity] || `${item.Entity.toLowerCase()}.com`;

    return (
      <View style={style.itemContainer}>
        <Image 
          source={{ uri: `https://logo.clearbit.com/${domain}` }} 
          style={{ width: 60, height: 60, marginRight: 10 , borderRadius: 30, backgroundColor: '#FFF7E9'}} 
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
<BottomNav/>
</SafeAreaView>
);
}

const style = StyleSheet.create({
   safeArea: {
    flex: 1,
    backgroundColor: '#FFF7E9',
  },
   container: {
     flex: 1,
     backgroundColor: '#FFF7E9',
   },
   scrollContent: {
    paddingBottom: 50, 
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
    backgroundColor: '#8EC5FC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    color: '#f8f6f6ff',
    marginHorizontal: 10,
  },
  bubbleText: {
  backgroundColor: '#fff',
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 15,
  fontSize: 12,
  color: '#333',
},
sortBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 50,
    marginBottom: 10,
  },
  sortButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 19,
    paddingVertical: 6,
    borderRadius: 25,
    marginRight: 10,
    height: 35,
    alignItems: 'center',
    padddingright: 10,

  },
  sortButtonText: { 
    fontSize: 20,
    color: "#333" },

   
 });
 