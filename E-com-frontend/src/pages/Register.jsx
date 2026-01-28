import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ 
    first_name: '', 
    last_name: '', 
    dob: '', 
    email_id: '', 
    phone_number: '', 
    password: '',
    re_password: ''
  });

  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    if (form.password !== form.re_password) {
      setErr("Passwords do not match");
      return;
    }

    try {
      await api.post('/auth/register', {
        ...form,
        re_password: undefined
      });
      alert('Registered. Please login.');
      navigate('/login');
    } catch (error) {
      setErr(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
      <h2>Register</h2>
      {err && <div style={{ color: 'red' }}>{err}</div>}

      <form onSubmit={onSubmit}>
        <input name="first_name" placeholder="First name" value={form.first_name} onChange={onChange} required /><br/>
        <input name="last_name" placeholder="Last name" value={form.last_name} onChange={onChange} required /><br/>

        <input name="dob" type="date" value={form.dob} onChange={onChange} required /><br/>

        <input name="email_id" type="email" placeholder="Email" value={form.email_id} onChange={onChange} required /><br/>
        <input name="phone_number" placeholder="Phone" value={form.phone_number} onChange={onChange} required /><br/>

        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required /><br/>

        <input name="re_password" type="password" placeholder="Re-enter Password" value={form.re_password} onChange={onChange} required /><br/>

        <button type="submit">Register</button>
      </form>

      {/* ⭐ BELOW REGISTER PAGE */}
      <p style={{ marginTop: 20 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
