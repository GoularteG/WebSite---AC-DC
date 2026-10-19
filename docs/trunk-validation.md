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
