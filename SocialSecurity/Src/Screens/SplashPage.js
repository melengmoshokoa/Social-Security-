import React, { useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Animated } from 'react-native';
import SplashPage1 from './SplashPage1'; 
import SplashPage2 from './SplashPage2'; 
import SplashPage3 from './SplashPage3'; 
import Login from './LoginMain';

const { width } = Dimensions.get('window');

const pages = [
  { key: '1', component: <SplashPage1 /> },
  { key: '2', component: <SplashPage2 /> },
  { key: '3', component: <SplashPage3 /> },
  { key: '4', component: <Login /> },

];

export default function SplashScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => <View style={{ width }}>{item.component}</View>}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
      <View style={styles.pagination}>
        {pages.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E9',
  },
  pagination: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000ff',
    marginHorizontal: 4,
  },
  Logo:{
    textAlign: 'center',
    paddingTop: 70,
    fontSize: 18,
    fontWeight: 'bold'
 },
});

