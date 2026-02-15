import { useEffect, useState } from 'react';

interface UseFetchResult<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
}

const useFetch = <T = unknown>(url: string): UseFetchResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(url, { signal });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result: T = await response.json();
                setData(result);
                setError(null);
            } catch (err) {
                if (err instanceof Error) {
                    if (err.name === 'AbortError') {
                        console.log('Fetch aborted');
                    } else {
                        setError(err);
                    }
                } else {
                    setError(new Error('Unknown error occurred'));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };
    }, [url]);

    return { loading, data, error };
};

export default useFetch;
