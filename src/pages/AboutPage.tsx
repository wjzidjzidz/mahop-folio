import { AboutSection } from '../components/sections/AboutSection';

export function AboutPage() {
  return (
    <div className="w-full bg-black text-[#F5F3EF]">
      <h1 className="sr-only">About Aurelia Mahop Di Toro — MAH★P</h1>
      <AboutSection immediateReveal={true} />
    </div>
  );
}
