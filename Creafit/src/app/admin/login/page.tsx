"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // En una app real esto se validaría en el servidor.
    // Para simplificar, usaremos un API route o validaremos aquí contra una variable (no recomendado para prod, pero útil para prototipo)
    // Pero como el Middleware solo mira el cookie 'admin_session=true', podemos setearlo aquí.
    
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (res.ok) {
      window.location.href = '/admin';
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ 
        background: 'var(--ink2)', 
        padding: '3rem', 
        borderRadius: 'var(--r)', 
        width: '100%', 
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <p className="sec-lbl">Acceso restringido</p>
        <h1 className="sec-t" style={{ fontSize: '2rem', marginBottom: '2rem' }}>ADMIN LOGIN</h1>
        
        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'var(--ink3)',
              border: '1px solid var(--wire2)',
              borderRadius: 'var(--r)',
              color: 'white',
              marginBottom: '1rem',
              textAlign: 'center'
            }}
          />
          {error && <p style={{ color: '#ff4444', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" className="btn-a" style={{ width: '100%' }}>Entrar</button>
        </form>
      </div>
    </div>
  );
}
