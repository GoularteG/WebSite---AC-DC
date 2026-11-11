import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSceneLoads } from './SceneLoading';

function setWarmupVisibility(scene) {
  const restored = [];
  scene.traverse(node => {
    if (!node.visible || node.frustumCulled) {
      restored.push({ node, visible: node.visible, frustumCulled: node.frustumCulled });
      node.visible = true;
      node.frustumCulled = false;
    }
  });
  return () => {
    restored.forEach(({ node, visible, frustumCulled }) => {
      node.visible = visible;
      node.frustumCulled = frustumCulled;
    });
  };
}

// Asset completion is followed by shader compilation, texture upload and a GPU
// fence after an actual render. Cached models still need this on each new Canvas.
export default function SceneReady({onReady}) {
  const {gl,scene,camera,invalidate}=useThree();
  const loads=useSceneLoads();
  const job=useRef(null),reported=useRef(false);
  const [error,setError]=useState(null);
  useEffect(()=>{
    if(loads.pending||reported.current)return;
    const current={phase:'warm',frames:0,cancelled:false,raf:0,fence:null,restore:null};
    job.current=current;
    invalidate();
    return()=>{
      current.cancelled=true;cancelAnimationFrame(current.raf);
      current.restore?.();current.restore=null;
      if(current.fence)gl.getContext().deleteSync(current.fence);
      if(job.current===current)job.current=null;
    };
  },[loads,gl,scene,camera,invalidate]);
  useFrame(()=>{
    const current=job.current;
    if(!current||current.cancelled||reported.current)return;
    const fail=err=>{current.restore?.();current.restore=null;if(!current.cancelled)setError(err);};
    if(current.phase==='warm'){
      if(++current.frames<2){invalidate();return;}
      // Temporarily unhide and un-cull distant finale groups so this warm-up frame
      // and compileAsync upload all VBOs, VAOs and shaders before revealing the scene.
      current.restore=setWarmupVisibility(scene);
      current.phase='compile';
      Promise.resolve().then(()=>{if(!current.cancelled)return gl.compileAsync(scene,camera);}).then(()=>{
        current.restore?.();current.restore=null;
        if(current.cancelled)return;
        // Upload textures before revealing, including generated canvas maps.
        const textures=new Set();
        scene.traverse(node=>{
          const materials=Array.isArray(node.material)?node.material:[node.material];
          materials.forEach(material=>{if(material)Object.values(material).forEach(value=>{if(value?.isTexture)textures.add(value);});});
        });
        if(scene.environment?.isTexture)textures.add(scene.environment);
        textures.forEach(texture=>gl.initTexture(texture));
        current.phase='present';invalidate();
      }).catch(fail);
    }else if(current.phase==='present'){
      current.phase='gpu';
      // Runs after this frame has submitted its render commands.
      current.raf=requestAnimationFrame(()=>{
        if(current.cancelled)return;
        const context=gl.getContext();
        const finish=()=>{if(!current.cancelled&&!reported.current){reported.current=true;onReady?.();}};
        if(context.isContextLost()){fail(new Error('O contexto WebGL foi interrompido.'));return;}
        if(!context.fenceSync){context.finish();finish();return;}
        current.fence=context.fenceSync(context.SYNC_GPU_COMMANDS_COMPLETE,0);
        if(!current.fence){fail(new Error('Não foi possível preparar a cena 3D.'));return;}
        context.flush();
        const poll=()=>{
          if(current.cancelled)return;
          const status=context.clientWaitSync(current.fence,0,0);
          if(status===context.TIMEOUT_EXPIRED){current.raf=requestAnimationFrame(poll);return;}
          context.deleteSync(current.fence);current.fence=null;
          if(status===context.WAIT_FAILED){fail(new Error('Não foi possível concluir a cena 3D.'));return;}
          finish();
        };
        poll();
      });
    }
  });
  if(error)throw error;
  return null;
}
