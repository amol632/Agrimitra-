import React from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  // हे Next.js ला सांगते की chat.html फाईलकडे जा
  React.useEffect(() => {
    router.push('/chat.html');
  }, [router]);

  return (
    <div>
      {/* हे दिसेल, जोपर्यंत रिडायरेक्ट होत नाही */}
      <h1>Loading AgriMitra Chat Interface...</h1>
      <p>If not redirected, please click <a href="/chat.html">here</a>.</p>
    </div>
  );
}
