const admin = require("firebase-admin");

// Firebase service account (GitHub Secrets मधून घेते)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const messaging = admin.messaging();

// कोणत्या वेळी कोणता मेसेज पाठवायचा
function getMessageByTime() {
  const hour = new Date().getHours();
  if (hour === 9) {
    return { title: "🌾 AgriMitra", body: "आज पिकाला पाणी द्या 💧" };
  } else if (hour === 18) {
    return { title: "🌾 AgriMitra", body: "आज खत द्यायची वेळ झाली आहे 🌱" };
  }
  return null;
}

async function sendNotifications() {
  const messageData = getMessageByTime();
  if (!messageData) {
    console.log("⏰ ह्या वेळी notification नाही.");
    return;
  }

  const snapshot = await db.collection("fcmTokens").get();
  const tokens = snapshot.docs.map((doc) => doc.data().token);

  if (tokens.length === 0) {
    console.log("❌ कुठलाही token सापडला नाही.");
    return;
  }

  const message = {
    notification: messageData,
    tokens: tokens,
  };

  try {
    const response = await messaging.sendMulticast(message);
    console.log("✅ Success:", response.successCount);
    console.log("❌ Failed:", response.failureCount);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

sendNotifications();
