// This page is no longer used. Login is handled by the auth-system project.
import React from 'react';

export default function Login() {
  if (typeof window !== 'undefined') {
    window.location.replace('http://localhost:8007/login');
    return null;
  }
  return <div>Redirecting to login...</div>;
}
