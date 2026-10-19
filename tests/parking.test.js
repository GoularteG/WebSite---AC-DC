import test from 'node:test';
import assert from 'node:assert/strict';
import {parkingPose,PARKING_ADVANCE,PARKING_OFFSET} from '../src/data/parking.js';
import {roadX} from '../src/data/journey.js';

test('parking advances continuously, steers with its path, brakes before the camera closes in',()=>{
  for(const start of [0,230,468,720]){
    const first=parkingPose(start,0),last=parkingPose(start,1);
    assert.equal(first.x,roadX(start)+2.5);assert.equal(first.z,-start);
    assert.equal(last.z,-start-PARKING_ADVANCE);
    assert.equal(last.x,roadX(start+PARKING_ADVANCE)+2.5+PARKING_OFFSET);
    let previous=first;
    for(let i=1;i<=420;i++){
      const t=i/600,p=parkingPose(start,t);
      assert.ok(p.z<=previous.z);
      assert.ok(Math.hypot(p.x-previous.x,p.z-previous.z)<.25);
      if(i>2&&i<410){
        const before=parkingPose(start,t-.00001),after=parkingPose(start,t+.00001);
        const tangent=-Math.atan((after.x-before.x)/(before.z-after.z));
        assert.ok(Math.abs(tangent-p.yaw)<.00001);
      }
      assert.equal(p.camera,0);previous=p;
    }
    assert.deepEqual(parkingPose(start,.7),{...last,camera:0});
    const early=parkingPose(start,.02).travel-first.travel;
    const late=last.travel-parkingPose(start,.68).travel;
    assert.ok(early>late*100);
  }
});
