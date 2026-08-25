export interface Activity {
  id: string;
  title: string;
  time: string;
  done: boolean;
  createdAt: string;
}

export interface Child {
  id: string;
  name: string;
  ageYears: number;
  createdAt: string;
  activities: Activity[];
}

export interface Database {
  children: Child[];
}
