import { Github } from 'lucide-react';

const REPO_URL = 'https://github.com/armanroot/task-manager.git';

export default function Footer({ className = '' }) {
  return (
    <footer className={`relative z-10 mt-8 ${className}`.trim()}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 rounded-[1.4rem] border border-white/10 bg-slate-950/35 px-5 py-4 text-center text-sm text-slate-300 backdrop-blur-xl sm:flex-row sm:text-left">
        <p>
          Built by <span className="font-semibold text-white">Arman Khan</span>
        </p>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10 hover:text-white"
        >
          <Github className="h-4 w-4" />
          View GitHub Repo
        </a>
      </div>
    </footer>
  );
}

