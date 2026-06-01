import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB_OOTTNeqqTtZESDoNxLanpYKtwh-9-K0",
  authDomain: "globalsolution-33e9a.firebaseapp.com",
  projectId: "globalsolution-33e9a",
  storageBucket: "globalsolution-33e9a.firebasestorage.app",
  messagingSenderId: "625146597230",
  appId: "1:625146597230:web:4ae3c4c7f3fa1fd809bb7f",
  measurementId: "G-1QNN7Y0YS4"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});