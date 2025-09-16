importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyCiFiazAT4lummi9MJTkDOU_ZhpgeBHXGU",
  authDomain: "agrimitra-6b944.firebaseapp.com",
  projectId: "agrimitra-6b944",
  storageBucket: "agrimitra-6b944.appspot.com",
  messagingSenderId: "190603132023",
  appId: "1:190603132023:web:dc3f122284891e180f9a72",
  measurementId: "G-7MXB81G9PW"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message received:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png"
  });
});
