import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, 
  TouchableOpacity, Alert, ActivityIndicator, Platform 
} from 'react-native';
import BottomNav from "../Components/BottomNav";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export default function IncidentCenter() {
  const [incidentTitle, setIncidentTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState(null);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true, 
        copyToCacheDirectory: true
      });
      
      if (!result.canceled && result.assets) {
        const newFiles = result.assets;
        setAttachments(prev => [...prev, ...newFiles]); 
        console.log('Files picked:', newFiles.map(f => f.name));
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const removeFile = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!incidentTitle.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    console.log('Starting PDF generation...');

    try {
      const formData = new FormData();
      formData.append("title", incidentTitle);
      formData.append("description", description);

      // Add attachments if any
      attachments.forEach((file, index) => {
        formData.append("attachments", {
          uri: file.uri,
          type: file.mimeType || "application/octet-stream",
          name: file.name || `file_${index}.dat`,
        });
      });

      console.log('Sending request to server...');
      
      const response = await fetch("http://10.0.0.120:8081/pdfGen/", {
        method: "POST",
        body: formData,
      });

      console.log('Response status:', response.status, response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      // Get the PDF as blob
      const blob = await response.blob();
      console.log('PDF blob received, size:', blob.size, 'bytes');
      
      if (blob.size === 0) {
        throw new Error('Received empty PDF from server');
      }

      // Convert blob to base64 using a different approach
      const base64Data = await blobToBase64(blob);
      
      // Generate filename
      const timestamp = new Date().getTime();
      const filename = `incident_report_${timestamp}.pdf`;
      const fileUri = FileSystem.documentDirectory + filename;

      console.log('Saving PDF to:', fileUri);
      
      // Save file - FIXED: Using the correct encoding constant
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: 'base64',
      });

      console.log('PDF saved successfully');
      
      // Verify file exists
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        console.log('File verified, size:', fileInfo.size, 'bytes');
        setGeneratedPdfUrl(fileUri);
        
        Alert.alert(
          'Success', 
          'PDF generated successfully!',
          [
            { text: 'OK', onPress: () => {} },
            { text: 'Download Now', onPress: () => downloadPdf(fileUri, filename) }
          ]
        );
        
        // Clear form
        setIncidentTitle('');
        setDescription('');
        setAttachments([]);
      } else {
        throw new Error('Failed to verify saved PDF file');
      }
      
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', `Failed to generate PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple blob to base64 conversion
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove the data:application/pdf;base64, prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const downloadPdf = async (fileUri, filename) => {
    try {
      console.log('Starting download process for:', fileUri);
      
      if (Platform.OS === 'ios') {
        // For iOS, use Sharing API
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Download Incident Report',
            UTI: 'com.adobe.pdf'
          });
        } else {
          Alert.alert('Success', 'PDF saved to app storage. You can access it via the Files app.');
        }
      } else {
        // For Android, save to media library
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          const asset = await MediaLibrary.createAssetAsync(fileUri);
          await MediaLibrary.createAlbumAsync('Downloads', asset, false);
          Alert.alert('Success', 'PDF downloaded successfully!');
        } else {
          Alert.alert('Permission Required', 'Please grant storage permission to download the PDF');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download Error', 'Failed to download PDF: ' + error.message);
    }
  };

  const testServerConnection = async () => {
    try {
      console.log('Testing server connection...');
      const response = await fetch('http://10.0.0.120:8081/health');
      if (response.ok) {
        const result = await response.json();
        console.log('Server health check:', result);
        Alert.alert('Server Test', `Connection successful: ${result.status}`);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Server test failed:', error);
      Alert.alert('Server Test', `Connection failed: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Incident Report</Text>

        {/* Test Server Connection Button
        <TouchableOpacity style={styles.testButton} onPress={testServerConnection}>
          <Text style={styles.testButtonText}>Test Server Connection</Text>
        </TouchableOpacity> */}

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Generated PDF Section */}
          {generatedPdfUrl && (
            <View style={styles.pdfSection}>
              <Text style={styles.pdfTitle}>✓ PDF Generated Successfully!</Text>
              <TouchableOpacity 
                style={styles.downloadButton} 
                onPress={() => downloadPdf(generatedPdfUrl, 'incident_report.pdf')}
              >
                <Text style={styles.downloadButtonText}>Download PDF</Text>
              </TouchableOpacity>
            </View>
          )}

          <TextInput
            style={styles.incident}
            placeholder="Title of Incident *"
            value={incidentTitle}
            onChangeText={setIncidentTitle}
            editable={!isLoading}
          />
          
          <TextInput
            style={styles.description}
            placeholder="Description *"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            editable={!isLoading}
          />

          <View style={styles.uploadSection}>
            <TouchableOpacity 
              style={[styles.uploadButton, isLoading && styles.disabledButton]} 
              onPress={pickFile}
              disabled={isLoading}
            >
              <Text style={styles.uploadButtonText}>
                {attachments.length > 0 ? "Add More Attachments" : "Attach Files"}
              </Text>
            </TouchableOpacity>
            
            {attachments.length > 0 && (
              <View style={styles.filePreviewList}>
                <Text style={styles.attachmentsTitle}>Attachments ({attachments.length}):</Text>
                {attachments.map((file, index) => (
                  <View key={index} style={styles.filePreview}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {file.name || file.uri.split('/').pop()}
                    </Text>
                    <TouchableOpacity 
                      onPress={() => removeFile(index)}
                      disabled={isLoading}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Generate PDF</Text>
            )}
          </TouchableOpacity>
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
    fontSize: 30,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  pdfSection: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 10,
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
    borderRadius: 5,
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
    borderColor: '#ddd',
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
    borderColor: '#ddd',
  },
  uploadSection: {
    marginBottom: 15,
    width: '100%',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
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
  filePreviewList: {
    marginTop: 10,
    width: '100%',
  },
  filePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#f8f9fa',
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
    borderRadius: 10,
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