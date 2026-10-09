import { useEffect, useRef, useState } from 'react';
import type { MaterialSwatch } from '../data/content';
import { PortfolioImage } from './PortfolioImage';
import { X, ZoomIn } from 'lucide-react';

interface MaterialModalProps {
  swatch: MaterialSwatch | null;
  onClose: () => void;
  triggerElement: HTMLElement | null;
}

export function MaterialModal({ swatch, onClose, triggerElement }: MaterialModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // M14: Open modal and manage focus
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (swatch) {
      setIsClosing(false);
      if (!dialog.open) {
        dialog.showModal();
      }
      // Focus close button after frame
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    } else {
      if (dialog.open) {
        dialog.close();
      }
      triggerElement?.focus();
    }
  }, [swatch, triggerElement]);

  // M15: Animated close transition before dialog shutdown
  const handleInitiateClose = () => {
    if (isClosing) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (dialogRef.current?.open) dialogRef.current.close();
      onClose();
      triggerElement?.focus();
      return;
    }

    setIsClosing(true);
    setTimeout(() => {
      if (dialogRef.current?.open) {
        dialogRef.current.close();
      }
      setIsClosing(false);
      onClose();
      triggerElement?.focus();
    }, 140);
  };

  // Handle native cancel (Escape key)
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    handleInitiateClose();
  };

  // Close when clicking dialog backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleInitiateClose();
    }
  };

  if (!swatch?.image) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 m-auto p-0 bg-transparent backdrop:bg-black/85 backdrop:backdrop-blur-sm w-[92vw] max-w-4xl h-[620px] max-h-[90dvh] overflow-hidden rounded-none border border-[#F5F3EF]/20 text-[#F5F3EF] ${
        isClosing ? 'animate-modal-close' : 'animate-modal-open'
      }`}
      aria-labelledby="material-modal-title"
      aria-describedby="material-modal-desc"
    >
      <div className="bg-[#0A0A0A] h-full p-6 sm:p-8 md:p-8 lg:p-10 flex flex-col justify-between overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#F5F3EF]/15 pb-4 shrink-0">
          <div>
            <span className="text-[10px] tracking-[0.25em] text-[#B8B5B1] uppercase block mb-1">
              Material Library · Inspection
            </span>
            <h2 id="material-modal-title" className="text-2xl sm:text-3xl font-display uppercase tracking-tight">
              {swatch.label} <span className="font-mono text-sm text-[#B8B5B1]">({swatch.id})</span>
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleInitiateClose}
            className="p-2 text-[#F5F3EF] hover:bg-[#F5F3EF]/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-2 rounded-sm"
            aria-label="Close enlarged material view"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body / Enlarged Visual */}
        <div className="flex-1 min-h-0 grid grid-cols-1 grid-rows-[auto_1fr] md:grid-rows-none md:grid-cols-12 gap-4 sm:gap-6 md:gap-8 md:items-center my-2 sm:my-3">
          <div className="md:col-span-7 h-48 sm:h-56 md:h-full md:self-stretch min-h-0 min-w-0 flex items-center justify-center">
            <div className="flex h-full w-full items-center justify-center bg-white/[0.015] p-3 sm:p-4 overflow-hidden">
              <PortfolioImage
                asset={swatch.image}
                className="max-h-full max-w-full w-auto h-auto object-contain"
                eager
              />
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-5 text-xs font-sans min-h-0 overflow-y-auto pr-1">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#B8B5B1]">Source reference</span>
              <p id="material-modal-desc" className="text-sm text-[#F5F3EF] font-mono leading-relaxed">
                {swatch.provisionalPage}
              </p>
              <p className="text-[10px] text-[#B8B5B1]/70 leading-normal">
                Provisional image mapping. No fibre content, material classification or publication permission is asserted.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-[#F5F3EF]/10">
              <span className="text-[10px] uppercase tracking-widest text-[#B8B5B1]">Archive status</span>
              <p className="font-mono text-xs text-[#F5F3EF]">Mapped candidate image · {swatch.id}</p>
            </div>

            <div className="pt-4 border-t border-[#F5F3EF]/15">
              <div className="flex items-center gap-2 text-[11px] text-[#B8B5B1]">
                <ZoomIn className="w-3.5 h-3.5 shrink-0" />
                <span>Original image: {swatch.image.width} × {swatch.image.height}px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#F5F3EF]/15 pt-4 flex items-center justify-between text-[11px] text-[#B8B5B1] shrink-0">
          <span>Press ESC or click outside to dismiss</span>
          <button
            type="button"
            onClick={handleInitiateClose}
            className="editorial-link px-4 py-1.5 border border-[#F5F3EF]/20 hover:border-[#F5F3EF] text-[#F5F3EF] transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
          >
            Close View
          </button>
        </div>
      </div>
    </dialog>
  );
}
