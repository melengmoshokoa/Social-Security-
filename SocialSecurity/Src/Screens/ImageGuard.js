import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function ImageGuard() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);

  // Pick image from gallery
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setResults([]); // reset previous results
    }
  };

  // Upload image to backend
  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", {
      uri: image.uri,
      name: image.fileName || "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post("http://10.0.0.120:8081/reverse-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Parse results
      if (response.data.results && response.data.results.length > 0) {
        setResults(response.data.results); // items contains image search results
      } else {
        alert("No results found");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Image Reverse Search</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>{image ? "Change Image" : "Pick an Image"}</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.preview} resizeMode="contain" />
      )}

      {image && (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={{ marginTop: 20 }}>
        {results.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.resultItem}
            onPress={() => Linking.openURL(item.link)}
          >
            <Image
              source={{ uri: item.image.thumbnailLink }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text style={styles.resultLink}>{item.link}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "600", marginBottom: 20 },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  preview: { width: "100%", height: 300, marginTop: 10, borderRadius: 10 },
  resultItem: { marginBottom: 20 },
  thumbnail: { width: "100%", height: 200, borderRadius: 10 },
  resultTitle: { fontWeight: "bold", marginTop: 5 },
  resultLink: { color: "#007AFF", fontSize: 12 },
});
