
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDIgt4yOYoDXe36DMFaFNnHGRWdzufzn-0",
    authDomain: "ai-interior-74818.firebaseapp.com",
    projectId: "ai-interior-74818",
    storageBucket: "ai-interior-74818.appspot.com",
    messagingSenderId: "97764501355",
    appId: "1:97764501355:web:ae44d81cc9ade792f38e2e"
  };
  

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);