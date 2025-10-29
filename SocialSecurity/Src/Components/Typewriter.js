import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

export default function Typewriter({ text, speed = 50, style }) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        const char = text.charAt(index); 
        setDisplayedText((prev) => prev + char);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [text, speed]);

  return (
    <Text style={style}>
      {displayedText}
      {showCursor && '|'}
    </Text>
  );
}
