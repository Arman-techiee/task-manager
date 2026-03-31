import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email: form.email, password: form.password } : form;
      const { data } = await axios.post(url, payload);
      login(data.token, data.user);
      toast.success(`Welcome${data.user.name ? `, ${data.user.name}` : ''}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(181,245,210,0.22),_transparent_28%),radial-gradient(circle_at_85%_15%,_rgba(242,120,75,0.2),_transparent_24%),linear-gradient(180deg,_#07111a_0%,_#08131d_42%,_#091721_100%)] text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-emerald-300/12 blur-3xl" />
      <div className="absolute bottom-0 right-[-5rem] h-80 w-80 rounded-full bg-orange-400/12 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        <section className="hidden lg:block">
          <div className="max-w-2xl">
            <p className="mb-6 inline-flex rounded-full border border-emerald-200/15 bg-emerald-300/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-100/80">
              Portfolio-ready task management
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[0.95] text-white xl:text-7xl">
              Plan faster.
              <span className="mt-2 block text-slate-300">Deliver with clarity.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300/85">
              TaskFlow gives your work a sharp command center with deadline visibility,
              focused priorities, and a Kanban board designed to feel premium in motion.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                <p className="font-display text-3xl text-white">3</p>
                <p className="mt-2 text-sm text-slate-300">Focused workflow lanes for clear execution.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                <p className="font-display text-3xl text-white">24h</p>
                <p className="mt-2 text-sm text-slate-300">Deadline awareness surfaced directly on each task card.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                <p className="font-display text-3xl text-white">100%</p>
                <p className="mt-2 text-sm text-slate-300">Responsive layout tuned for desktop demos and mobile previews.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-xl lg:max-w-none">
          <div className="rounded-[2rem] border border-white/12 bg-white/10 p-3 shadow-[0_24px_120px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
            <div className="rounded-[1.6rem] border border-white/8 bg-slate-950/55 p-6 sm:p-8">
              <div className="mb-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-teal-300 to-orange-300 text-lg font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
                  TF
                </div>
                <div className="mt-5">
                  <p className="font-display text-3xl font-semibold text-white">TaskFlow</p>
                  <p className="mt-2 text-sm text-slate-300">
                    {isLogin ? 'Sign in to your workspace' : 'Create your workspace'}
                  </p>
                </div>
              </div>

              <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/6 p-1">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isLogin ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    !isLogin ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Create account
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Full name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-emerald-300/40 focus:bg-white/10"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-emerald-300/40 focus:bg-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-emerald-300/40 focus:bg-white/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-300 via-teal-300 to-orange-300 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:scale-[0.99] hover:shadow-[0_18px_40px_rgba(74,222,128,0.22)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5 text-sm text-slate-300">
                <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
                <button
                  type="button"
                  onClick={() => setIsLogin(v => !v)}
                  className="font-semibold text-emerald-200 transition hover:text-white"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
