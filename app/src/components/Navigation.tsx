import { useEffect, useState } from 'react';

export const Navigation: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      // Show nav after scrolling past first section
      setVisible(scrollY > vh * 0.8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] px-[4vw] py-4 flex justify-between items-center transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
      style={{
        background: visible ? 'rgba(7, 10, 14, 0.9)' : 'transparent',
        backdropFilter: visible ? 'blur(12px)' : 'none',
        height: '60px',
      }}
    >
      <div className="font-mono-tech text-sm tracking-wider text-text-primary">
        contAInuum
      </div>
      
      <div className="flex gap-8">
        <button
          onClick={() => scrollToSection('mission')}
          className="font-mono-tech text-sm tracking-wider text-text-secondary hover:text-text-primary transition-colors"
        >
          Mission
        </button>
        <button
          onClick={() => scrollToSection('atlas')}
          className="font-mono-tech text-sm tracking-wider text-text-secondary hover:text-text-primary transition-colors"
        >
          ATLAS
        </button>
        <button
          onClick={() => scrollToSection('contact')}
          className="font-mono-tech text-sm tracking-wider text-text-secondary hover:text-text-primary transition-colors"
        >
          Contact
        </button>
      </div>
    </nav>
  );
}
