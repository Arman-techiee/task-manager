import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import BoardPage from './pages/BoardPage';

function LoadingScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(180,245,220,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(242,120,75,0.18),_transparent_28%),linear-gradient(180deg,_#07111a_0%,_#08131d_45%,_#091721_100%)] text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-4 rounded-full border border-white/10 bg-white/8 px-6 py-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-200/20 border-t-emerald-300" />
          <div>
            <p className="font-display text-sm uppercase tracking-[0.32em] text-emerald-200/70">TaskFlow</p>
            <p className="text-sm text-slate-300">Loading your local workspace</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppInner() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <BoardPage /> : <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1b25',
            color: '#eff6ff',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            borderRadius: '18px',
            fontFamily: 'Instrument Sans, sans-serif',
            fontSize: '14px',
            boxShadow: '0 24px 80px rgba(2, 6, 23, 0.38)',
            backdropFilter: 'blur(18px)',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#0f1b25' } },
          error: { iconTheme: { primary: '#fb7185', secondary: '#0f1b25' } },
        }}
      />
      <AppInner />
    </AuthProvider>
  );
}
