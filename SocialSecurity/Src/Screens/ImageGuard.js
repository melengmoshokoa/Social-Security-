import React, { useState } from "react";
import { View,Text, TouchableOpacity, Image, ScrollView, StyleSheet, Linking, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import BottomNav from "../Components/BottomNav Invest";
import { useNavigation, useRoute  } from "@react-navigation/native";
import { getLocalIP } from './getLocalIP';

export default function ImageGuard() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const route = useRoute();
  const { userInfo } = route.params || {};
  const userId = userInfo?.uid;

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access gallery is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0]);
        setResults([]);
        setError("");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Error selecting image");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access camera is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0]);
        setResults([]);
        setError("");
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      alert("Error taking photo");
    }
  };

  const handleSearch = async () => {
    if (!image) return;

    setLoading(true);
    setResults([]);
    setError("");

    const formData = new FormData();
    formData.append("file", {
      uri: image.uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    formData.append("user_id", userInfo.uid);
    

    try {
      const API_URL = `http://${getLocalIP()}:8080/reverse-search`;
      
      const response = await axios.post(API_URL, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      });

      if (response.data.error) {
        setError(response.data.error);
        Alert.alert("Search Error", response.data.error);
      } else {
        setResults(Array.isArray(response.data.results) ? response.data.results : []);
        if (response.data.results.length === 0) {
          setError("No similar images found");
        }
      }
      
    } catch (err) {
      console.error("Search error:", err);
      const errorMessage = err.response?.data?.error || err.message || "Search failed";
      setError(errorMessage);
      Alert.alert("Search Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setImage(null);
    setResults([]);
    setError("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Image Search</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {!image ? (
          <View style={styles.uploadSection}>
            <View style={styles.uploadButtons}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.imageSection}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.preview} resizeMode="cover" />
              
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={clearAll}>
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                  <Text style={styles.actionButtonText}>Change</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.searchButton]} 
                  onPress={handleSearch}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={[styles.actionButtonText, styles.searchButtonText]}>
                       Search
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {results.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Found {results.length} similar images:</Text>
            
            {results.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.resultCard} 
                onPress={() => Linking.openURL(item.link)}
              >
                {item.thumbnail && (
                  <Image 
                    source={{ uri: item.thumbnail }} 
                    style={styles.resultImage} 
                    resizeMode="cover" 
                  />
                )}
                <View style={styles.resultContent}>
                  <Text style={styles.resultTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.resultLink} numberOfLines={1}>
                    {item.link}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8EC5FC" />
            <Text style={styles.loadingText}>Searching for similar images...</Text>
            <Text style={styles.loadingSubtext}>This may take a few moments</Text>
          </View>
        )}

        
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E9",
  },
  header: {
    backgroundColor: "#FFF7E9",
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 0,
    shadowColor: "#000",
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'menlo',
    paddingBottom: 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  uploadSection: {
    backgroundColor: "#FFF7E9",
    borderRadius: 16,
    padding: 30,
    marginTop: 20,
  },
  uploadButtons: {
    gap: 15,
  },
  uploadButton: {
    backgroundColor: "#8EC5FC",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#8EC5FC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  imageSection: {
    marginTop: 20,
  },
  imageContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  preview: {
    width: "100%",
    height: 300,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  searchButton: {
    backgroundColor: "#8EC5FC",
    shadowColor: "#8EC5FC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  searchButtonText: {
    color: "#fff",
  },
  errorContainer: {
    backgroundColor: "#ffeaea",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#e28080ff",
  },
  errorText: {
    color: "#d63031",
    fontSize: 14,
    fontWeight: "500",
  },
  resultsSection: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  resultImage: {
    width: "100%",
    height: 180,
  },
  resultContent: {
    padding: 15,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  resultLink: {
    fontSize: 12,
    color: "#007AFF",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 15,
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  },
  instructions: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  instructionStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  stepNumber: {
    backgroundColor: "#007AFF",
    color: "#fff",
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "600",
    marginRight: 15,
    marginTop: 2,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
});