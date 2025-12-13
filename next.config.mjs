// next.config.mjs 

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🛑 हा बदल आवश्यक आहे. हा Next.js ला सांगतो की ॲप स्टॅटिक आहे.
  output: 'export', 
  
  // ॲप बनवताना (build) console.log वगळण्यासाठी:
  reactStrictMode: false,
};

export default nextConfig;

