import React from "react";

export const LoadingAnimation: React.FC = () => (
  <div className="flex justify-center items-center gap-2" style={{ height: 64 }}>
    <span className="loading-dot" style={{ background: '#4285F4', animationDelay: '0s' }} />
    <span className="loading-dot" style={{ background: '#EA4335', animationDelay: '0.15s' }} />
    <span className="loading-dot" style={{ background: '#FBBC05', animationDelay: '0.3s' }} />
    <span className="loading-dot" style={{ background: '#34A853', animationDelay: '0.45s' }} />
    <style>{`
      .loading-dot {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin: 0 4px;
        opacity: 0.8;
        animation: loading-bounce 1s infinite cubic-bezier(.6,-0.28,.74,.05);
      }
      @keyframes loading-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-18px); }
      }
    `}</style>
  </div>
); 