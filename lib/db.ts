import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Activity, Child, Database } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const SEED: Database = {
  children: [
    {
      id: "seed-mia",
      name: "Mia",
      ageYears: 5,
      createdAt: new Date("2024-01-01T08:00:00.000Z").toISOString(),
      activities: [
        {
          id: "seed-mia-breakfast",
          title: "Breakfast",
          time: "07:30",
          done: true,
          createdAt: new Date("2024-01-01T08:00:00.000Z").toISOString(),
        },
        {
          id: "seed-mia-reading",
          title: "Reading practice",
          time: "18:00",
          done: false,
          createdAt: new Date("2024-01-01T08:05:00.000Z").toISOString(),
        },
      ],
    },
  ],
};

async function ensureDb(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify(SEED, null, 2), "utf-8");
  }
}

async function readDb(): Promise<Database> {
  await ensureDb();
  const raw = await fs.readFile(DB_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw) as Database;
    if (!parsed.children) return { children: [] };
    return parsed;
  } catch {
    return { children: [] };
  }
}

async function writeDb(db: Database): Promise<void> {
  await ensureDb();
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export async function listChildren(): Promise<Child[]> {
  const db = await readDb();
  return db.children;
}

export async function createChild(name: string, ageYears: number): Promise<Child> {
  const db = await readDb();
  const child: Child = {
    id: randomUUID(),
    name,
    ageYears,
    createdAt: new Date().toISOString(),
    activities: [],
  };
  db.children.push(child);
  await writeDb(db);
  return child;
}

export async function addActivity(
  childId: string,
  title: string,
  time: string
): Promise<Activity | null> {
  const db = await readDb();
  const child = db.children.find((c) => c.id === childId);
  if (!child) return null;
  const activity: Activity = {
    id: randomUUID(),
    title,
    time,
    done: false,
    createdAt: new Date().toISOString(),
  };
  child.activities.push(activity);
  await writeDb(db);
  return activity;
}

export async function toggleActivity(
  childId: string,
  activityId: string
): Promise<Activity | null> {
  const db = await readDb();
  const child = db.children.find((c) => c.id === childId);
  if (!child) return null;
  const activity = child.activities.find((a) => a.id === activityId);
  if (!activity) return null;
  activity.done = !activity.done;
  await writeDb(db);
  return activity;
}

export async function deleteActivity(
  childId: string,
  activityId: string
): Promise<boolean> {
  const db = await readDb();
  const child = db.children.find((c) => c.id === childId);
  if (!child) return false;
  const before = child.activities.length;
  child.activities = child.activities.filter((a) => a.id !== activityId);
  const changed = child.activities.length !== before;
  if (changed) await writeDb(db);
  return changed;
}
