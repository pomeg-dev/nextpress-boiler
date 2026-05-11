"use client";

import React, { ReactNode, useState } from 'react';
import Button from '../../atoms/Button';

interface PasswordGateProps {
  password: string;
  children: ReactNode;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ password, children }) => {
  const [input, setInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === password) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <main className="no-sidebar">
      <div className="container flex flex-col items-center justify-center min-h-[40vh] py-16">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-sm">
          <h2 className="text-xl font-[600]">This page is password protected</h2>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Enter password"
            className="border border-gray-300 rounded px-4 py-2 text-sm w-full"
            autoFocus
          />
          {error && (
            <p className="text-red-600 text-sm">Incorrect password. Please try again.</p>
          )}
          <Button type="submit">Enter</Button>
        </form>
      </div>
    </main>
  );
};

export default PasswordGate;
