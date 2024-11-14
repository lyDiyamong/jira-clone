import { useState } from "react";
import { toast } from "sonner";

type FetchFunction<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

interface UseFetchReturn<T, Args extends unknown[]> {
    data: T | undefined;
    loading: boolean;
    error: Error | null;
    fn: (...args: Args) => Promise<void>;
    setData: React.Dispatch<React.SetStateAction<T | undefined>>;
}

const useFetch = <T, Args extends unknown[]>(cb: FetchFunction<T, Args>): UseFetchReturn<T, Args> => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fn = async (...args: Args) => {
        setLoading(true);
        setError(null);

        try {
            const response = await cb(...args);
            setData(response);
        } catch (err) {
            const error = err as Error;
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fn, setData };
};

export default useFetch;
