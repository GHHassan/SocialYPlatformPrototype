import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BottomNav() {

  const navigate = useNavigate();
  return (
      <div className="fixed bottom-0 w-full bg-red-800 text-white">
          <div className="flex justify-around">
              <button
                  className="p-3 "
                  onClick={() => navigate('/')}
              >
                  Home
              </button>
              <button
                  className="p-3"
                  onClick={() => navigate('/chat')}
              >
                  Chat
              </button>
              <button
                  className="p-3"
                  onClick={() => navigate('/profile')}
              >
                  Settings
              </button>
          </div>
      </div>
  );
}