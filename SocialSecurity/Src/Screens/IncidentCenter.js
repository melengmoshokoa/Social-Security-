import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity} from 'react-native';
import BottomNav from "../Components/BottomNav";
import * as DocumentPicker from 'expo-document-picker';

export default function IncidentCenter() {
  const [incidentTitle, setIncidentTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);

    const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',multiple: true, copyToCacheDirectory: true
    });
    if (!result.canceled) {
     const newFiles = result.assets ? result.assets : [result];
    setAttachments(prev => [...prev, ...newFiles]); 
  }

  console.log(attachments[0].name)
  };

  const removeFile = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setAttachments([]);
  };

  const handleSubmit = () => {
  };

  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Report</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>

            <TextInput
            style={styles.incident}
            placeholder="Title of Incident"
            value={incidentTitle}
            onChangeText={setIncidentTitle}
          />
          <TextInput
            style={styles.description}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />

          <View style={styles.uploadSection}>
            <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
              <Text style={styles.uploadButtonText}>
                {attachments.length > 0 ? "Add More Attachments" : "Attach Files"}
              </Text>
            </TouchableOpacity>
            {attachments.length > 0 && (
              
              <View style={styles.filePreviewList}>
                {attachments.map((file, index) => (
                  <View key={index} style={styles.filePreview}>
                    <Text style={styles.fileName} numberOfLines={1}>{file.name || file.uri.split('/').pop()}</Text>
                    <TouchableOpacity onPress={() => removeFile(index)}>
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

            <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Submit</Text>
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
    justifyItems: 'center'
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyItems: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 35,
  },
  scrollContent: {
    // paddingBottom: 50,  
  },
  incident: {
    marginTop: 0,
    borderWidth: 1,
    width: '95%',
    height: '50',
    borderRadius: 30,
    paddingHorizontal: 10,
    justifyItems: 'center'
  },
  description: {
    marginTop: 25,
    borderWidth: 1,
    width: '95%',
    height: '180',
    borderRadius: 30,
    paddingHorizontal: 10,
    justifyItems: 'center'
  },
  button:{
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: '#000',
    width: '95%',
    height: '50',

 },
 buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: '5%',

 },
 uploadSection: {
    marginTop: 20, alignItems: 'flex-start'
  },
  uploadButton: {
    backgroundColor: '#007AFF', padding: 10,
    borderRadius: 30,
    width: '95%',
    height: '50',
  },
  uploadButtonText: {
    color: '#FFF', 
    fontSize: 16,
    textAlign: 'center',
    paddingTop: '2%',
  },
  filePreview: {
    marginTop: 10, flexDirection: 'row',
    alignItems: 'center'
  },
  fileName: {
    fontSize: 13},
  removeText: { color: 'red',
    marginLeft: 10 },
  button: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: '#000', 
    width: '95%', 
    height: 50,
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff', 
    textAlign: 'center',
    fontSize: 18, 
    fontWeight: 'bold'
  }

});