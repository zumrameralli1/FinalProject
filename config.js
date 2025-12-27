// Firebase Configuration
// IMPORTANT: Replace with your own Firebase config
// Get it from: https://console.firebase.google.com/

const firebaseConfig = {
    apiKey: "AIzaSyDemoKey123456789",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
    } else {
        console.warn('Firebase SDK not loaded yet');
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// HOW TO GET YOUR FIREBASE CONFIG:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing one
// 3. Click on Web icon (</>)
// 4. Register your app
// 5. Copy the firebaseConfig object
// 6. Replace the config above with your config
// 7. Enable Authentication > Sign-in method > Google
// 8. Add your domain to Authorized domains in Authentication settings