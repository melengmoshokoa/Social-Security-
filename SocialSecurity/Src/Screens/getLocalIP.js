const EXPO_URL = 'exp://10.0.0.114:8081';

export const getLocalIP = () => {
  if (EXPO_URL) {

    const match = EXPO_URL.match(/exp:\/\/([^:]+):\d+/);
    if (match && match[1]) {
      return match[1];
    }
  }

  return '10.0.0.114';
};
