import React, { useState } from 'react';
import api from '../utils/api';

import { useHistory } from 'react-router-dom';
import { Button, Input } from 'antd';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await api.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      window.dispatchEvent(new Event('storageChange')); // Trigger navbar update
      setError('');
      // Redirect based on role (decoded from token or backend response)
      const tokenPayload = JSON.parse(atob(res.data.token.split('.')[1]));
      if (tokenPayload.role === 'admin') {
        history.push('/admin');
      } else if (tokenPayload.role === 'creator') {
        history.push('/creator');
      } else {
        history.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4 input">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className='input'>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded input"
            placeholder='Enter your email'
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded input"
            placeholder='Enter your password'
            required
          />
        </div>
        <Button htmlType="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
          Login
        </Button>
      </form>
      <p className="mt-4">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-500 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
};

export default Login;