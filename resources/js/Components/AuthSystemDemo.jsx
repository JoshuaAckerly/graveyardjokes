import axios from 'axios';
import { useState } from 'react';

export default function AuthSystemDemo() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    const [purchases, setPurchases] = useState(null);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://127.0.0.1:8007/api/login', { email, password });
            setToken(res.data.token);
        } catch (err) {
            setError('Login failed');
        }
    };

    const fetchUser = async () => {
        setError('');
        try {
            const res = await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
        } catch (err) {
            setError('Failed to fetch user');
        }
    };

    const fetchPurchases = async () => {
        setError('');
        try {
            const res = await axios.get('/api/purchases', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPurchases(res.data);
        } catch (err) {
            setError('Failed to fetch purchases');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
            <h2>Auth System Demo</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            {token && (
                <div style={{ marginTop: 10 }}>
                    <b>Token:</b> <code>{token}</code>
                </div>
            )}
            <div style={{ marginTop: 20 }}>
                <button onClick={fetchUser} disabled={!token}>
                    Fetch User Info
                </button>
                <button onClick={fetchPurchases} disabled={!token} style={{ marginLeft: 10 }}>
                    Fetch Purchases
                </button>
            </div>
            {user && <pre style={{ background: '#f6f8fa', padding: 10, marginTop: 10 }}>{JSON.stringify(user, null, 2)}</pre>}
            {purchases && <pre style={{ background: '#f6f8fa', padding: 10, marginTop: 10 }}>{JSON.stringify(purchases, null, 2)}</pre>}
            {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        </div>
    );
}
