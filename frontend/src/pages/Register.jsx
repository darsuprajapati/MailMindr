import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const success = await register(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
        </div>
        <Button type="submit" className="w-full bg-blue-400 hover:bg-blue-600">Register</Button>
        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register; 