import React, { useState, useRoute } from 'react';
import zxcvbn from 'zxcvbn';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Image} from 'react-native';
import BottomNav from "../Components/BottomNav";
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function Passwords() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(null);
  const [feedback, setFeedback] = useState({ bold: '', regular: '' });
  const [results, setResults] = useState('');

  // const route = useRoute();
  // const { userInfo } = route.params;

  const evaluatePassword = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    const result = zxcvbn(pwd);
    setResults(result);
    console.log(result.score);
    console.log(result.feedback.suggestions);

    const weightedScore = (score * 0.4) + (result.score * 0.6);

    const percentage = (weightedScore / 4) * 100;
    let bold = '';
    let regular = '';

    if (percentage >= 90) {
      bold = 'Excellent! ';
      regular = 'Your password is very strong.';
    } else if (percentage >= 70) {
      bold = 'Good Job! ';
      regular = 'Still room for improvement, add more randomness.';
    } else if (percentage >= 50) {
      bold = 'Fair. ';
      regular = 'Consider adding symbols or numbers.';
    } else {
      bold = 'Weak! ';
      regular = 'Your password needs major improvements.';
    }

    return { percentage, bold, regular };
  };

  const handleSubmit = () => {
    const result = evaluatePassword(password);
    setStrength(result.percentage);
    setFeedback({ bold: result.bold, regular: result.regular });
  };

  const getColor = () => {
      if (strength >= 90) return "#4CAF50"; // green
      if (strength >= 70) return "#2196F3"; // blue
      if (strength >= 50) return "#FFC107"; // amber
      return "#F44336"; // red
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Password Safety</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInput
            style={styles.incident}
            placeholder="Enter a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          {strength !== null && (
              <>
                <View style={{ alignItems: 'center', marginVertical: 20, paddingTop: 20 }}>
                  <AnimatedCircularProgress
                    size={220}
                    width={5}
                    fill={strength}  
                    tintColor={getColor()} 
                    backgroundColor="#ffffffff"
                  >
                    {() => (
                      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        {strength.toFixed(0)}%
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                </View>

                <Text style={styles.feedbackText}>
                  <Text style={styles.boldText}>{feedback.bold}</Text>
                  {feedback.regular}
                </Text>
                <Text style={styles.feedbackText}>
                  {results.feedback.suggestions}
                </Text>
              </>
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
    marginBottom: 35,
  },
  incident: {
    borderWidth: 1,
    width: '95%',
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: '#000',
    width: '95%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: "#fff",
    borderRadius: 999,
    height: 270,
    width: 270,
    alignItems: "center",
    borderColor: "#8a84e0",
    borderWidth: 20,
    justifyContent: "center",
    alignSelf: 'center',
    marginTop: 30,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FF6B47",
  },
  feedbackText: {
    color: "#000",
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  boldText: {
    fontWeight: "bold",
  },
});
