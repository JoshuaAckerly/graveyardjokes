import { useEffect, useState } from 'react';

export interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: boolean;
}

/**
 * Fetches JSON from `url` on mount, with cancellation on unmount.
 * Returns { data, loading, error }.
 * (Inlined from the former shared @gj/hooks package.)
 */
export function useFetchApi<T>(url: string): FetchState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        fetch(url)
            .then((r) => {
                if (!r.ok) throw new Error('non-ok');
                return r.json() as Promise<T>;
            })
            .then((json) => {
                if (!cancelled) setData(json);
            })
            .catch(() => {
                if (!cancelled) setError(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [url]);

    return { data, loading, error };
}
