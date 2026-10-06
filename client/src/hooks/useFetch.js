import { useCallback, useEffect, useState } from 'react';
import { errMsg } from '../services/api.js';

// Runs `fn` on mount and whenever deps change. Ignores stale responses.
export default function useFetch(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true, error: '' }));
    fn()
      .then((res) => live && setState({ data: res.data, loading: false, error: '' }))
      .catch((e) => live && setState({ data: null, loading: false, error: errMsg(e) }));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { ...state, reload };
}
