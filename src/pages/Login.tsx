import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Login: React.FC = () => {
    const { signInWithGoogle, loginWithEmail, registerWithEmail, user } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (user) {
            navigate('/editor');
        }
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
        try {
            setError('');
            await signInWithGoogle();
            navigate('/editor');
        } catch (error: any) {
            console.error("Failed to login", error);
            setError("Failed to login with Google.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await loginWithEmail(email, password);
            } else {
                await registerWithEmail(email, password);
            }
            navigate('/editor');
        } catch (err: any) {
            console.error("Auth error:", err);
            setError(err.message || "Failed to authenticate.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                <p>Sign in to save your markdown files to the cloud.</p>

                {error && <div className="message-banner error" style={{ position: 'relative', transform: 'none', left: 'auto', marginBottom: '1.5rem', borderRadius: '0.25rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="title-input"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="title-input"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                    <button type="submit" className="button primary-button" disabled={loading} style={{ justifyContent: 'center', width: '100%' }}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div className="login-divider">
                    <div className="login-divider-line"></div>
                    <span className="login-divider-text">OR</span>
                    <div className="login-divider-line"></div>
                </div>

                <button onClick={handleGoogleLogin} className="button secondary-button google-btn">
                    Sign in with Google
                </button>

                <div className="login-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ background: 'none', border: 'none', padding: 0, color: 'var(--radiance)', textDecoration: 'underline', fontSize: 'inherit', cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
