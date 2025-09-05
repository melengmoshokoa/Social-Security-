import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEy9sCLXrUcU2FokiLeuVbLMzUxMEvH2U",
  authDomain: "social-security-92672.firebaseapp.com",
  projectId: "social-security-92672",
  storageBucket: "social-security-92672.appspot.com",
  messagingSenderId: "595797492912",
  appId: "1:595797492912:android:77224b6478d2a9d8bd6775"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
