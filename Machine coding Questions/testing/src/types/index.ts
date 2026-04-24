export interface Lecture {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    youtubeUrl: string;
    isNew: boolean;
    category: string;
}

export interface Note {
    id: string;
    title: string;
    category: string;
    description: string;
    downloadUrl: string;
    pages: number;
}

export interface Statistic {
    label: string;
    value: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string; // YYYY-MM-DD format
    completed: boolean;
    createdAt: string;
    category: string;
}

export interface HabitTracker {
    id: string;
    subject: string;
    target: string; // e.g., "2Q/day", "20+ apps", "1Q"
    color: string;
    weeklyProgress: {
        [day: string]: boolean; // Monday: true/false, Tuesday: true/false, etc.
    };
}

export interface User {
    email: string;
    isLoggedIn: boolean;
}
