# Skill — MAH★P Three.js Environment Artist

## Mission
Build six lightweight, art-directed 3D environments that support the original project photography.

## Scene inventory
- Mercury — grey mineral/cratered planet.
- Uranus — pale cyan icy giant and soft atmospheric haze.
- Pluto — charcoal frozen dwarf planet.
- Mars — terracotta/red-orange rocky planet with subtle dust.
- Editorial Studio Photography — green field, grass and natural light.
- Aurora — dark urban concrete, layered torn-poster relief and punk atmosphere.

## Implementation rules
- Inspect existing React version before selecting R3F; v9 for React 19, v8 for React 18.
- Use one reusable scene host and load only the active scene.
- Use procedural/locally authored materials and geometry; no remote stock backgrounds.
- Keep camera movement restrained.
- Use instancing for repeated grass/particles.
- Reduce DPR, density, shadows and post-processing on mobile.
- Pause when hidden and dispose GPU resources when no longer used.
- Provide a static non-WebGL fallback.
- Original photos, collages, silhouettes and illustrations stay as HTML/image foreground content.
