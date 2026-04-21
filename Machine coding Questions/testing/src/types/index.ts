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
