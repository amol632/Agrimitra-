const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

// सकाळी 9 वाजता
exports.morningNotification = functions.pubsub
  .schedule("0 9 * * *")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    return sendNotificationToAll("🌾 AgriMitra", "आज पिकाला पाणी द्या 💧");
  });

// संध्याकाळी 6 वाजता
exports.eveningNotification = functions.pubsub
  .schedule("0 18 * * *")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    return sendNotificationToAll("🌾 AgriMitra", "आज खत द्यायची वेळ झाली आहे 🌱");
  });

// Helper function → सर्व tokens वर notification पाठवतो
async function sendNotificationToAll(title, body) {
  const snapshot = await db.collection("fcmTokens").get();
  const tokens = snapshot.docs.map(doc => doc.data().token);

  if (tokens.length === 0) {
    console.log("❌ कुठलाही token नाही");
    return;
  }

  const message = {
    notification: { title, body },
    tokens: tokens,
  };

  const response = await messaging.sendMulticast(message);
  console.log("✅ Success:", response.successCount);
  console.log("❌ Failed:", response.failureCount);
}
