# Skill — MAH★P Accessibility, Performance & QA

## Mission
Ensure the immersive experience remains usable, responsive and stable.

## Accessibility
- semantic headings/landmarks, skip link and visible focus;
- keyboard/touch navigation;
- accessible image detail dialog, Escape and focus restoration;
- useful alt text;
- reduced-motion path with all content visible;
- decorative canvas/star hidden from assistive tech;
- no information that is hover-only.

## Performance
- one active Three.js environment at a time where feasible;
- lazy-load noncritical scenes/photos;
- cap DPR and adapt quality;
- instance repeated particles/grass;
- pause offscreen scenes;
- dispose GPU resources and clean timelines/listeners;
- static fallback for unsupported WebGL.

## QA
- test all seven routes directly and after refresh;
- test forward and reverse scroll;
- test all 24 Materials details;
- test About reveal and direct About route;
- inspect 1440px, 1280px, 768px and 390px viewports (or report actual available sizes);
- run only the real package scripts;
- report PASS/PARTIAL/FAIL/NOT VERIFIED with evidence.
