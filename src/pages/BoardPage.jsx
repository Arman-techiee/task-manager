import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { formatDistanceToNowStrict, isPast } from 'date-fns';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { useAuth } from '../context/AuthContext';

const TASKS_STORAGE_KEY = 'taskflow-tasks';

const COLUMNS = [
  {
    id: 'todo',
    label: 'Backlog',
    tone: 'from-slate-300/25 to-slate-200/5',
    accent: 'bg-slate-300',
    description: 'Ideas and upcoming work.',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    tone: 'from-cyan-300/20 to-emerald-300/5',
    accent: 'bg-cyan-300',
    description: 'Tasks currently being executed.',
  },
  {
    id: 'done',
    label: 'Completed',
    tone: 'from-emerald-300/20 to-orange-300/5',
    accent: 'bg-emerald-300',
    description: 'Finished work and shipped wins.',
  },
];

function createTaskId() {
  return crypto.randomUUID();
}

function sortTasks(items) {
  return [...items].sort((a, b) => {
    if ((a.order ?? 0) !== (b.order ?? 0)) {
      return (a.order ?? 0) - (b.order ?? 0);
    }
    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  });
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    localStorage.removeItem(TASKS_STORAGE_KEY);
    return [];
  }
}

function persistTasks(items) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(items));
}

function mergeColumnUpdates(allTasks, ...columnGroups) {
  const updatedById = new Map(columnGroups.flat().map(task => [task.id, task]));
  return allTasks.map(task => updatedById.get(task.id) || task);
}

function normalizeColumnOrder(allTasks, status) {
  return sortTasks(allTasks)
    .filter(task => task.status === status)
    .map((task, index) => ({ ...task, order: index }));
}

