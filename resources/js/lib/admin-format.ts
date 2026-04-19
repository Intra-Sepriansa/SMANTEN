export function formatAdminDateTime(
    value: string | null | undefined,
    fallback: string = 'Belum ada',
): string {
    if (!value) {
        return fallback;
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export function formatAdminDate(
    value: string | null | undefined,
    fallback: string = 'Belum ada',
): string {
    if (!value) {
        return fallback;
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
    }).format(new Date(value));
}
