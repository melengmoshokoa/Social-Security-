import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator 
} from 'react-native';
import { useRoute } from "@react-navigation/native";
import BottomNav from "../Components/BottomNav";
import * as DocumentPicker from 'expo-document-picker';
import { getLocalIP } from './getLocalIP';

export default function LogAnalysis() {
  const [zipFile, setZipFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const route = useRoute();
  const { userInfo } = route.params;

  const API_URL = `http://${getLocalIP()}:5001/upload_instagram_zip/`;

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/zip',
        copyToCacheDirectory: true
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setZipFile({
          uri: file.uri,
          name: file.name,
          type: 'application/zip'
        });
        console.log('Selected file:', file.name);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const handleUpload = async () => {
    if (!zipFile) {
      Alert.alert('Error', 'Please select a ZIP file');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: zipFile.uri,
        name: zipFile.name || 'instagram.zip',
        type: "application/zip",
      });
      formData.append("user_id", userInfo.uid);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const responseText = await response.text();
      console.log('Response:', responseText);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid response from server');
      }

      Alert.alert(
        'Success', 
        `ZIP file processed successfully! Generated files: ${Object.keys(result.files || {}).join(', ') || 'None'}`
      );
      setZipFile(null);

    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', error.message || 'Upload failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Log Analysis</Text>

        <TouchableOpacity 
          style={[styles.uploadButton, isLoading && styles.disabledButton]} 
          onPress={pickFile}
          disabled={isLoading}
        >
          <Text style={styles.uploadButtonText}>
            Select ZIP File
          </Text>
        </TouchableOpacity>

        {zipFile && (
          <Text style={styles.fileInfo}>Selected: {zipFile.name}</Text>
        )}

        <TouchableOpacity 
          style={[styles.submitButton, (!zipFile || isLoading) && styles.disabledButton]} 
          onPress={handleUpload}
          disabled={!zipFile || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Upload & Generate CSV</Text>
          )}
        </TouchableOpacity>
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
    paddingBottom: 70,
  },
  pdfSection: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 30,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32',
    textAlign: 'center',
  },
  downloadButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 30,
  },
  downloadButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  incident: {
    borderWidth: 1,
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: '#000',
  },
  description: {
    borderWidth: 1,
    width: '100%',
    height: 150,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
    textAlignVertical: 'top',
    marginBottom: 15,
    borderColor: '#000',
  },
  uploadSection: {
    marginBottom: 15,
    width: '100%',
  },
  uploadButton: {
    backgroundColor: '#8EC5FC',
    padding: 15,
    borderRadius: 30,
    width: '100%',
    marginBottom: 15,
    
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  attachmentsTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  fileInfo: {
    textAlign: 'center',
    marginBottom: 15,
    paddingTop: 10,
    fontStyle: 'italic',
    borderWidth: 1,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: '#ffffffff',
  },
  filePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    marginBottom: 5,
    backgroundColor: '#ffffffff',
  },
  fileName: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  removeText: { 
    color: 'red',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 30,
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});