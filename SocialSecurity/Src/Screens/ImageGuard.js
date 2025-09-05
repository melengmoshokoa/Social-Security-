import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Image} from 'react-native';
import BottomNav from "../Components/BottomNav";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';


export default function ImageGuard() {
  const [attachment, setAttachment] = useState(null);

    const pickFile = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
    alert("Permission to access gallery is required!");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

    if (!result.canceled) {
     const newfile = result.assets[0];
    setAttachment(newfile); 
  }

  };

  const removeFile = () => {
    setAttachment(null);
  };

  const handleSubmit = () => {
  };

  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>AI Image Reverse Engineering</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>


          <View style={styles.uploadSection}>
            

            {attachment && (
              <View style={styles.imagePreviewBlock}>
                
                  <View style={styles.filePreview}>
                        <Image
                        source={{ uri: attachment.uri }}
                        style={styles.imagePreview}
                        resizeMode="contain"
                        />
                    <TouchableOpacity onPress={() => removeFile()}>
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
        
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
              <Text style={styles.uploadButtonText}>
                {attachment ? "Change Image" : "Attach Image"}
              </Text>
            </TouchableOpacity>

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
    marginBottom: 10,
  },
  scrollContent: {
    // paddingBottom: 50,  
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
  },
  imagePreview: {
  width: '100%',
  height: 500,
  borderRadius: 10,
  marginBottom: 10,
},
imagePreviewBlock: {
  marginTop: 10,
  alignItems: 'center',
  justifyContent: 'center',
  
},


});