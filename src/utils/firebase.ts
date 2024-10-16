// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDyrwrNapT2epLRbmYLDG0h7ISMN3kvwis',
  authDomain: 'random-forms-910cb.firebaseapp.com',
  projectId: 'random-forms-910cb',
  storageBucket: 'random-forms-910cb.appspot.com',
  messagingSenderId: '768895710309',
  appId: '1:768895710309:web:36cae5bf2e0d796fc4828c',
  measurementId: 'G-9LMN80QSHZ',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
