# Interactive trunk validation

- Production build: Vite, successful; existing large Three.js chunk warning remains.
- Existing journey/finale tests: both pass.
- Browser UI checks at 1280×900 and 390×844, including WebGL unavailable:
  - enter the trunk from the road;
  - open records and guitar descriptions;
  - close with Escape and restore focus to the selected object button;
  - open the existing book, advance to page 3 and return to page 1;
  - return to the road with the same saved scroll offset;
  - no horizontal overflow on mobile and no JavaScript runtime exceptions.
- Motion preference is respected. A skip action and bounded transition fallback
  preserve access if WebGL or the original vehicle cannot load.
- The road remains mounted and stops rendering while the interior is displayed.
  The interior uses demand rendering, a capped DPR, static lighting and no shadows.
- The environment uses software rendering; hardware FPS has not been measured.
- The standalone interior rendered successfully in desktop and mobile viewports
  using SwiftShader. Raycast clicks on the actual 3D book, records and guitar
  each opened their corresponding dialog, with no runtime exceptions.

## Parking and supplied guitar update

- Parking samples cover the beginning, middle and end of the road. Tests verify
  continuous forward travel, yaw aligned with the path tangent, deceleration and
  a stationary vehicle before the final rear-camera approach.
- Browser inspection of the real journey rig and original Charger confirmed
  forward travel of 28 world units, changing yaw through the turn, the final rear
  view and entry to the trunk. Driving frame callbacks in batches also confirmed
  return to the exact initial car transform. Software-rendered frame stepping was
  used for deterministic measurements; this is not a hardware FPS benchmark.
- Uploaded guitar rendered successfully in the inspector. Browser inputs verified
  drag rotation, mouse-wheel zoom, reset, rotation buttons, mobile two-finger
  pinch zoom, close/focus restoration and no horizontal mobile overflow.
- No JavaScript runtime exceptions in the guitar interaction test.
- Source material conversion and attribution are documented in guitar-asset.md.
