import { useState } from 'react';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    setLoading(true);

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      toast.error('Please enter your name to start.');
      setLoading(false);
      return;
    }

    login({ name: trimmedName, email: form.email });
    toast.success(`Welcome, ${trimmedName}!`);
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(181,245,210,0.22),_transparent_28%),radial-gradient(circle_at_85%_15%,_rgba(242,120,75,0.2),_transparent_24%),linear-gradient(180deg,_#07111a_0%,_#08131d_42%,_#091721_100%)] text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-emerald-300/12 blur-3xl" />
      <div className="absolute bottom-0 right-[-5rem] h-80 w-80 rounded-full bg-orange-400/12 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 lg:px-10">
        <div className="grid flex-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="hidden lg:block">
            <div className="max-w-2xl">
              <p className="mb-6 inline-flex rounded-full border border-emerald-200/15 bg-emerald-300/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-100/80">
                Frontend-only and deploy-ready
              </p>
              <h1 className="font-display text-5xl font-semibold leading-[0.95] text-white xl:text-7xl">
                Manage tasks
                <span className="mt-2 block text-slate-300">without a backend.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300/85">
                TaskFlow stores your workspace right in the browser with a clean Kanban board,
                fast task editing, and zero environment setup.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                  <p className="font-display text-3xl text-white">0</p>
                  <p className="mt-2 text-sm text-slate-300">Servers, databases, or env variables required.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                  <p className="font-display text-3xl text-white">3</p>
                  <p className="mt-2 text-sm text-slate-300">Simple workflow lanes for daily planning.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                  <p className="font-display text-3xl text-white">1s</p>
                  <p className="mt-2 text-sm text-slate-300">Instant local persistence on every change.</p>
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
                    <p className="font-display text-3xl font-semibold text-white">Create your workspace</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Your profile and tasks stay on this device using local storage.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Your name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-emerald-300/40 focus:bg-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Email (optional)</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-emerald-300/40 focus:bg-white/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-300 via-teal-300 to-orange-300 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:scale-[0.99] hover:shadow-[0_18px_40px_rgba(74,222,128,0.22)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? 'Starting...' : 'Open workspace'}
                  </button>
                </form>

                <div className="mt-6 border-t border-white/10 pt-5 text-sm text-slate-300">
                  No signup, backend, or database needed. Deploy the project directly to Vercel as a static app.
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
