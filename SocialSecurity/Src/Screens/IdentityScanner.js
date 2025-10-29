import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import BottomNav from "../Components/BottomNav Invest";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useNavigation, useRoute  } from "@react-navigation/native";
import { getLocalIP } from './getLocalIP';


export default function IdentityScanner() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ checked: 0, total: 0 });

  const route = useRoute();
  const { userInfo } = route.params || {};
  const userId = userInfo?.uid;
  
  const handleSearch = async () => {
  if (!searchQuery.trim()) return;

  setLoading(true);
  setProgress({ checked: 0, total: 0 });

  const baseUrls = {
      Instagram: "https://www.instagram.com/",
      TikTok: "https://www.tiktok.com/@",
      Twitter: "https://twitter.com/"
    };

  

  try {
    const response = await fetch(`http://${getLocalIP()}:8002/scan/${searchQuery}?user_id=${userInfo.uid}`);
    const data = await response.json();
    console.log('sherlock',data["Sherlock Results"]);
    console.log('manual',data["Manual Checks"]);
    
    const sherlockResults = data["Sherlock Results"] || {};
    const manualResults = data["Manual Checks"] || {};

    const combined = { ...sherlockResults };

    Object.entries(manualResults).forEach(([platform, status]) => {
      if (status === "Found" && !combined[platform]) {
        combined[platform] = (baseUrls[platform] || "") + searchQuery;
      }
    });

    setResults(combined);
  } catch (error) {
    console.error("Error fetching results:", error);
  }
  finally {
  setLoading(false);
}
};



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Identity Scanner</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search identity..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />

            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close" size={20} color="#888" style={styles.clearIcon} />
              </TouchableOpacity>
            )}
          </View>

          {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8EC5FC" /> 
                <Text style={styles.loadingText}>Scanning social media's...</Text>
              </View>
            )}
          {Object.keys(results).length > 0 && (
            <View style={styles.resultsContainer}>
              {Object.entries(results).map(([platform, url]) => (
                <TouchableOpacity
                  key={platform}
                  style={styles.resultItem}
                  onPress={() => Linking.openURL(url)}
                >
                  <Text style={styles.platform}>{platform}</Text>
                  <Text style={styles.url}>{url}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'menlo',
    paddingBottom: 39,
  },
  scrollContent: { 
    paddingBottom: 50 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
  },
  searchIcon: { marginRight: 10 },
  clearIcon: { marginLeft: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  resultsContainer: { marginTop: 20 },
  resultItem: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#ffffffff',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#8EC5FC"
  },
  platform: { 
  fontWeight: 'bold', 
  fontSize: 16, 
  marginBottom: 3,
  fontFamily: 'SpaceMono-Regular', 
},
  url: { 
    color: '#8EC5FC' 
  },
  loadingContainer: {
  paddingTop: 15,
  borderRadius: 15,
  backgroundColor: '#FFF7E9',
  marginBottom: 10,
  alignItems: 'center',
},
loadingText: {
  fontSize: 16,
  color: '#555',
  fontStyle: 'italic',
},
});
