import { useEffect, useState } from 'react';

export const Navigation: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      setVisible(scrollY > vh * 0.5);
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
        background: visible ? 'rgba(7, 10, 14, 0.55)' : 'transparent',
        backdropFilter: visible ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: visible ? 'blur(12px)' : 'none',
        borderBottom: visible ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
        height: '60px',
      }}
    >
      <div className="font-mono-tech text-sm tracking-wider text-text-primary">
        contAInuum
      </div>
      
      <div className="flex gap-8">
        <button
          onClick={() => scrollToSection('mission')}
          className="font-mono-tech text-xs tracking-[0.15em] text-text-secondary hover:text-text-primary transition-colors"
        >
          Mission
        </button>
        <button
          onClick={() => scrollToSection('atlas')}
          className="font-mono-tech text-xs tracking-[0.15em] text-text-secondary hover:text-text-primary transition-colors"
        >
          ATLAS
        </button>
        <button
          onClick={() => scrollToSection('contact')}
          className="font-mono-tech text-xs tracking-[0.15em] text-text-secondary hover:text-text-primary transition-colors"
        >
          Contact
        </button>
      </div>
    </nav>
  );
}
