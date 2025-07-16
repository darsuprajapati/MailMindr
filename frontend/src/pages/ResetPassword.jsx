import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const ResetPassword = () => {
  const { token } = useParams();
  const { resetPassword } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const ok = await resetPassword(token, password);
    setLoading(false);
    if (ok) {
      setMessage('Password has been reset. You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError('Failed to reset password. The link may have expired.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        {message && <div className="mb-4 text-green-500">{message}</div>}
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1">New Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Confirm Password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
        </div>
        <Button type="submit" className="w-full bg-blue-400 hover:bg-blue-600" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword; 