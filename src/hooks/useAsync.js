import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

export const useAsync = (asyncFunction, immediate = true) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const toast = useToast();

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const response = await asyncFunction(...args);
        setData(response);
        return response;
      } catch (err) {
        const errorMsg = err.message || 'Operation failed';
        setError(errorMsg);
        toast.error(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, toast]
  );

  return { execute, loading, error, data };
};

export default useAsync;
