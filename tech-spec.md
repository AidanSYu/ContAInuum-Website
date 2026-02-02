# contAInuum — Technical Specification

## 1. Component Inventory

### shadcn/ui Components
- **Button** — CTAs (outline + filled variants)
- **Input** — Contact form fields
- **Textarea** — Contact form message
- **Label** — Form labels

### Custom Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `GrainOverlay` | Global film grain texture overlay | `src/components/GrainOverlay.tsx` |
| `VignetteOverlay` | Global vignette effect | `src/components/VignetteOverlay.tsx` |
| `DustParticles` | Subtle particle animation (Section 1) | `src/components/DustParticles.tsx` |
| `SplitText` | Text reveal animation utility | `src/components/SplitText.tsx` |
| `Navigation` | Persistent top nav | `src/components/Navigation.tsx` |

### Section Components

| Section | Component | File |
|---------|-----------|------|
| 1 | `HeroSection` | `src/sections/HeroSection.tsx` |
| 2 | `ThesisSection` | `src/sections/ThesisSection.tsx` |
| 3 | `MissionSection` | `src/sections/MissionSection.tsx` |
| 4 | `AtlasSection` | `src/sections/AtlasSection.tsx` |
| 5 | `CapabilitiesSection` | `src/sections/CapabilitiesSection.tsx` |
| 6 | `FrontierSection` | `src/sections/FrontierSection.tsx` |
| 7 | `ContactSection` | `src/sections/ContactSection.tsx` |

---

## 2. Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Hero wordmark entrance (load) | GSAP | Timeline on mount, opacity + scale | Low |
| Hero wordmark exit (scroll) | GSAP ScrollTrigger | scrubbed fromTo, scale 1→1.35, opacity→0 | Medium |
| Dust particles drift | CSS/RAF | Slow random drift, low opacity | Low |
| Quote line reveals | GSAP ScrollTrigger + SplitText | scrubbed stagger, y + blur | High |
| Background image scale/parallax | GSAP ScrollTrigger | scrubbed fromTo scale + opacity | Medium |
| Split-screen slide-in | GSAP ScrollTrigger | x: -60vw/+60vw, scrubbed | Medium |
| Layer cards rise | GSAP ScrollTrigger | y: +60vh, rotateX, staggered | High |
| Orange rules scale | GSAP ScrollTrigger | scaleX 0→1, origin left | Low |
| Capability rows entrance | GSAP ScrollTrigger | x + opacity, flowing trigger | Medium |
| Frontier headline words | GSAP ScrollTrigger + SplitText | word stagger, y + opacity | High |
| Global scroll snap | GSAP ScrollTrigger | derived from pinned ranges | High |
| Grain overlay | CSS | static PNG, mix-blend-mode | Low |
| Vignette overlay | CSS | radial gradient | Low |

---

## 3. Animation Library Choices

### Primary: GSAP + ScrollTrigger
- All scroll-driven animations
- Pinned sections with scrub
- SplitText for typography reveals

### Secondary: CSS
- Grain/vignette overlays (static)
- Button hover states
- Subtle particle drift (optional RAF)

### Rationale
- GSAP provides precise scrub control and reverse-scroll correctness
- ScrollTrigger pin enables cinematic section transitions
- CSS for effects that don't need scroll linkage (performance)

---

## 4. Project File Structure

```
/mnt/okcomputer/output/app/
├── public/
│   ├── images/
│   │   ├── thesis-lone-figure.jpg
│   │   ├── mission-robotic-arm.jpg
│   │   ├── atlas-knowledge-graph.jpg
│   │   ├── frontier-industrial-space.jpg
│   │   └── contact-lab-closeup.jpg
│   └── grain.png
├── src/
│   ├── components/
│   │   ├── GrainOverlay.tsx
│   │   ├── VignetteOverlay.tsx
│   │   ├── DustParticles.tsx
│   │   ├── SplitText.tsx
│   │   └── Navigation.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ThesisSection.tsx
│   │   ├── MissionSection.tsx
│   │   ├── AtlasSection.tsx
│   │   ├── CapabilitiesSection.tsx
│   │   ├── FrontierSection.tsx
│   │   └── ContactSection.tsx
│   ├── hooks/
│   │   └── useScrollSnap.ts
│   ├── styles/
│   │   └── global.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 5. Dependencies

### Core (from init)
- react
- react-dom
- typescript
- vite
- tailwindcss
- @radix-ui/* (via shadcn)

### Animation
- gsap
- @gsap/react (optional, or use direct import)

### Fonts
- @fontsource/sora
- @fontsource/inter
- @fontsource/ibm-plex-mono

### Install Commands
```bash
npm install gsap @fontsource/sora @fontsource/inter @fontsource/ibm-plex-mono
```

---

## 6. Key Technical Decisions

### Scroll Snap Implementation
- Derive snap targets from `ScrollTrigger.getAll()` pinned triggers
- Use per-section `settleRatio` (0.50 default, 0.52 for ATLAS)
- Only snap when within pinned ranges (+/- 5% buffer)
- Flowing sections remain free-scroll

### Z-Index Stacking
- Sections stack by order: 10, 20, 30, 40, 50, 60
- Enables overlay transitions between pinned sections

### Reverse Scroll
- All animations use `fromTo()` with explicit start/end states
- ScrollTrigger scrub ensures bidirectional correctness

### Performance
- `will-change: transform, opacity` on animated elements
- Static grain/vignette (no animation)
- Reduced particle count on mobile
- Respect `prefers-reduced-motion`

---

## 7. Color Tokens (Tailwind Config)

```javascript
colors: {
  void: '#070A0E',
  'void-lifted': '#0E141C',
  accent: '#FF4D2E',
  'text-primary': '#F2F5F9',
  'text-secondary': '#9FB0C7',
}
```

---

## 8. Typography Scale

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Wordmark | Sora | clamp(72px, 10vw, 160px) | 800 |
| Section Headline | Sora | clamp(44px, 5.2vw, 84px) | 700 |
| Subhead | Sora | clamp(26px, 2.8vw, 40px) | 600 |
| Body | Inter | clamp(14px, 1.2vw, 18px) | 400 |
| Mono/Technical | IBM Plex Mono | 12-14px | 400 |
