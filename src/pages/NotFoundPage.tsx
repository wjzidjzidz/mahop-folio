import { Link } from '../router/RouterContext';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto py-24 space-y-6">
      <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#B8B5B1]">
        STAGE ERROR 404
      </span>
      <h1 className="text-5xl sm:text-7xl font-display uppercase tracking-tight text-[#F5F3EF]">
        PAGE NOT FOUND
      </h1>
      <p className="text-xs sm:text-sm font-mono text-[#B8B5B1] leading-relaxed">
        The requested address does not correspond to any of the seven principal MAH★P routes.
      </p>
      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#F5F3EF] text-xs font-mono uppercase tracking-widest text-[#F5F3EF] hover:bg-[#F5F3EF] hover:text-black transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Opening Stage</span>
        </Link>
      </div>
    </div>
  );
}
