import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Linking } from 'react-native';
import BottomNav from "../Components/BottomNav";
import Icon from "@expo/vector-icons/MaterialIcons";

// Example output from Sherlock (after filtering)
const mockSherlockOutput = {
  GitHub: "https://github.com/johndoe",
  Facebook: null,
  Instagram: "https://www.instagram.com/johndoe",
  Twitter: null,
  LinkedIn: "https://www.linkedin.com/in/johndoe"
};

export default function IdentityScanner() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState({});

  // Mock search function
  const handleSearch = () => {
    // Replace this with actual Sherlock API call
    const filtered = Object.fromEntries(
      Object.entries(mockSherlockOutput).filter(([_, url]) => url)
    );
    setResults(filtered);
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

          {/* Display results */}
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

        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fff' },
  container: { 
    flex: 1, 
    paddingHorizontal: 20, 
    backgroundColor: '#fff' },
  title: { 
    fontSize: 30, 
    fontWeight: '600', 
    marginTop: 20, 
    marginBottom: 20 },
  scrollContent: { 
    paddingBottom: 50 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  clearIcon: { marginLeft: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  resultsContainer: { marginTop: 20 },
  resultItem: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#e5e5e5',
    marginBottom: 10,
  },
  platform: { fontWeight: 'bold', fontSize: 16, marginBottom: 3 },
  url: { color: '#007AFF' },
});
