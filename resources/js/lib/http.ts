export function getCsrfToken(): string | null {
    if (typeof document === 'undefined') {
        return null;
    }

    return (
        document
            .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? null
    );
}

export function jsonHeaders(init: HeadersInit = {}): Headers {
    const csrfToken = getCsrfToken();
    const headers = new Headers(init);

    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    if (csrfToken) {
        headers.set('X-CSRF-TOKEN', csrfToken);
    }

    return headers;
}
