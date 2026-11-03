import test from 'node:test';
import assert from 'node:assert/strict';
import { createSceneLoadTracker } from '../src/components/loading/sceneLoadTracker.js';
import { hasVisibleSceneFailure } from '../src/components/loading/sceneFailure.js';

test('scene waits for every task, including one discovered after another completes',()=>{
  const tracker=createSceneLoadTracker();const finishModel=tracker.begin(),finishImage=tracker.begin();
  assert.equal(tracker.getSnapshot().pending,2);
  finishModel();const finishTexture=tracker.begin();finishImage();
  assert.equal(tracker.getSnapshot().pending,1);
  finishTexture();assert.equal(tracker.getSnapshot().pending,0);
});
test('cleanup is idempotent and a different scene cannot release this scene',()=>{
  const entry=createSceneLoadTracker(),road=createSceneLoadTracker();
  const finishEntry=entry.begin(),finishRoad=road.begin();
  finishEntry();finishEntry();assert.equal(entry.getSnapshot().pending,0);assert.equal(road.getSnapshot().pending,1);
  finishRoad();assert.equal(road.getSnapshot().pending,0);
});
test('subscribers see stable snapshots until a resource changes and can unsubscribe',()=>{
  const tracker=createSceneLoadTracker(),initial=tracker.getSnapshot();let updates=0;
  const unsubscribe=tracker.subscribe(()=>updates++);
  assert.equal(tracker.getSnapshot(),initial);
  const finish=tracker.begin();assert.notEqual(tracker.getSnapshot(),initial);
  unsubscribe();finish();assert.equal(updates,1);
});

test('a canvas compatibility message never releases an unfinished scene',()=>{
  const message={closest:()=>({tagName:'CANVAS'}),getClientRects:()=>[{}]};
  assert.equal(hasVisibleSceneFailure({querySelectorAll:()=>[message]}),false);
});
test('only a rendered failure in the selected scene ends loading',()=>{
  assert.equal(hasVisibleSceneFailure(null),false);
  assert.equal(hasVisibleSceneFailure({querySelectorAll:()=>[{closest:()=>null,getClientRects:()=>[]}]}),false);
  assert.equal(hasVisibleSceneFailure({querySelectorAll:()=>[{closest:()=>null,getClientRects:()=>[{}]}]}),true);
});
