import { useEffect, useState } from "react";

export const usePersistentState = <T>(load: () => T, save: (state: T) => void) => {
  const [state, setState] = useState<T>(() => load());

  useEffect(() => {
    save(state);
  }, [save, state]);

  return [state, setState] as const;
};
