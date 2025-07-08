import React from "react";

// Google brand colors
const colors = [
  "#4285F4", // blue
  "#EA4335", // red
  "#FBBC05", // yellow
  "#34A853", // green
];

// Expanded doodle SVGs (magnifying glass, chat bubble, cloud, lightbulb, calendar, star, gear, envelope, book, pencil)
const doodles = [
  // Magnifying glass
  <svg key="magnifier" width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ position: 'absolute', top: '10%', left: '8%', opacity: 0.12, animation: 'float1 8s ease-in-out infinite' }}><circle cx="27" cy="27" r="16" stroke="#4285F4" strokeWidth="4"/><rect x="41" y="41" width="10" height="4" rx="2" transform="rotate(45 41 41)" fill="#EA4335"/></svg>,
  // Chat bubble
  <svg key="chat" width="70" height="50" viewBox="0 0 70 50" fill="none" style={{ position: 'absolute', top: '60%', left: '12%', opacity: 0.10, animation: 'float2 7s ease-in-out infinite' }}><rect x="5" y="5" width="50" height="30" rx="10" fill="#FBBC05"/><polygon points="20,35 30,35 25,45" fill="#FBBC05"/><circle cx="20" cy="20" r="3" fill="#fff"/><circle cx="30" cy="20" r="3" fill="#fff"/><circle cx="40" cy="20" r="3" fill="#fff"/></svg>,
  // Cloud
  <svg key="cloud" width="80" height="40" viewBox="0 0 80 40" fill="none" style={{ position: 'absolute', top: '20%', left: '70%', opacity: 0.10, animation: 'float3 9s ease-in-out infinite' }}><ellipse cx="30" cy="20" rx="20" ry="12" fill="#34A853"/><ellipse cx="50" cy="20" rx="15" ry="10" fill="#34A853"/><ellipse cx="40" cy="15" rx="10" ry="7" fill="#34A853"/></svg>,
  // Lightbulb
  <svg key="bulb" width="50" height="70" viewBox="0 0 50 70" fill="none" style={{ position: 'absolute', top: '75%', left: '80%', opacity: 0.13, animation: 'float4 10s ease-in-out infinite' }}><ellipse cx="25" cy="30" rx="15" ry="20" fill="#EA4335"/><rect x="18" y="50" width="14" height="10" rx="3" fill="#FBBC05"/></svg>,
  // Calendar
  <svg key="calendar" width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ position: 'absolute', top: '35%', left: '80%', opacity: 0.10, animation: 'float5 11s ease-in-out infinite' }}><rect x="10" y="15" width="40" height="35" rx="8" fill="#4285F4"/><rect x="10" y="15" width="40" height="8" fill="#EA4335"/><rect x="18" y="28" width="8" height="8" fill="#FBBC05"/><rect x="34" y="28" width="8" height="8" fill="#34A853"/></svg>,
  // Star
  <svg key="star" width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ position: 'absolute', top: '15%', left: '50%', opacity: 0.09, animation: 'float6 8s ease-in-out infinite' }}><polygon points="20,5 24,16 36,16 26,23 30,34 20,27 10,34 14,23 4,16 16,16" fill="#FBBC05"/></svg>,
  // Gear
  <svg key="gear" width="50" height="50" viewBox="0 0 50 50" fill="none" style={{ position: 'absolute', top: '80%', left: '60%', opacity: 0.10, animation: 'float7 12s ease-in-out infinite' }}><circle cx="25" cy="25" r="12" stroke="#4285F4" strokeWidth="4"/><rect x="23" y="5" width="4" height="10" fill="#EA4335"/><rect x="23" y="35" width="4" height="10" fill="#EA4335"/><rect x="5" y="23" width="10" height="4" fill="#FBBC05"/><rect x="35" y="23" width="10" height="4" fill="#FBBC05"/></svg>,
  // Envelope
  <svg key="envelope" width="60" height="40" viewBox="0 0 60 40" fill="none" style={{ position: 'absolute', top: '50%', left: '60%', opacity: 0.09, animation: 'float8 9s ease-in-out infinite' }}><rect x="5" y="10" width="50" height="25" rx="6" fill="#34A853"/><polyline points="5,10 30,30 55,10" fill="none" stroke="#FBBC05" strokeWidth="3"/></svg>,
  // Book
  <svg key="book" width="50" height="60" viewBox="0 0 50 60" fill="none" style={{ position: 'absolute', top: '40%', left: '25%', opacity: 0.10, animation: 'float9 10s ease-in-out infinite' }}><rect x="5" y="10" width="18" height="40" rx="4" fill="#FBBC05"/><rect x="27" y="10" width="18" height="40" rx="4" fill="#4285F4"/><line x1="24" y1="10" x2="24" y2="50" stroke="#EA4335" strokeWidth="2"/></svg>,
  // Pencil
  <svg key="pencil" width="40" height="60" viewBox="0 0 40 60" fill="none" style={{ position: 'absolute', top: '70%', left: '30%', opacity: 0.11, animation: 'float10 13s ease-in-out infinite' }}><rect x="18" y="10" width="4" height="30" fill="#EA4335"/><polygon points="20,40 25,55 15,55" fill="#FBBC05"/><rect x="16" y="5" width="8" height="8" rx="2" fill="#34A853"/></svg>,
  // Ribbons
  <svg key="ribbon1" width="300" height="40" viewBox="0 0 300 40" fill="none" style={{ position: 'absolute', top: '5%', left: '20%', opacity: 0.10, animation: 'ribbonFloat1 14s ease-in-out infinite' }}><path d="M0 20 Q75 0 150 20 T300 20" stroke="#4285F4" strokeWidth="8" fill="none"/><path d="M0 30 Q75 10 150 30 T300 30" stroke="#FBBC05" strokeWidth="4" fill="none"/></svg>,
  <svg key="ribbon2" width="250" height="30" viewBox="0 0 250 30" fill="none" style={{ position: 'absolute', top: '80%', left: '10%', opacity: 0.09, animation: 'ribbonFloat2 16s ease-in-out infinite' }}><path d="M0 15 Q60 0 125 15 T250 15" stroke="#EA4335" strokeWidth="7" fill="none"/><path d="M0 25 Q60 10 125 25 T250 25" stroke="#34A853" strokeWidth="3" fill="none"/></svg>,
  <svg key="ribbon3" width="200" height="25" viewBox="0 0 200 25" fill="none" style={{ position: 'absolute', top: '60%', left: '65%', opacity: 0.08, animation: 'ribbonFloat3 18s ease-in-out infinite' }}><path d="M0 12 Q50 0 100 12 T200 12" stroke="#FBBC05" strokeWidth="6" fill="none"/><path d="M0 20 Q50 8 100 20 T200 20" stroke="#4285F4" strokeWidth="2" fill="none"/></svg>,
  <svg key="ribbon4" width="180" height="20" viewBox="0 0 180 20" fill="none" style={{ position: 'absolute', top: '30%', left: '55%', opacity: 0.09, animation: 'ribbonFloat4 15s ease-in-out infinite' }}><path d="M0 10 Q45 0 90 10 T180 10" stroke="#34A853" strokeWidth="5" fill="none"/><path d="M0 18 Q45 8 90 18 T180 18" stroke="#EA4335" strokeWidth="2" fill="none"/></svg>,
];

export const GoogleDoodleBackground: React.FC = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: 0,
      overflow: "hidden",
    }}
    aria-hidden="true"
  >
    {doodles}
    <style>{`
      @keyframes float1 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-18px); }
      }
      @keyframes float2 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(14px); }
      }
      @keyframes float3 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes float4 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(12px); }
      }
      @keyframes float5 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-16px); }
      }
      @keyframes float6 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(10px); }
      }
      @keyframes float7 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-14px); }
      }
      @keyframes float8 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(8px); }
      }
      @keyframes float9 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }
      @keyframes float10 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(16px); }
      }
      @keyframes ribbonFloat1 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-22px); }
      }
      @keyframes ribbonFloat2 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(18px); }
      }
      @keyframes ribbonFloat3 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-14px); }
      }
      @keyframes ribbonFloat4 {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(10px); }
      }
    `}</style>
  </div>
); 