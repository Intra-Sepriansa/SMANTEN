export type AlumniStoryCategory = 'cerita' | 'karir' | 'kampus' | 'inspirasi';

export type AlumniStoryFormData = {
    author_name: string;
    graduation_year: string;
    category: AlumniStoryCategory;
    title: string;
    body: string;
    institution_name: string;
    occupation_title: string;
    location_query: string;
    city: string;
    province: string;
    latitude: string;
    longitude: string;
    is_open_to_mentor: boolean;
    has_hiring_info: boolean;
    contact_email: string;
};

export const initialAlumniStoryForm: AlumniStoryFormData = {
    author_name: '',
    graduation_year: '',
    category: 'cerita',
    title: '',
    body: '',
    institution_name: '',
    occupation_title: '',
    location_query: '',
    city: '',
    province: '',
    latitude: '',
    longitude: '',
    is_open_to_mentor: false,
    has_hiring_info: false,
    contact_email: '',
};

const visitorTokenKey = 'alumni-forum-visitor';

export function ensureAlumniForumVisitorToken(): string {
    if (typeof window === 'undefined') {
        return `visitor-${Math.random().toString(36).slice(2)}`;
    }

    const existing = window.localStorage.getItem(visitorTokenKey);

    if (existing) {
        return existing;
    }

    const token = `visitor-${crypto.randomUUID()}`;
    window.localStorage.setItem(visitorTokenKey, token);

    return token;
}

export function persistAlumniForumVisitorToken(token: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(visitorTokenKey, token);
    document.cookie = `alumni_forum_visitor=${token}; path=/; max-age=${60 * 60 * 24 * 365}`;
}
