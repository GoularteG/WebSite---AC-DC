import { createContext, useContext, useEffect, useMemo } from 'react';
import { createSceneryResourcePool } from './sceneryResourcePool';

const Resources = createContext(null);
export function SceneryResources({ children }) {
  const pool = useMemo(createSceneryResourcePool, []);
  useEffect(() => () => pool.dispose(), [pool]);
  return <Resources.Provider value={pool}>{children}</Resources.Provider>;
}
export function useSceneryResources() {
  const resources = useContext(Resources);
  if (!resources) throw new Error('Scenery components require SceneryResources');
  return resources;
}
