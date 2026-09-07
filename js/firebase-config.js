/* ==========================================================================
   FIREBASE CONFIGURATION & INITIALIZER
   Firebase SDK v10 (ES Modules via CDN)
   ========================================================================== */

import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Default / Fallback configuration keys
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

/**
 * Retrieves the current Firebase configuration from localStorage or default settings.
 */
export function getFirebaseConfig() {
  const savedConfig = localStorage.getItem('porto_firebase_config');
  if (savedConfig) {
    try {
      const parsed = JSON.parse(savedConfig);
      if (parsed && parsed.apiKey) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored Firebase config', e);
    }
  }
  return DEFAULT_FIREBASE_CONFIG;
}

/**
 * Saves custom Firebase configuration to localStorage.
 */
export function saveFirebaseConfig(config) {
  localStorage.setItem('porto_firebase_config', JSON.stringify(config));
}

/**
 * Clears custom Firebase configuration from localStorage.
 */
export function clearFirebaseConfig() {
  localStorage.removeItem('porto_firebase_config');
}

/**
 * Initializes and returns Firebase App, Auth, and Firestore instances if valid config is present.
 */
export function initFirebase() {
  const config = getFirebaseConfig();
  
  if (!config.apiKey || config.apiKey === "") {
    return { initialized: false, error: 'Firebase config missing. Please set your credentials in Admin Settings.' };
  }

  try {
    const app = !getApps().length ? initializeApp(config) : getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { initialized: true, app, auth, db };
  } catch (err) {
    console.error('Error initializing Firebase:', err);
    return { initialized: false, error: err.message };
  }
}
