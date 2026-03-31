import { addHours, format, formatDistanceToNowStrict, isPast, isWithinInterval } from 'date-fns';
import { AlarmClock, CalendarDays, Clock3 } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, provided }) {
  const isOverdue = task.deadline && isPast(new Date(task.deadline)) && task.status !== 'done';
  const isSoon =
    task.deadline &&
    !isOverdue &&
    isWithinInterval(new Date(task.deadline), {
      start: new Date(),
      end: addHours(new Date(), 24),
    });

  const priorityTone = {
    high: 'border-rose-400/20 bg-rose-400/10 text-rose-200',
    medium: 'border-amber-300/20 bg-amber-300/10 text-amber-100',
    low: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100',
  };

  const deadlineTone = isOverdue
    ? 'border-rose-400/20 bg-rose-400/10 text-rose-100'
    : isSoon
      ? 'border-amber-300/20 bg-amber-300/10 text-amber-50'
      : 'border-white/10 bg-slate-900/70 text-slate-100';

  const deadlineLabel = isOverdue
    ? 'Overdue'
    : isSoon
      ? 'Due soon'
      : 'Scheduled';

  return (
    <div
      className={`group rounded-[1.35rem] border border-white/8 bg-white/7 p-4 shadow-[0_16px_40px_rgba(2,6,23,0.18)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-200/25 hover:bg-white/10 ${task.status === 'done' ? 'opacity-80' : ''}`}
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={`font-display text-lg text-white ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${priorityTone[task.priority]}`}>
              {task.priority}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/8 bg-slate-950/45 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-300">
              {task.status === 'in-progress' ? 'in progress' : task.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(task)}
            title="Edit"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 transition hover:border-emerald-300/30 hover:bg-white/10 hover:text-white"
          >
            Ed
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            title="Delete"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-200 transition hover:bg-rose-400/20"
          >
            Del
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300/85">{task.description}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
        {task.deadline && (
          <div className={`min-w-[12rem] rounded-2xl border px-3 py-3 ${deadlineTone}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60">
                  <AlarmClock className="h-3.5 w-3.5" />
                  {deadlineLabel}
                </p>
                <p className="mt-2 inline-flex items-center gap-2 font-display text-base text-white">
                  <CalendarDays className="h-4 w-4 text-white/65" />
                  {format(new Date(task.deadline), 'EEE, MMM d')}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-right shadow-inner shadow-black/10">
                <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.24em] text-white/50">
                  <Clock3 className="h-3 w-3" />
                  Time
                </p>
                <p className="mt-1 font-display text-lg text-white">
                  {format(new Date(task.deadline), 'h:mm a')}
                </p>
              </div>
            </div>
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-white/70">
              <Clock3 className="h-3.5 w-3.5 text-white/55" />
              {formatDistanceToNowStrict(new Date(task.deadline), { addSuffix: true })}
            </p>
          </div>
        )}
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Drag to move</span>
      </div>
    </div>
  );
}
