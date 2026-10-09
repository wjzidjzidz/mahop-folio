import { useState, useRef } from 'react';
import { MATERIAL_SWATCHES, MaterialSwatch } from '../data/content';
import { StructuralPlaceholder } from '../components/StructuralPlaceholder';
import { MaterialModal } from '../components/MaterialModal';
import { ZoomIn, Info } from 'lucide-react';

export function MaterialPage() {
  const [selectedSwatch, setSelectedSwatch] = useState<MaterialSwatch | null>(null);
  const [filter, setFilter] = useState<'all' | 'review'>('all');
  const triggerRef = useRef<HTMLElement | null>(null);

  const filteredSwatches = MATERIAL_SWATCHES.filter((swatch) => {
    if (filter === 'review') return swatch.classification === 'candidate_review';
    return true;
  });

  const handleOpenSwatch = (swatch: MaterialSwatch, event: React.MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = event.currentTarget;
    setSelectedSwatch(swatch);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
      {/* Page Header */}
      <header className="border-b border-[#F5F3EF]/15 pb-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-rule-draw">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8B5B1] block mb-2">
            TEXTILE ARCHITECTURE · OBJECT REPERTORY
          </span>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display uppercase tracking-tight text-[#F5F3EF]">
            MATERIAL
          </h1>
        </div>

        <div className="max-w-md space-y-3 text-xs text-[#B8B5B1] font-mono leading-relaxed">
          <p>
            An archive of 27 provisional textile-swatch objects. All records maintained pending physical source inspection and deduplication.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#F5F3EF]">
            <Info className="w-3.5 h-3.5 shrink-0 text-[#B8B5B1]" />
            <span>Not a product catalogue. Preserving 27 candidate objects pending source verification.</span>
          </div>
        </div>
      </header>

      {/* Filter Tabs & Inventory State */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F3EF]/15 pb-6 mb-12 animate-rule-draw">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`editorial-link px-3 py-1.5 text-xs font-mono tracking-wider transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#F5F3EF] ${
              filter === 'all'
                ? 'bg-[#F5F3EF] text-black font-medium'
                : 'border border-[#F5F3EF]/20 text-[#B8B5B1] hover:text-[#F5F3EF]'
            }`}
          >
            All Provisional Swatches (27)
          </button>
          <button
            type="button"
            onClick={() => setFilter('review')}
            className={`editorial-link px-3 py-1.5 text-xs font-mono tracking-wider transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#F5F3EF] ${
              filter === 'review'
                ? 'bg-[#F5F3EF] text-black font-medium'
                : 'border border-[#F5F3EF]/20 text-[#B8B5B1] hover:text-[#F5F3EF]'
            }`}
          >
            Candidate Review (27)
          </button>
        </div>

        <span className="text-[11px] font-mono text-[#B8B5B1]">
          Candidate Source Pages: 2, 5, 9, 11, 13, 15, 16, 18
        </span>
      </div>

      {/* 27 Swatch Textile-Object Grid with M13 Tactile Feedback */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {filteredSwatches.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            onClick={(e) => handleOpenSwatch(swatch, e)}
            className="group block text-left bg-white/[0.02] border border-[#F5F3EF]/15 hover:border-[#F5F3EF]/50 hover:scale-[1.02] focus-visible:scale-[1.02] p-3 sm:p-4 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-2 rounded-sm"
            aria-label={`View ${swatch.label} (${swatch.id}) larger`}
          >
            {/* Visual Swatch Slot */}
            <div className="relative overflow-hidden mb-3">
              <StructuralPlaceholder
                id={swatch.id}
                title={swatch.label}
                sourceRef={swatch.provisionalPage}
                aspectRatio={swatch.aspectRatio}
                variant="swatch"
                showStatusBadge={false}
                className="transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus:opacity-100 flex items-center justify-center transition-opacity duration-200">
                <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest bg-black text-[#F5F3EF] border border-[#F5F3EF]/40 flex items-center gap-1.5">
                  <ZoomIn className="w-3 h-3" />
                  <span>Inspect</span>
                </span>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5F3EF] font-medium">{swatch.label}</span>
                <span className="text-[#B8B5B1] text-[10px]">{swatch.id}</span>
              </div>
              <p className="text-[11px] text-[#B8B5B1] line-clamp-1 font-sans">
                {swatch.textureHint}
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#B8B5B1]/70">
                <span>Mapping pending verification</span>
                <span className="text-amber-400/80">[Candidate]</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Accessible Detail Modal */}
      <MaterialModal
        swatch={selectedSwatch}
        onClose={() => setSelectedSwatch(null)}
        triggerElement={triggerRef.current}
      />
    </div>
  );
}
