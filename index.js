// pages/index.js
import { useEffect } from 'react';

export default function HomePage() {

  // ॲप लोड होताच public/chat.html कडे रिडायरेक्ट करेल
  useEffect(() => {
    // थेट HTML फाईलकडे ब्राउझरला पाठवा
    window.location.replace('/chat.html'); 
  }, []);

  return (
    <div>
      <h1>Redirecting to AgriMitra Chatbot...</h1>
    </div>
  );
}
