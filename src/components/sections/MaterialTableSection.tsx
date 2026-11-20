import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MATERIAL_SWATCHES, type MaterialSwatch } from '../../data/content';
import { PortfolioImage } from '../PortfolioImage';
import { MaterialModal } from '../MaterialModal';
import { AboutSection } from './AboutSection';
import {
  computeAboutRevealState,
  computeMaterialSampleState,
  getMappedMaterialSwatches,
  smoothStep,
} from '../../utils/journeyLogic';
import { useIsCompactViewport, useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface MaterialTableSectionProps {
  continuousAboutTransition?: boolean;
  showMovementTag?: boolean;
}

export function MaterialTableSection({
  continuousAboutTransition = false,
  showMovementTag = true,
}: MaterialTableSectionProps) {
  const mappedSwatches = useMemo(
    () => getMappedMaterialSwatches(MATERIAL_SWATCHES),
    []
  );

  const stageRef = useRef<HTMLElement>(null);
  const triggerElRef = useRef<HTMLElement | null>(null);
  const [selectedSwatch, setSelectedSwatch] = useState<MaterialSwatch | null>(null);
  const [dismantleProgress, setDismantleProgress] = useState(0);

  const reducedMotion = useReducedMotion();
  const isCompact = useIsCompactViewport();

  const useUnifiedScrollChamber =
    continuousAboutTransition && !reducedMotion && !isCompact;

  useEffect(() => {
    if (!useUnifiedScrollChamber) {
      setDismantleProgress(0);
      return;
    }

    const stageEl = stageRef.current;
    if (!stageEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stageEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          setDismantleProgress(self.progress);
        },
      });
    }, stageRef);

    return () => ctx.revert();
  }, [useUnifiedScrollChamber]);

  const handleOpenSwatch = (swatch: MaterialSwatch, target: HTMLElement) => {
    triggerElRef.current = target;
    setSelectedSwatch(swatch);
  };

  const handleCloseModal = () => {
    setSelectedSwatch(null);
  };

  const aboutRevealState = computeAboutRevealState(
    dismantleProgress,
    reducedMotion,
    false
  );

  const boardHeaderOpacity = useUnifiedScrollChamber
    ? Number((1 - smoothStep(0.28, 0.54, dismantleProgress)).toFixed(3))
    : 1;

  const renderSpecimenBoard = (isInteractiveProgress: boolean) => (
    <div
      className={`w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 ${
        isInteractiveProgress ? 'h-full flex flex-col justify-center pt-16 pb-6' : ''
      }`}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 ${
          isInteractiveProgress ? 'mb-3 sm:mb-5' : 'mb-8 sm:mb-10'
        }`}
        style={{ opacity: boardHeaderOpacity }}
      >
        <div>
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-[#B8B5B1] block mb-1.5">
            {showMovementTag ? 'Textile Specimen Table · 24 Mapped Swatches' : 'Curated Textile Archive · 24 Mapped Swatches'}
          </span>
          <h2
            className={`font-display uppercase tracking-tighter leading-[0.84] text-[#F5F3EF] ${
              isInteractiveProgress ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-5xl sm:text-7xl lg:text-8xl'
            }`}
          >
            MATERIAL TABLE
          </h2>
        </div>
        <p className="font-serif italic text-sm sm:text-base text-[#B8B5B1]">
          Click any specimen to inspect plate texture
        </p>
      </div>

      {/* Unboxed Museum Specimen Board — Strictly 24 Mapped Records */}
      <div
        data-testid="material-table-grid"
        className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 items-center ${
          isInteractiveProgress
            ? 'gap-x-4 gap-y-2.5 sm:gap-x-6 sm:gap-y-3.5'
            : 'gap-x-4 gap-y-6 sm:gap-x-7 sm:gap-y-8'
        }`}
      >
        {mappedSwatches.map((swatch, index) => {
          if (!swatch.image) return null;
          const visualState = isInteractiveProgress
            ? computeMaterialSampleState(
                index,
                mappedSwatches.length,
                dismantleProgress,
                false
              )
            : { opacity: 1, translateY: 0, scale: 1, isInteractive: true };

          return (
            <button
              key={swatch.id}
              type="button"
              data-testid={`material-swatch-${String(index + 1).padStart(2, '0')}`}
              onClick={(e) => handleOpenSwatch(swatch, e.currentTarget)}
              disabled={!visualState.isInteractive}
              tabIndex={visualState.isInteractive ? 0 : -1}
              aria-label={`Inspect ${swatch.label}: ${swatch.textureHint}`}
              className="group relative flex flex-col items-center text-center focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-4"
              style={{
                opacity: visualState.opacity,
                transform: `translate3d(0, ${visualState.translateY}px, 0) scale(${visualState.scale})`,
                pointerEvents: visualState.isInteractive ? 'auto' : 'none',
              }}
            >
              <div
                className={`w-full flex items-center justify-center p-1 ${
                  isInteractiveProgress
                    ? 'h-[11vh] max-h-[106px]'
                    : 'h-28 sm:h-36 md:h-44 p-2'
                }`}
              >
                <PortfolioImage
                  asset={swatch.image}
                  className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-[1.06]"
                />
              </div>
              <span className="mt-1 font-mono text-[10px] tracking-[0.22em] text-[#B8B5B1]/75 group-hover:text-[#F5F3EF]">
                {String(index + 1).padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (useUnifiedScrollChamber) {
    // Unified Pinned Chamber: Swatches dismantle organically while About blooms dead-center behind them
    return (
      <>
        <section
          ref={stageRef}
          id="material-table"
          data-testid="section-material-table"
          className="relative w-full bg-black text-[#F5F3EF] min-h-[290vh]"
        >
          <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
            {/* Emerging About Layer in Exact Same Viewport */}
            <div
              className="absolute inset-0 z-10 flex items-center justify-center"
              style={{
                pointerEvents: aboutRevealState.textOpacity > 0.25 ? 'auto' : 'none',
              }}
            >
              <AboutSection
                revealState={aboutRevealState}
                embeddedInChamber={true}
              />
            </div>

            {/* Foreground 24-Swatch Specimen Board Dismantling Progressively */}
            <div
              className="relative z-20 w-full h-full"
              style={{
                pointerEvents: dismantleProgress > 0.8 ? 'none' : 'auto',
              }}
            >
              {renderSpecimenBoard(true)}
            </div>
          </div>
        </section>

        <MaterialModal
          swatch={selectedSwatch}
          onClose={handleCloseModal}
          triggerElement={triggerElRef.current}
        />
      </>
    );
  }

  return (
    <>
      <section
        ref={stageRef}
        id="material-table"
        data-testid="section-material-table"
        className={`relative w-full bg-black text-[#F5F3EF] ${
          continuousAboutTransition ? 'pt-20 pb-10' : 'pt-28 sm:pt-36 pb-28 sm:pb-36'
        }`}
      >
        {renderSpecimenBoard(false)}
      </section>

      {continuousAboutTransition && <AboutSection immediateReveal={true} />}

      <MaterialModal
        swatch={selectedSwatch}
        onClose={handleCloseModal}
        triggerElement={triggerElRef.current}
      />
    </>
  );
}
