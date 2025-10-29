import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Switch } from 'react-native';
import BottomNav from "../Components/BottomNav Invest";
import { getLocalIP } from './getLocalIP';

export default function IncidentCenter() {
  const [username, setUsername] = useState('');
  const [scrapedData, setScrapedData] = useState(null);
  const [modelOutput, setModelOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFakeReal, setShowFakeReal] = useState(true);

  const fetchProfileAndPredict = async () => {
    if (!username.trim()) return alert('Enter a username');
    setLoading(true);
    setScrapedData(null);
    setModelOutput(null);

    try {
      const res = await fetch(`http://${getLocalIP()}:8005/api/model/predict_from_username`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      setScrapedData(data.scraped_data);
      setModelOutput({
        fakeReal: data.fake_real,
        automated: data.automated
      });

    } catch (err) {
      alert('Error fetching data: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const renderPredictionCard = (prediction, type) => {
    const isFakeReal = type === 'fakeReal';
    const predictionText = isFakeReal 
      ? (prediction.prediction === 1 ? ' Fake Account' : ' Real Account')
      : (prediction.prediction === 1 ? ' Automated (Bot)' : 'Non-Automated');
    
    const confidenceColor = prediction.confidence > 0.7 ? '#7fce81ff' : prediction.confidence > 0.4 ? '#e6b56dff' : '#e4857fff';

    return (
      <View style={styles.predictionCard}>
        <Text style={styles.predictionTitle}>
          {isFakeReal ? 'Fake vs Real Analysis' : 'Automated vs Human Analysis'}
        </Text>
        
        <View style={styles.predictionResult}>
          <View style={styles.predictionTextContainer}>
            <Text style={styles.predictionText}>{predictionText}</Text>
          </View>
          <View style={[styles.confidenceBadge, { backgroundColor: confidenceColor }]}>
            <Text style={styles.confidenceText}>
              {(prediction.confidence * 100).toFixed(1)}% confidence
            </Text>
          </View>
        </View>

        <Text style={styles.featuresTitle}>Key Factors:</Text>
        {Object.entries(prediction.feature_importances)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([key, value]) => (
            <View key={key} style={styles.featureRow}>
              <Text style={styles.featureName}>{formatFeatureName(key)}</Text>
              <View style={styles.featureBarContainer}>
                <View 
                  style={[
                    styles.featureBar, 
                    { width: `${Math.min(value * 300, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.featureValue}>{value.toFixed(3)}</Text>
            </View>
          ))}
      </View>
    );
  };

  const formatFeatureName = (key) => {
    const names = {
      userFollowerCount: 'Followers',
      userFollowingCount: 'Following',
      userBiographyLength: 'Bio Length',
      userMediaCount: 'Post Count',
      userHasProfilPic: 'Profile Pic',
      userIsPrivate: 'Private',
      usernameDigitCount: 'Digits in Username',
      usernameLength: 'Username Length',
      userHasHighlighReels: 'Has Highlights',
      userHasExternalUrl: 'External URL',
      userTagsCount: 'Tagged Posts'
    };
    return names[key] || key;
  };

  const renderProfileData = () => {
    if (!scrapedData) return null;

    const importantFields = {
      username: 'Username',
      fullName: 'Full Name',
      followersCount: 'Followers',
      followsCount: 'Following',
      is_private: 'Private',
      verified: 'Verified',
      biography: 'Bio Preview'
    };

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Summary</Text>
        {Object.entries(importantFields).map(([key, label]) => {
          let value = scrapedData[key];
          
          if (key === 'is_private' || key === 'verified') {
            value = value ? 'Yes' : 'No';
          } else if (key === 'biography' && value) {
            value = value.length > 50 ? value.substring(0, 50) + '...' : value;
          } else if (key === 'followersCount' || key === 'followsCount') {
            value = value?.toLocaleString() || '0';
          }
          
          return (
            <View key={key} style={styles.profileRow}>
              <Text style={styles.profileLabel}>{label}:</Text>
              <Text style={styles.profileValue}>{value || 'N/A'}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Investigator Dashboard</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Instagram username"
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity style={styles.actionButton} onPress={fetchProfileAndPredict}>
        <Text style={styles.actionButtonText}>Fetch Profile & Analyze</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#8EC5FC" style={{ marginTop: 20 }} />}

      {modelOutput && (
        <View style={styles.toggleSection}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleButton, showFakeReal && styles.toggleButtonActive]}
              onPress={() => setShowFakeReal(true)}
            >
              <Text style={[styles.toggleButtonText, showFakeReal && styles.toggleButtonTextActive]}>
                Fake vs Real
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, !showFakeReal && styles.toggleButtonActive]}
              onPress={() => setShowFakeReal(false)}
            >
              <Text style={[styles.toggleButtonText, !showFakeReal && styles.toggleButtonTextActive]}>
                Automated vs Human
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {modelOutput && renderPredictionCard(
        showFakeReal ? modelOutput.fakeReal : modelOutput.automated,
        showFakeReal ? 'fakeReal' : 'automated'
      )}

      {renderProfileData()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF7E9",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: { 
    fontSize: 30,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 40,
    textAlign: 'center',
    fontFamily: 'menlo',
    paddingTop: 40,
  },
  input: { 
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    fontSize: 16,
  },
  section: { 
    marginTop: 20, 
    padding: 20, 
    backgroundColor: '#f9f9f9', 
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#8EC5FC',
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: '#333',
  },
  predictionCard: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 200,
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  predictionResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    minHeight: 60,
  },
  predictionTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  predictionText: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    lineHeight: 24,
  },
  confidenceBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  confidenceText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
    color: '#666',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 25,
  },
  featureName: {
    width: 140,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  featureBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  featureBar: {
    height: '100%',
    backgroundColor: '#8EC5FC',
    borderRadius: 4,
  },
  featureValue: {
    width: 50,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    fontWeight: '600',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 6,
    minHeight: 25,
  },
  profileLabel: {
    fontWeight: '700',
    color: '#555',
    fontSize: 15,
  },
  profileValue: {
    color: '#333',
    fontSize: 15,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
    fontWeight: '600',
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    justifyContent: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
    marginRight: 15,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 4,
    minHeight: 45,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#8EC5FC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: "#8EC5FC",
    shadowColor: "#8EC5FC",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    height: 55,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});