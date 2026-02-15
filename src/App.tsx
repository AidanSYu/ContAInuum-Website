import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { GrainOverlay, VignetteOverlay, DustParticles } from '@/components/effects';
import { Navigation } from '@/components/Navigation';

import {
  HeroSection,
  ThesisSection,
  MissionSection,
  AtlasSection,
  CapabilitiesSection,
  FrontierSection,
  ContactSection,
} from '@/sections';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    ScrollTrigger.refresh();

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative bg-void">
      {/* Global overlays */}
      <GrainOverlay />
      <VignetteOverlay />
      <DustParticles />

      {/* Navigation */}
      <Navigation />

      {/* Main content — natural vertical scroll */}
      <main className="relative">
        <HeroSection />
        <ThesisSection />
        <MissionSection />
        <AtlasSection />
        <CapabilitiesSection />
        <FrontierSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
