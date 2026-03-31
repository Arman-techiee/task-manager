import { useEffect, useState } from 'react';

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  deadline: '',
};

export default function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        deadline: task.deadline ? task.deadline.slice(0, 16) : '',
      });
      return;
    }

    setForm(defaultForm);
  }, [task]);

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    await onSave({ ...form, deadline: form.deadline || '' });
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
      onClick={event => event.target === event.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(8,15,23,0.96))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/70">Task editor</p>
            <h3 className="mt-2 font-display text-3xl text-white">{task?.id ? 'Edit task' : 'Create a new task'}</h3>
            <p className="mt-2 text-sm text-slate-300">Capture the work, set its urgency, and place it where execution is clear.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Title</label>
            <input
              name="title"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-emerald-300/40 focus:bg-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Description</label>
            <textarea
              name="description"
              placeholder="Add details (optional)"
              value={form.description}
              onChange={handleChange}
              className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-emerald-300/40 focus:bg-white/10"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-300/40"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-300/40"
              >
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Deadline</label>
            <input
              type="datetime-local"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-300/40 focus:bg-white/10"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/8 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-300 via-teal-300 to-orange-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Saving...' : task?.id ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
