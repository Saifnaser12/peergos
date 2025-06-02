import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

type AsyncFunction<T> = (...args: any[]) => Promise<T>;

export function useAsync<T>(asyncFunction: AsyncFunction<T>, immediate = false) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async (...args: any[]) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    try {
      const response = await asyncFunction(...args);
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
      throw error;
    }
  }, [asyncFunction]);

  return {
    ...state,
    execute,
    reset: useCallback(() => {
      setState({ data: null, loading: false, error: null });
    }, []),
  };
} 