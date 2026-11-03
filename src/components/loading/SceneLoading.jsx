import { createContext, useContext, useLayoutEffect, useMemo, useSyncExternalStore } from 'react';
import { createSceneLoadTracker } from './sceneLoadTracker';
const Context=createContext(null);
export function SceneLoading({children}) {
  const tracker=useMemo(createSceneLoadTracker,[]);
  return <Context.Provider value={tracker}>{children}</Context.Provider>;
}
export function useSceneTask(){return useContext(Context)?.begin;}
export function useSceneLoads(){
  const tracker=useContext(Context);
  return useSyncExternalStore(tracker.subscribe,tracker.getSnapshot,tracker.getSnapshot);
}
// Use only as a Suspense fallback, so its lifecycle follows unresolved resources.
export function ScenePending(){
  const begin=useSceneTask();
  useLayoutEffect(()=>begin?.(),[begin]);
  return null;
}
