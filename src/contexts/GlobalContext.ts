import { createContext } from 'react';

export const GlobalContext = createContext<any>({
  score: null,
  setScore: null,
  orbis: null,
});
