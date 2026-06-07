import { useEffect, useState } from 'react';

type ResourceState<T> = {
  data: T[];
  total: number;
  loading: boolean;
  error: string | null;
};

type PaginationResponse<T> = {
  items: T[];
  total: number;
};

export function useResourceList<T>(request: () => Promise<PaginationResponse<T>>) {
  const [state, setState] = useState<ResourceState<T>>({
    data: [],
    total: 0,
    loading: true,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await request();

        if (cancelled) return;

        setState({
          data: response.items,
          total: response.total,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (cancelled) return;

        setState({
          data: [],
          total: 0,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load data',
        });
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [request, reloadToken]);

  return {
    ...state,
    reload: () => setReloadToken((current) => current + 1),
  };
}