function LoadingBoard() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(180,245,220,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(242,120,75,0.18),_transparent_28%),linear-gradient(180deg,_#07111a_0%,_#08131d_45%,_#091721_100%)] text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-4 rounded-full border border-white/10 bg-white/8 px-6 py-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-200/20 border-t-emerald-300" />
          <div>
            <p className="font-display text-sm uppercase tracking-[0.32em] text-emerald-200/70">Syncing board</p>
            <p className="text-sm text-slate-300">Restoring your local tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BoardPage() {
  const { user, logout, login } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    setTasks(loadTasks());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      persistTasks(tasks);
    }
  }, [loading, tasks]);

  const getColumnTasks = status => {
    let filtered = tasks.filter(task => task.status === status);
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    return sortTasks(filtered);
  };

  const handleSave = async form => {
    const timestamp = new Date().toISOString();

    setTasks(current => {
      if (editTask?.id) {
        const previous = current.find(task => task.id === editTask.id);
        const nextTasks = current.map(task =>
          task.id === editTask.id
            ? {
                ...task,
                ...form,
                deadline: form.deadline || '',
                updatedAt: timestamp,
              }
            : task,
        );

        const updatedColumns = [normalizeColumnOrder(nextTasks, form.status)];
        if (previous && previous.status !== form.status) {
          updatedColumns.push(normalizeColumnOrder(nextTasks, previous.status));
        }
        return mergeColumnUpdates(nextTasks, ...updatedColumns);
      }

      const order = current.filter(task => task.status === form.status).length;
      return [
        {
          id: createTaskId(),
          ...form,
          deadline: form.deadline || '',
          order,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        ...current,
      ];
    });

    toast.success(editTask?.id ? 'Task updated' : 'Task created');
    setShowModal(false);
    setEditTask(null);
  };

  const handleDelete = id => {
    if (!confirm('Delete this task?')) return;

    setTasks(current => {
      const taskToDelete = current.find(task => task.id === id);
      const nextTasks = current.filter(task => task.id !== id);
      if (!taskToDelete) return nextTasks;
      return mergeColumnUpdates(nextTasks, normalizeColumnOrder(nextTasks, taskToDelete.status));
    });

    toast.success('Task deleted');
  };

  const handleEdit = task => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleDragEnd = result => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setTasks(current => {
      const movingTask = current.find(task => task.id === draggableId);
      if (!movingTask) return current;

      const sourceTasks = sortTasks(current).filter(task => task.status === source.droppableId);
      const destinationTasks =
        source.droppableId === destination.droppableId
          ? sourceTasks
          : sortTasks(current).filter(task => task.status === destination.droppableId);

      const sourceWithoutTask = sourceTasks.filter(task => task.id !== draggableId);
      const movedTask = {
        ...movingTask,
        status: destination.droppableId,
        updatedAt: new Date().toISOString(),
      };
      const destinationWithTask = [...destinationTasks.filter(task => task.id !== draggableId)];
      destinationWithTask.splice(destination.index, 0, movedTask);

      const updatedSource = sourceWithoutTask.map((task, index) => ({ ...task, order: index }));
      const updatedDestination = destinationWithTask.map((task, index) => ({ ...task, order: index }));

      return mergeColumnUpdates(current, updatedSource, updatedDestination);
    });
  };

  const totalTasks = tasks.length;
  const inProgCt = tasks.filter(task => task.status === 'in-progress').length;
  const overdueCt = tasks.filter(task => task.deadline && isPast(new Date(task.deadline)) && task.status !== 'done').length;
  const highPriorityCt = tasks.filter(task => task.priority === 'high' && task.status !== 'done').length;
  const nextDeadline = useMemo(
    () =>
      tasks
        .filter(task => task.deadline && task.status !== 'done')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0],
    [tasks],
  );

  if (loading) {
    return <LoadingBoard />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(181,245,210,0.16),_transparent_24%),radial-gradient(circle_at_82%_18%,_rgba(242,120,75,0.16),_transparent_22%),linear-gradient(180deg,_#07111a_0%,_#08131d_46%,_#091721_100%)] text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="absolute left-[-8rem] top-14 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="absolute right-[-6rem] top-44 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />

      <nav className="sticky top-0 z-40 border-b border-white/8 bg-slate-950/45 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-teal-300 to-orange-300 font-display text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/20">
              TF
            </div>
            <div>
              <p className="font-display text-2xl text-white">TaskFlow</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Local-first task board</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-white/10 bg-white/6 px-4 py-2.5 backdrop-blur-xl sm:flex sm:items-center sm:gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-950">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email || 'Stored locally on this device'}</p>
              </div>
            </div>
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              onClick={() => {
                const nextName = prompt('Update workspace name', user?.name || '');
                if (nextName && nextName.trim()) {
                  login({ ...user, name: nextName.trim() });
                  toast.success('Workspace updated');
                }
              }}
            >
              Edit profile
            </button>
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              onClick={logout}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-[0_20px_100px_rgba(0,0,0,0.26)] backdrop-blur-2xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/70">Workspace overview</p>
            <h1 className="mt-4 font-display text-4xl leading-none text-white sm:text-5xl">
              Keep your work
              <span className="mt-2 block text-slate-300">clear, local, and moving.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300/85 sm:text-base">
              Every task update is saved directly in your browser, so this board stays fast,
              simple, and easy to deploy as a frontend-only Vite app.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-300 via-teal-300 to-orange-300 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:scale-[0.99]"
                onClick={() => {
                  setEditTask(null);
                  setShowModal(true);
                }}
              >
                Create new task
              </button>
              <div className="inline-flex items-center rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300">
                {nextDeadline
                  ? `Next deadline ${formatDistanceToNowStrict(new Date(nextDeadline.deadline), { addSuffix: true })}`
                  : 'No active deadlines yet'}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Total tasks', value: totalTasks, tone: 'text-white', bg: 'from-white/10 to-white/5' },
              { label: 'In progress', value: inProgCt, tone: 'text-cyan-200', bg: 'from-cyan-300/15 to-cyan-300/5' },
              { label: 'High priority', value: highPriorityCt, tone: 'text-amber-100', bg: 'from-amber-300/15 to-amber-300/5' },
              { label: 'Overdue', value: overdueCt, tone: 'text-rose-200', bg: 'from-rose-300/15 to-rose-300/5' },
            ].map(stat => (
              <div key={stat.label} className={`rounded-[1.6rem] border border-white/10 bg-gradient-to-br ${stat.bg} p-5 backdrop-blur-xl`}>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{stat.label}</p>
                <p className={`mt-4 font-display text-4xl ${stat.tone}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-4 rounded-[1.8rem] border border-white/10 bg-white/8 p-4 shadow-[0_18px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Task filters</p>
            <p className="mt-1 text-sm text-slate-300">Focus the board by priority without changing your saved task data.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'high', 'medium', 'low'].map(priority => (
              <button
                key={priority}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  priorityFilter === priority
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'border border-white/10 bg-slate-950/35 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setPriorityFilter(priority)}
              >
                {priority === 'all' ? 'All priorities' : `${priority[0].toUpperCase()}${priority.slice(1)} priority`}
              </button>
            ))}
          </div>
        </section>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="mt-6 grid gap-5 xl:grid-cols-3">
            {COLUMNS.map(column => {
              const columnTasks = getColumnTasks(column.id);

              return (
                <div
                  className={`rounded-[1.8rem] border border-white/10 bg-gradient-to-b ${column.tone} p-[1px] shadow-[0_18px_80px_rgba(0,0,0,0.18)]`}
                  key={column.id}
                >
                  <div className="h-full rounded-[1.75rem] bg-slate-950/70 p-4 backdrop-blur-xl">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className={`h-3 w-3 rounded-full ${column.accent}`} />
                          <p className="font-display text-2xl text-white">{column.label}</p>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">{column.description}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                        {columnTasks.length}
                      </span>
                    </div>

                    <Droppable droppableId={column.id}>
                      {provided => (
                        <div
                          className="min-h-[20rem] space-y-3 rounded-[1.4rem] border border-dashed border-white/8 bg-white/[0.03] p-3 transition"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {columnTasks.length === 0 ? (
                            <div className="flex min-h-[16rem] flex-col items-center justify-center rounded-[1.2rem] border border-white/6 bg-slate-950/35 px-6 text-center">
                              <p className="font-display text-2xl text-slate-200">No tasks yet</p>
                              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                                This lane is clear. Drag a card here or create a new task to keep momentum moving.
                              </p>
                            </div>
                          ) : (
                            columnTasks.map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {dragProvided => (
                                  <TaskCard
                                    task={task}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    provided={dragProvided}
                                  />
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </div>
        </DragDropContext>

        <Footer />
      </main>

      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => {
            setShowModal(false);
            setEditTask(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
