import { Platform } from "react-native";
import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { type Auth, type Persistence, getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: Auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  // Metro resolves "firebase/auth" to its React Native build on native platforms,
  // which is where getReactNativePersistence lives — required so the session
  // survives app restarts via AsyncStorage instead of resetting every launch.
  // TypeScript only sees the web build's typings here, so the shape is declared
  // by hand rather than via `typeof import(...)`.
  const { getReactNativePersistence } = require("firebase/auth") as {
    getReactNativePersistence: (storage: unknown) => Persistence;
  };
  const AsyncStorage = (
    require("@react-native-async-storage/async-storage") as {
      default: typeof import("@react-native-async-storage/async-storage").default;
    }
  ).default;

  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const db = getFirestore(app);

export { auth, db };
