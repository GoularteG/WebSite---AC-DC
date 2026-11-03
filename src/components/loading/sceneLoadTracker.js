// Per-canvas load ownership: background work in another scene cannot release it.
export function createSceneLoadTracker() {
  let snapshot={pending:0,revision:0};
  const listeners=new Set(),tasks=new Set();
  const publish=()=>{snapshot={pending:tasks.size,revision:snapshot.revision+1};listeners.forEach(fn=>fn());};
  return {
    subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
    getSnapshot:()=>snapshot,
    begin(){
      const task=Symbol();tasks.add(task);publish();let finished=false;
      return()=>{if(finished)return;finished=true;tasks.delete(task);publish();};
    },
  };
}
