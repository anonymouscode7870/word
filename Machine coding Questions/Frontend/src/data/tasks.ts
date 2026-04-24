import { HabitTracker } from '../types';

// Weekly habit tracker data with predefined subjects
export const habitTrackers: HabitTracker[] = [
    {
        id: '1',
        subject: 'DSA',
        target: '2Q/day',
        color: 'bg-blue-500',
        weeklyProgress: {
            'Monday': true,
            'Tuesday': true,
            'Wednesday': false,
            'Thursday': true,
            'Friday': true,
            'Saturday': false,
            'Sunday': false,
        }
    },
    {
        id: '2',
        subject: 'Job Apply',
        target: '20+ applications',
        color: 'bg-green-500',
        weeklyProgress: {
            'Monday': true,
            'Tuesday': true,
            'Wednesday': true,
            'Thursday': true,
            'Friday': true,
            'Saturday': false,
            'Sunday': false,
        }
    },
    {
        id: '3',
        subject: 'OS/DBMS/MySQL',
        target: '1Q',
        color: 'bg-purple-500',
        weeklyProgress: {
            'Monday': true,
            'Tuesday': false,
            'Wednesday': true,
            'Thursday': true,
            'Friday': false,
            'Saturday': false,
            'Sunday': false,
        }
    },
    {
        id: '4',
        subject: 'CN',
        target: '1Q',
        color: 'bg-orange-500',
        weeklyProgress: {
            'Monday': false,
            'Tuesday': true,
            'Wednesday': false,
            'Thursday': true,
            'Friday': true,
            'Saturday': false,
            'Sunday': false,
        }
    },
    {
        id: '5',
        subject: 'SDLC/STLC',
        target: 'Daily',
        color: 'bg-red-500',
        weeklyProgress: {
            'Monday': true,
            'Tuesday': true,
            'Wednesday': true,
            'Thursday': false,
            'Friday': true,
            'Saturday': false,
            'Sunday': false,
        }
    },
    {
        id: '6',
        subject: 'React/JS/CSS',
        target: 'Daily Practice',
        color: 'bg-yellow-500',
        weeklyProgress: {
            'Monday': true,
            'Tuesday': true,
            'Wednesday': true,
            'Thursday': true,
            'Friday': true,
            'Saturday': true,
            'Sunday': false,
        }
    },
    {
        id: '7',
        subject: 'Node.js/MongoDB',
        target: 'Daily',
        color: 'bg-green-600',
        weeklyProgress: {
            'Monday': true,
            'Tuesday': false,
            'Wednesday': true,
            'Thursday': true,
            'Friday': true,
            'Saturday': false,
            'Sunday': false,
        }
    },
    {
        id: '8',
        subject: 'C++ OOPs',
        target: '1Q',
        color: 'bg-pink-500',
        weeklyProgress: {
            'Monday': true,
            'Tuesday': true,
            'Wednesday': false,
            'Thursday': true,
            'Friday': false,
            'Saturday': false,
            'Sunday': false,
        }
    },
    {
        id: '9',
        subject: 'Java',
        target: '1Q',
        color: 'bg-indigo-500',
        weeklyProgress: {
            'Monday': false,
            'Tuesday': true,
            'Wednesday': true,
            'Thursday': false,
            'Friday': true,
            'Saturday': false,
            'Sunday': false,
        }
    },
    {
        id: '10',
        subject: 'ML/Python',
        target: 'Daily',
        color: 'bg-teal-500',
        weeklyProgress: {
            'Monday': true,
            'Tuesday': false,
            'Wednesday': true,
            'Thursday': true,
            'Friday': true,
            'Saturday': false,
            'Sunday': false,
        }
    },
    {
        id: '11',
        subject: 'Aptitude',
        target: 'Daily',
        color: 'bg-cyan-500',
        weeklyProgress: {
            'Monday': true,
            'Tuesday': true,
            'Wednesday': true,
            'Thursday': true,
            'Friday': true,
            'Saturday': false,
            'Sunday': false,
        }
    },
    {
        id: '12',
        subject: 'YouTube Study',
        target: '1 Video/day',
        color: 'bg-red-600',
        weeklyProgress: {
            'Monday': true,
            'Tuesday': true,
            'Wednesday': true,
            'Thursday': true,
            'Friday': true,
            'Saturday': true,
            'Sunday': true,
        }
    }
];

export const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Calculate progress percentage for a habit
export const calculateHabitProgress = (tracker: HabitTracker): number => {
    const completed = Object.values(tracker.weeklyProgress).filter(v => v).length;
    return Math.round((completed / 7) * 100);
};

// Get total weekly progress
export const calculateTotalProgress = (trackers: HabitTracker[]): number => {
    const allCompleted = trackers.reduce((sum, tracker) => {
        return sum + Object.values(tracker.weeklyProgress).filter(v => v).length;
    }, 0);
    const total = trackers.length * 7;
    return Math.round((allCompleted / total) * 100);
};
