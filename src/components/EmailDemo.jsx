import { useAuth } from '@clerk/astro/react';
import { useEffect, useState } from 'react';
import './EmailDemo.css';

export default function EmailDemo() {
  const { isSignedIn, isLoaded } = useAuth();
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [justConnected, setJustConnected] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('aurinko') === 'connected') {
      setJustConnected(true);
      setMessage('✅ Email connected. You can now send a test email.');
      // Clean the query param from the URL for a tidier address bar.
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('aurinko');
      window.history.replaceState({}, '', cleanUrl.toString());
    } else if (params.get('aurinko')) {
      setMessage('❌ Authorization failed. Please try again.');
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('aurinko');
      window.history.replaceState({}, '', cleanUrl.toString());
    }
  }, []);

  const handleConnect = () => {
    if (!isSignedIn) {
      window.location.href = '/sign-in?redirectTo=%2F';
      return;
    }
    window.location.href = '/api/aurinko/authorize';
  };

  const handleSend = async () => {
    if (!isSignedIn) {
      window.location.href = '/sign-in?redirectTo=%2F';
      return;
    }

    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch('/api/aurinko/send', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Test email sent. Status: ${data.aurinkoResponse?.status ?? data.messageId ?? 'Ok'}`);
      } else {
        setMessage(`❌ Failed to send email: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setMessage(`❌ Failed to send email: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="email-demo">
      <h3>📧 Email integration demo</h3>
      <p className="email-demo__lead">
        Authorize your Outlook personal account and we will send a mock email from
        your own address.
      </p>

      {!isLoaded ? (
        <p>Loading…</p>
      ) : (
        <div className="email-demo__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleConnect}
            disabled={status === 'sending'}
          >
            {isSignedIn ? 'Authorize my email' : 'Sign in to try it'}
          </button>

          <button
            type="button"
            className="btn btn--secondary"
            onClick={handleSend}
            disabled={status === 'sending' || (isSignedIn && !justConnected)}
          >
            {status === 'sending' ? 'Sending…' : 'Send test email'}
          </button>
        </div>
      )}

      {message && <p className="email-demo__message">{message}</p>}
    </div>
  );
}
