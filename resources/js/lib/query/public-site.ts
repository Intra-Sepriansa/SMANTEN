import { useQuery } from '@tanstack/react-query';
import { extracurricularVideoShowcase } from '@/lib/public-content';
import type {
    ExtracurricularVideoItem,
    HistoricalOrganizationEntry,
} from '@/types';

async function fetchPublicCollection<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Public API request failed: ${response.status}`);
    }

    const payload = await response.json();

    return payload.data as T;
}

const fallbackExtracurricularVideos: ExtracurricularVideoItem[] =
    extracurricularVideoShowcase.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        description: item.description,
        state: item.state,
        provider: 'youtube',
        externalUrl: null,
        thumbnailUrl: null,
        publishedAt: null,
    }));

export function useExtracurricularVideosQuery() {
    return useQuery({
        queryKey: ['public', 'videos', 'extracurricular'],
        queryFn: async () => {
            if (typeof window === 'undefined') {
                return fallbackExtracurricularVideos;
            }

            try {
                return await fetchPublicCollection<ExtracurricularVideoItem[]>(
                    '/api/public/videos/extracurricular',
                );
            } catch {
                return fallbackExtracurricularVideos;
            }
        },
        staleTime: 1000 * 60 * 5,
    });
}

export function useHistoricalOrganizationQuery(
    scope: 'school_management' | 'student_organization',
) {
    return useQuery({
        queryKey: ['public', 'organization', 'archive', scope],
        queryFn: async () => {
            if (typeof window === 'undefined') {
                return [];
            }

            try {
                return await fetchPublicCollection<HistoricalOrganizationEntry[]>(
                    `/api/public/organization/archive?scope=${scope}`,
                );
            } catch {
                return [];
            }
        },
        staleTime: 1000 * 60 * 5,
    });
}
