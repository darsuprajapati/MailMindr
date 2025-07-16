import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    const ok = await forgotPassword(email);
    setLoading(false);
    if (ok) {
      setMessage('If an account with that email exists, a reset link has been sent.');
    } else {
      setError('Failed to send reset email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        {message && <div className="mb-4 text-green-500">{message}</div>}
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-6">
          <label className="block mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
        </div>
        <Button type="submit" className="w-full bg-blue-400 hover:bg-blue-600" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword; 