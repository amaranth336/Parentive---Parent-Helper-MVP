"use client";

import { useEffect, useMemo, useState } from "react";
import type { Child } from "@/lib/types";

export default function Home() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");

  const [activityTitle, setActivityTitle] = useState("");
  const [activityTime, setActivityTime] = useState("");

  const selected = useMemo(
    () => children.find((c) => c.id === selectedId) ?? null,
    [children, selectedId]
  );

  function flash(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  }

  async function loadChildren(keepSelection = true) {
    const res = await fetch("/api/children");
    const data = await res.json();
    const list: Child[] = data.children ?? [];
    setChildren(list);
    setSelectedId((prev) => {
      if (keepSelection && prev && list.some((c) => c.id === prev)) return prev;
      return list[0]?.id ?? null;
    });
    setLoading(false);
  }

  useEffect(() => {
    loadChildren();
  }, []);

  async function handleAddChild(e: React.FormEvent) {
    e.preventDefault();
    if (!childName.trim()) return;
    const res = await fetch("/api/children", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: childName, ageYears: childAge || 0 }),
    });
    if (res.ok) {
      const { child } = await res.json();
      setChildName("");
      setChildAge("");
      await loadChildren(false);
      setSelectedId(child.id);
      flash(`Added ${child.name}`);
    } else {
      const err = await res.json();
      flash(err.error ?? "Could not add child");
    }
  }

  async function handleAddActivity(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !activityTitle.trim()) return;
    const res = await fetch(`/api/children/${selected.id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: activityTitle, time: activityTime }),
    });
    if (res.ok) {
      setActivityTitle("");
      setActivityTime("");
      await loadChildren();
      flash("Activity added");
    } else {
      const err = await res.json();
      flash(err.error ?? "Could not add activity");
    }
  }

  async function toggle(activityId: string) {
    if (!selected) return;
    await fetch(`/api/children/${selected.id}/activities/${activityId}`, {
      method: "PATCH",
    });
    await loadChildren();
  }

  async function remove(activityId: string) {
    if (!selected) return;
    await fetch(`/api/children/${selected.id}/activities/${activityId}`, {
      method: "DELETE",
    });
    await loadChildren();
    flash("Activity removed");
  }

  const activities = selected?.activities ?? [];
  const doneCount = activities.filter((a) => a.done).length;
  const pct = activities.length
    ? Math.round((doneCount / activities.length) * 100)
    : 0;

  const sortedActivities = [...activities].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  return (
    <main className="page">
      <div className="header">
        <div className="logo">🧸</div>
        <div style={{ flex: 1 }}>
          <h1>Parentive</h1>
          <p>Keep your kids&apos; daily routines on track.</p>
        </div>
        <a 
          href="/request"
          className="btn btn-primary"
          style={{ whiteSpace: 'nowrap', width: 'auto' }}
        >
          Take it off my plate
        </a>
      </div>

      <div className="grid">
        <section className="card">
          <h2>Children</h2>
          <form onSubmit={handleAddChild}>
            <div className="field">
              <label htmlFor="childName">Name</label>
              <input
                id="childName"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="e.g. Noah"
              />
            </div>
            <div className="field">
              <label htmlFor="childAge">Age</label>
              <input
                id="childAge"
                type="number"
                min={0}
                max={25}
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                placeholder="years"
              />
            </div>
            <button className="btn btn-primary" type="submit">
              + Add child
            </button>
          </form>

          <div className="child-list">
            {loading ? (
              <div className="empty">Loading…</div>
            ) : children.length === 0 ? (
              <div className="empty">No children yet. Add one above.</div>
            ) : (
              children.map((c) => (
                <div
                  key={c.id}
                  className={`child-pill ${c.id === selectedId ? "active" : ""}`}
                  onClick={() => setSelectedId(c.id)}
                >
                  <span className="name">{c.name}</span>
                  <span className="age">{c.ageYears} yrs</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="card">
          {selected ? (
            <>
              <div className="section-head">
                <h2>{selected.name}&apos;s routine</h2>
                <span className="muted">
                  {doneCount}/{activities.length} done
                </span>
              </div>

              <div className="progress" aria-label="completion">
                <span style={{ width: `${pct}%` }} />
              </div>

              <form onSubmit={handleAddActivity} className="row">
                <div className="field grow">
                  <label htmlFor="activityTitle">Activity</label>
                  <input
                    id="activityTitle"
                    value={activityTitle}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    placeholder="e.g. Brush teeth"
                  />
                </div>
                <div className="field">
                  <label htmlFor="activityTime">Time</label>
                  <input
                    id="activityTime"
                    type="time"
                    value={activityTime}
                    onChange={(e) => setActivityTime(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary" type="submit">
                  Add
                </button>
              </form>

              <div style={{ marginTop: 18 }}>
                {sortedActivities.length === 0 ? (
                  <div className="empty">
                    No activities yet. Add the first routine above.
                  </div>
                ) : (
                  sortedActivities.map((a) => (
                    <div
                      key={a.id}
                      className={`activity ${a.done ? "done" : ""}`}
                    >
                      <button
                        className={`check ${a.done ? "on" : ""}`}
                        onClick={() => toggle(a.id)}
                        aria-label={a.done ? "Mark not done" : "Mark done"}
                      >
                        {a.done ? "✓" : ""}
                      </button>
                      <span className="time">{a.time}</span>
                      <span className="title">{a.title}</span>
                      <button
                        className="link-danger"
                        onClick={() => remove(a.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="empty">
              Select or add a child to start building their routine.
            </div>
          )}
        </section>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
