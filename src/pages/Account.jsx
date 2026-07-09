import { GoogleAuthProvider, createUserWithEmailAndPassword, getRedirectResult, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { Heart, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';

export default function Account() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!auth) return;
    getRedirectResult(auth).catch(() => {});
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!auth) {
      setMessage('Restart the dev server (Ctrl+C then npm run dev) to load Firebase keys.');
      return;
    }

    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, form.email, form.password);
        setMessage('Account created. You are signed in.');
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
        setMessage('Signed in successfully.');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const googleSignIn = async () => {
    setMessage('');
    if (!auth) {
      setMessage('Restart the dev server (Ctrl+C then npm run dev) to load Firebase keys.');
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error.code === 'auth/unauthorized-domain') {
        setMessage('Add this domain in Firebase Console > Authentication > Settings > Authorized domains, then try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setMessage('Pop-up blocked. Allow pop-ups for this site and try again.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setMessage('');
      } else if (error.code === 'auth/operation-not-allowed') {
        setMessage('Enable Google sign-in in Firebase Console > Authentication > Sign-in method.');
      } else {
        setMessage(error.message || error.code || 'Sign-in failed. Check Firebase Console setup.');
      }
    }
  };

  const logout = async () => {
    if (auth) await signOut(auth);
    setMessage('Signed out.');
  };

  if (user) {
    return (
      <div className="account-page-centered">
        <div className="account-card account-signedin">
          <div className="account-profile-card">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="account-avatar-large" />
            ) : (
              <div className="account-avatar-placeholder">
                {(user.displayName || user.email)[0].toUpperCase()}
              </div>
            )}
            <strong className="account-name">{user.displayName || 'Customer'}</strong>
            <span className="account-email">{user.email}</span>
          </div>
          <div className="account-links">
            <Link to="/support/wishlist" className="account-link">
              <Heart size={18} />
              Wishlist
            </Link>
            <Link to="/products" className="account-link">
              <ShoppingBag size={18} />
              Browse products
            </Link>
          </div>
          <button className="primary-button" type="button" onClick={logout}>Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page-centered">
      <section className="account-card">
        <span className="eyebrow">Customer account</span>
        <h1>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>

        <form className="account-form" onSubmit={submit}>
          {mode === 'signup' && (
            <label>
              Name
              <input name="name" value={form.name} onChange={update} />
            </label>
          )}
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={update} />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={update} />
          </label>
          <button className="primary-button" type="submit">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="account-divider">
          <span>or</span>
        </div>

        <button className="google-btn" type="button" onClick={googleSignIn}>
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.98-5.97z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z"/></svg>
          Sign in with Google
        </button>

        <div className="account-switch">
          <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
          </button>
          <button type="button" onClick={logout}>Sign out</button>
        </div>

        {message && <p className="form-note">{message}</p>}
      </section>
    </div>
  );
}
