import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

const FloatingLoginButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLogin = () => {
    window.location.href = '/auth/login';
  };

  return (
    <div className="fixed bottom-18 right-6 z-50">
      {showTooltip && (
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
          Đăng nhập
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-gray-900 transform rotate-45"></div>
        </div>
      )}

      <button
        onClick={handleLogin}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white! w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
        aria-label="Đăng nhập"
      >
        <span className="absolute inset-0 rounded-full bg-white! opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>

        <LogIn className="w-6 h-6 relative z-10" strokeWidth={2} />

        <span className="absolute inset-0 rounded-full border-2 border-gray-700 animate-ping opacity-20"></span>
      </button>
    </div>
  );
};

export default FloatingLoginButton;
