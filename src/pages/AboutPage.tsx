import { AboutSection } from '../components/sections/AboutSection';

export function AboutPage() {
  return (
    <div className="relative z-10 w-full bg-transparent text-[#F5F3EF]">
      <h1 className="sr-only">About Aurelia Mahop Di Toro — MAH★P</h1>
      <AboutSection immediateReveal={true} />
    </div>
  );
}
