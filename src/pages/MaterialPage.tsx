import { MaterialTableSection } from '../components/sections/MaterialTableSection';

export function MaterialPage() {
  return (
    <div className="relative z-10 w-full bg-transparent text-[#F5F3EF]">
      <h1 className="sr-only">Material Table — 24 Mapped Swatches and About</h1>
      <MaterialTableSection showMovementTag={false} />
    </div>
  );
}
