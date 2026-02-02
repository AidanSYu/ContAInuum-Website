import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { GrainOverlay, VignetteOverlay, DustParticles } from '@/components/effects';
import { Navigation } from '@/components/Navigation';
import { useScrollSnap } from '@/hooks/useScrollSnap';

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
  // Setup global scroll snap
  useScrollSnap();

  useEffect(() => {
    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    // Handle resize
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

      {/* Main content */}
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
