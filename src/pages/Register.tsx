import React, { useState } from 'react';
import api from '../utils/api';

import { useHistory } from 'react-router-dom';
import { Button, Input, message, Select } from 'antd';

interface RegisterForm {
  email: string;
  password: string;
  role: 'creator' | 'viewer' | 'admin';
}

const Register: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>({ email: '', password: '', role: 'viewer' });
  const [error, setError] = useState<string>('');
  const history = useHistory();

  const {Option} = Select;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      window.dispatchEvent(new Event('storageChange')); // Trigger navbar update
      setError('');
      // Redirect based on role
      if (form.role === 'admin') {
        history.push('/admin');
      } else if (form.role === 'creator') {
        history.push('/creator');
      } else {
        history.push('/');
      }
    } catch (err: any) {
    //   setError(err.response?.data?.msg || 'Registration failed');
    message.error('User Already Exist');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4 input">Register</h2>
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
        <div>
          <label htmlFor="role" className="block text-sm font-medium">
            Role
          </label>
          <Select
            id="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e as 'creator' | 'viewer' | 'admin' })}
            className="w-full p-2 border rounded input "
          >
            <Option value="viewer">Viewer</Option>
            <Option value="creator">Creator</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </div>
        <Button htmlType="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
          Register
        </Button>
      </form>
      <p className="mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-blue-500 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default Register;