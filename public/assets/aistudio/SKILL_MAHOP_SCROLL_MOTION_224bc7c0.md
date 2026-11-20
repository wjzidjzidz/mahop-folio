# Skill — MAH★P Scroll Storytelling & Motion

## Mission
Choreograph the visitor's scroll as a reversible editorial journey.

## Required systems
- Home low-opacity image drift around the MAHOP wordmark.
- Sticky project scene behind flowing photo sequences.
- Progressive scene opacity reduction as images take over.
- Reverse scroll restores scenes and withdraws foreground content.
- 24-sample progressive disappearance, with selective reappearance when scrolling upward.
- About reveal after the full Materials sequence.
- Persistent star companion ending at the centre of the white footer.

## Implementation rules
- Native browser scroll remains in control.
- Use GSAP/ScrollTrigger as the single primary scroll-timeline system if compatible.
- Use scoped contexts/useGSAP and clean up all triggers on unmount.
- Prefer `scrub`/progress mapping for reversible behaviour.
- Keep the chapter title visible for the planned interval.
- Use limited pinning; mobile receives simplified timelines.
- Respect reduced motion by showing all content statically.
- Never make the only route to a photo depend on animation completing.
