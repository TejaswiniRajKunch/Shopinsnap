import React, { useState } from 'react';
import api, { setAuthToken } from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email_id: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await api.post('/auth/login', form);
      setAuthToken(res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate('/dashboard');
    } catch (error) {
      setErr(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
      <h2>Login</h2>
      {err && <div style={{ color: 'red' }}>{err}</div>}
      <form onSubmit={onSubmit}>
        <input name="email_id" type="email" placeholder="Email" value={form.email_id} onChange={onChange} required /><br/>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required /><br/>
        <button type="submit">Login</button>
      </form>

      {/* ⭐ BELOW LOGIN PAGE */}
      <p style={{ marginTop: 20 }}>
        New user? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
