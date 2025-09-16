import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCiFiazAT4lummi9MJTkDOU_ZhpgeBHXGU",
  authDomain: "agrimitra-6b944.firebaseapp.com",
  projectId: "agrimitra-6b944",
  storageBucket: "agrimitra-6b944.firebasestorage.app",
  messagingSenderId: "190603132023",
  appId: "1:190603132023:web:dc3f122284891e180f9a72",
  measurementId: "G-7MXB81G9PW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

// ✅ FCM Token सेव करण्यासाठी function
async function saveFCMToken(user) {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "👉 तुझा VAPID KEY इथे टाक"
    });

    if (currentToken) {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        fcmToken: currentToken
      }, { merge: true });

      console.log("✅ Token Firebase मध्ये सेव झाला:", currentToken);
    } else {
      console.log("⚠️ Token मिळाला नाही");
    }
  } catch (err) {
    console.error("❌ Token Error:", err);
  }
}

// ✅ Auth झाल्यावर user check करा
onAuthStateChanged(auth, (user) => {
  if (user) {
    saveFCMToken(user); // 🔔 Token सेव होईल
    window.location.href = "dashboard.html";
  }
});
