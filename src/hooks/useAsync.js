import { useState, useCallback } from 'react';
export function useAsync(asyncFunction, immediate = false) {
    const [state, setState] = useState({
        data: null,
        loading: immediate,
        error: null,
    });
    const execute = useCallback(async (...args) => {
        setState(prevState => ({ ...prevState, loading: true, error: null }));
        try {
            const response = await asyncFunction(...args);
            setState({ data: response, loading: false, error: null });
            return response;
        }
        catch (error) {
            setState({ data: null, loading: false, error: error });
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
