import { StyleSheet,View,Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import Components from "../Components/Components"
import BottomNav from "../Components/BottomNav";

const settings = [
  { label: 'Account settings', color: '#2ECC71' },
  { label: 'Privacy settings', color: '#58D68D' },
  { label: 'Notification settings', color: '#82E0AA' },
  { label: 'App preferences', color: '#A9DFBF' },
];

export default function Settings(){
    return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.hello}>HELLO</Text>
            <View style={styles.usernameRow}>
              <View style={styles.dot} />
              <Text style={styles.username}>ITUMELENG</Text>
            </View>
          </View>
          <View>
            <Text style={styles.lastSeenLabel}>Last seen</Text>
            <Text style={styles.lastSeen}>17 July, Mon</Text>
          </View>
        </View>

        <View style={styles.line}></View>

        {/* Stacked Cards */}
        <View style={styles.stackContainer}>
          {settings.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              style={[
                styles.card,
                {
                  backgroundColor: item.color,
                  marginTop: index === 0 ? 0 : -40, 
                  zIndex: settings.length - index, 
                },
              ]}
            >
              <Text style={styles.cardText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <BottomNav />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 15,
  },
  hello: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
    marginRight: 6,
  },
  line: {
    height: 1.5,
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 30,
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
  },
  lastSeenLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    paddingTop: 15,
  },
  lastSeen: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  stackContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    height: '28%',
    paddingVertical: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
