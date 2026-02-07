import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

gsap.registerPlugin(ScrollTrigger);

export const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightImageRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const rightImage = rightImageRef.current;

    if (!section || !left || !rightImage) return;

    const ctx = gsap.context(() => {
      // Left content
      gsap.fromTo(
        left,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Right image parallax
      gsap.fromTo(
        rightImage,
        { y: -20 },
        {
          y: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    alert('Thank you for your message. We will respond within two business days.');
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-void z-[70] min-h-screen"
    >
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left column - Form */}
        <div
          ref={leftRef}
          className="w-full md:w-[44vw] py-8 md:py-[10vh] px-6 md:px-[4vw] flex flex-col justify-center will-change-transform"
        >
          <div className="font-mono-tech text-micro text-text-secondary tracking-[0.2em] mb-6">
            CONTACT
          </div>

          <h2
            className="font-display font-bold text-text-primary mb-4"
            style={{
              fontSize: 'clamp(32px, 4vw, 64px)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Contact
          </h2>

          <p className="text-body text-text-secondary mb-8">
            Tell us what you're building. We'll respond within two business days.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="font-mono-tech text-micro text-text-secondary tracking-wider mb-2 block">
                NAME
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-transparent border-text-secondary/30 text-text-primary focus:border-safety"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="font-mono-tech text-micro text-text-secondary tracking-wider mb-2 block">
                EMAIL
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-transparent border-text-secondary/30 text-text-primary focus:border-safety"
                required
              />
            </div>

            <div>
              <Label htmlFor="organization" className="font-mono-tech text-micro text-text-secondary tracking-wider mb-2 block">
                ORGANIZATION
              </Label>
              <Input
                id="organization"
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="bg-transparent border-text-secondary/30 text-text-primary focus:border-safety"
              />
            </div>

            <div>
              <Label htmlFor="message" className="font-mono-tech text-micro text-text-secondary tracking-wider mb-2 block">
                MESSAGE
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-transparent border-text-secondary/30 text-text-primary focus:border-safety min-h-[120px]"
                required
              />
            </div>

            <button type="submit" className="btn-filled w-full">
              Send message
            </button>
          </form>
        </div>

        {/* Right column - Image */}
        <div
          ref={rightImageRef}
          className="w-full md:w-[56vw] h-[40vh] md:h-auto relative will-change-transform"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/images/contact-lab-closeup.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Contact details overlay */}
          <div className="absolute bottom-[4vh] md:bottom-[6vh] left-6 md:left-[4vw] right-6 md:right-[4vw]">
            <div 
              className="font-mono-tech text-micro text-text-primary tracking-wider space-y-1 md:space-y-2 p-4 rounded-md"
              style={{
                backgroundColor: 'rgba(7, 10, 14, 0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(159, 176, 199, 0.2)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div>hello@containuum.io</div>
              <div>Shanghai / San Francisco / Salt Lake City / Boston</div>
              <div>Partnerships & press: press@containuum.io</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative md:absolute bottom-0 left-0 right-0 py-4 px-6 md:px-[4vw] border-t border-text-secondary/15 bg-void">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="font-mono-tech text-micro text-text-secondary tracking-wider">
            contAInuum
          </div>
          <div className="font-mono-tech text-micro text-text-secondary/60 tracking-wider">
            © 2026 contAInuum. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  );
};
