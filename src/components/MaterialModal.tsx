import { useEffect, useRef, useState } from 'react';
import type { MaterialSwatch } from '../data/content';
import { PortfolioImage } from './PortfolioImage';
import { X } from 'lucide-react';

interface MaterialModalProps {
  swatch: MaterialSwatch | null;
  onClose: () => void;
  triggerElement: HTMLElement | null;
}

export function MaterialModal({ swatch, onClose, triggerElement }: MaterialModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (swatch) {
      setIsClosing(false);
      if (!dialog.open) {
        dialog.showModal();
      }
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus({ preventScroll: true });
      });
    } else {
      if (dialog.open) {
        dialog.close();
      }
      triggerElement?.focus({ preventScroll: true });
    }
  }, [swatch, triggerElement]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !swatch) return;

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener('keydown', handleTabTrap);
    return () => dialog.removeEventListener('keydown', handleTabTrap);
  }, [swatch]);

  const handleInitiateClose = () => {
    if (isClosing) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (dialogRef.current?.open) dialogRef.current.close();
      onClose();
      triggerElement?.focus({ preventScroll: true });
      return;
    }

    setIsClosing(true);
    setTimeout(() => {
      if (dialogRef.current?.open) {
        dialogRef.current.close();
      }
      setIsClosing(false);
      onClose();
      triggerElement?.focus({ preventScroll: true });
    }, 140);
  };

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    handleInitiateClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleInitiateClose();
    }
  };

  if (!swatch?.image) return null;

  const displayLabel = swatch.label.toUpperCase();

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 m-auto p-0 bg-transparent backdrop:bg-black/92 w-[94vw] max-w-5xl h-[640px] max-h-[90dvh] overflow-hidden border-0 text-[#F5F3EF] ${
        isClosing ? 'animate-modal-close' : 'animate-modal-open'
      }`}
      aria-labelledby="material-modal-title"
      aria-describedby="material-modal-desc"
    >
      <div className="bg-[#060606] h-full p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
        <div className="flex items-start justify-between shrink-0">
          <div>
            <span className="text-[10px] font-mono tracking-[0.28em] text-[#B8B5B1] uppercase block mb-1">
              Material Specimen · Close Inspection
            </span>
            <h2 id="material-modal-title" className="text-3xl sm:text-4xl font-display uppercase tracking-tight">
              {displayLabel}{' '}
              <span className="font-mono text-xs text-[#B8B5B1] align-middle ml-2">{swatch.id}</span>
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleInitiateClose}
            className="p-2 text-[#F5F3EF]/80 hover:text-[#F5F3EF] transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-2"
            aria-label="Close enlarged material view"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 grid-rows-[auto_1fr] md:grid-rows-none md:grid-cols-12 gap-6 md:gap-10 md:items-center my-4">
          <div className="md:col-span-7 h-56 sm:h-68 md:h-full md:self-stretch min-h-0 min-w-0 flex items-center justify-center">
            <PortfolioImage
              asset={swatch.image}
              className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.9)]"
              eager
            />
          </div>

          <div className="md:col-span-5 flex flex-col justify-center space-y-5 min-h-0 overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#B8B5B1]">
                Source Mapping
              </span>
              <p id="material-modal-desc" className="font-serif italic text-xl sm:text-2xl text-[#F5F3EF] leading-snug">
                {swatch.provisionalPage}
              </p>
              <p className="text-xs text-[#B8B5B1]/85 font-sans leading-relaxed pt-1">
                {swatch.textureHint}. Visual record preserved from original portfolio plate without inferred fibre composition.
              </p>
            </div>

            <div className="space-y-1 pt-2 font-mono text-[11px] text-[#B8B5B1]">
              <p>Archive identifier: {displayLabel} · {swatch.id}</p>
              <p>Native source plate: {swatch.image.width} × {swatch.image.height}px</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#B8B5B1] shrink-0">
          <span>ESC or click outside to return</span>
          <button
            type="button"
            onClick={handleInitiateClose}
            className="editorial-link text-xs uppercase tracking-[0.22em] text-[#F5F3EF] focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-4"
          >
            Close View
          </button>
        </div>
      </div>
    </dialog>
  );
}
