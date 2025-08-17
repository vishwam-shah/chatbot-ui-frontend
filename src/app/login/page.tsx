"use client"

import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Store JWT token in sessionStorage
  const storeToken = (token: string) => {
    window.sessionStorage.setItem('token', token);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
  const res = await axios.post(`${BACKEND_URL}/api/login`, { email, password });
      if (res.data.success && res.data.token) {
        storeToken(res.data.token);
        window.location.href = "/";
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError((error.response?.data?.message as string) || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const res = await axios.post(`${BACKEND_URL}/api/signup`, { email, password });
      if (res.data.success && res.data.token) {
        storeToken(res.data.token);
        window.location.href = "/";
      } else if (res.data.success) {
        setSuccess("Signup successful! Please login.");
        setEmail("");
        setPassword("");
        setMode('login');
      } else {
        setError(res.data.message || "Signup failed");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError((error.response?.data?.message as string) || "Signup failed");
      } else {
        setError("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={mode === 'login' ? handleLogin : handleSignup}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {success && <div className="text-green-500 mb-4 text-center">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (mode === 'login' ? "Logging in..." : "Signing up...") : (mode === 'login' ? "Login" : "Sign Up")}
        </button>
        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <span>
              Don&apos;t have an account?{' '}
              <button type="button" className="text-blue-600 underline" onClick={() => { setMode('signup'); setError(""); setSuccess(""); }}>
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button type="button" className="text-blue-600 underline" onClick={() => { setMode('login'); setError(""); setSuccess(""); }}>
                Login
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
