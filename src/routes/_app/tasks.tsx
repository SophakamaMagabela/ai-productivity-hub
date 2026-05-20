import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage, type Task } from "@/lib/storage";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({ meta: [{ title: "Tasks — Aria" }] }),
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("aria.tasks", []);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [due, setDue] = useState("");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks([
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        priority,
        due: due || undefined,
        done: false,
        createdAt: Date.now(),
      },
      ...tasks,
    ]);
    setTitle("");
    setDue("");
    setPriority("medium");
  };

  const toggle = (id: string) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTasks(tasks.filter((t) => t.id !== id));

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Capture, prioritize and track. Aria can generate tasks from your documents and meetings.
        </p>
      </header>

      <form
        onSubmit={add}
        className="grid gap-2 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur sm:grid-cols-[1fr_140px_160px_auto]"
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to get done?"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task["priority"])}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </form>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">
          Pending <span className="text-muted-foreground">({open.length})</span>
        </h2>
        {open.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            All clear. Time for deep work.
          </div>
        ) : (
          <ul className="space-y-2">
            {open.map((t) => (
              <TaskRow key={t.id} task={t} onToggle={toggle} onRemove={remove} />
            ))}
          </ul>
        )}
      </section>

      {done.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">
            Completed <span className="text-muted-foreground">({done.length})</span>
          </h2>
          <ul className="space-y-2">
            {done.map((t) => (
              <TaskRow key={t.id} task={t} onToggle={toggle} onRemove={remove} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onRemove,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-card/70 p-3 backdrop-blur">
      <button
        onClick={() => onToggle(task.id)}
        className="text-muted-foreground hover:text-primary"
        aria-label="toggle"
      >
        {task.done ? (
          <CheckCircle2 className="h-5 w-5 text-success" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>
      <div className="flex-1">
        <div className={task.done ? "text-muted-foreground line-through" : "font-medium"}>
          {task.title}
        </div>
        {task.due && <div className="text-xs text-muted-foreground">Due {task.due}</div>}
      </div>
      <span
        className={`rounded-full px-2 py-0.5 text-xs ${
          task.priority === "high"
            ? "bg-destructive/10 text-destructive"
            : task.priority === "medium"
              ? "bg-warning/10 text-warning"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {task.priority}
      </span>
      <button
        onClick={() => onRemove(task.id)}
        className="text-muted-foreground hover:text-destructive"
        aria-label="delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
