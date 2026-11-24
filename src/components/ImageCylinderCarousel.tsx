import { useEffect, useRef } from 'react';
import './ImageCylinderCarousel.css';

type CarouselCard = {
  title: string;
  image?: string;
  href?: string;
  fallbackColor: string;
};

const cards: CarouselCard[] = [
  { title: 'GACS', image: '/assets/corporate-partner-gacs.jpeg', fallbackColor: '#fff' },
  { title: 'Akshayakalpa Organic', image: '/assets/corporate-partner-akshayakalpa.jpeg', fallbackColor: '#fff' },
  { title: 'BriskInfosec', image: '/assets/corporate-partner-briskinfosec.jpeg', fallbackColor: '#fff' },
  { title: 'Elixir', image: '/assets/corporate-partner-elixir.jpeg', fallbackColor: '#fff' },
  { title: 'Gain Credit', image: '/assets/corporate-partner-gain-credit.jpeg', fallbackColor: '#fff' },
  { title: 'Populus Empowerment Network', image: '/assets/corporate-partner-pen.jpeg', fallbackColor: '#fff' },
  { title: 'Trackerwave', image: '/assets/corporate-partner-trackerwave.jpeg', fallbackColor: '#fff' },
  { title: 'Become a partner', href: 'mailto:hello@vamosrunclub.com?subject=Partnership%20enquiry', fallbackColor: '#d51e37' },
];

const CARD_COUNT = cards.length;
const STEP = 360 / CARD_COUNT;
const DEGREES_PER_SECOND = 360 / 36;

/** A draggable 3D partner-logo carousel using the site's local partner artwork. */
export default function ImageCylinderCarousel() {
  const rootRef = useRef<HTMLElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ down: false, lastX: 0, lastTime: 0, velocity: 0 });
  const hoverRef = useRef(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const cylinder = cylinderRef.current;
    if (!root || !cylinder) return;

    const cardElements = Array.from(cylinder.querySelectorAll<HTMLElement>('.image-carousel__card'));
    const measure = () => {
      const width = cardElements[0]?.getBoundingClientRect().width ?? 180;
      root.style.setProperty('--carousel-radius', `${width / (2 * Math.tan(Math.PI / CARD_COUNT))}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = motionQuery.matches;
    const onMotionChange = (event: MediaQueryListEvent) => { reducedMotionRef.current = event.matches; };
    motionQuery.addEventListener('change', onMotionChange);

    let previous = performance.now();
    const animate = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      const pointer = pointerRef.current;
      if (!pointer.down) {
        if (Math.abs(pointer.velocity) > 0.015) {
          rotationRef.current += pointer.velocity * dt;
          pointer.velocity *= Math.pow(0.06, dt);
        } else {
          pointer.velocity = 0;
          if (!hoverRef.current && !reducedMotionRef.current) rotationRef.current += DEGREES_PER_SECOND * dt;
        }
      }
      cylinder.style.transform = `rotateX(-5deg) rotateZ(1deg) rotateY(${rotationRef.current}deg)`;
      cardElements.forEach((card, index) => {
        const facing = Math.cos(((index * STEP + rotationRef.current) * Math.PI) / 180);
        card.style.opacity = String(0.24 + 0.76 * Math.max(0, facing));
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointerRef.current = { down: true, lastX: event.clientX, lastTime: performance.now(), velocity: 0 };
      root.setPointerCapture(event.pointerId);
      root.classList.add('is-dragging');
    };
    const onPointerMove = (event: PointerEvent) => {
      const pointer = pointerRef.current;
      if (!pointer.down) return;
      const now = performance.now();
      const dx = event.clientX - pointer.lastX;
      const elapsed = Math.max(now - pointer.lastTime, 1);
      rotationRef.current += dx * 0.45;
      pointer.velocity = (dx * 0.45) / elapsed * 1000;
      pointer.lastX = event.clientX;
      pointer.lastTime = now;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!pointerRef.current.down) return;
      pointerRef.current.down = false;
      if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
      root.classList.remove('is-dragging');
    };
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      rotationRef.current += event.deltaX * 0.22;
    };
    const onEnter = () => { hoverRef.current = true; };
    const onLeave = () => { hoverRef.current = false; };

    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerup', onPointerUp);
    root.addEventListener('pointercancel', onPointerUp);
    root.addEventListener('wheel', onWheel, { passive: false });
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      motionQuery.removeEventListener('change', onMotionChange);
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerup', onPointerUp);
      root.removeEventListener('pointercancel', onPointerUp);
      root.removeEventListener('wheel', onWheel);
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section ref={rootRef} className="image-carousel" aria-label="Corporate partner logo carousel">
      <div className="image-carousel__stage" aria-roledescription="carousel">
        <div ref={cylinderRef} className="image-carousel__cylinder">
          {cards.map((card, index) => {
            const style = {
              transform: `translate(-50%, -50%) rotateY(${index * STEP}deg) translateZ(var(--carousel-radius))`,
              backgroundColor: card.fallbackColor,
            };
            const content = card.image
              ? <><img src={card.image} alt={card.title} draggable={false} loading="lazy" /><span className="image-carousel__caption">{card.title}</span></>
              : <span className="image-carousel__partner-cta">{card.title}<small>Partnership enquiries ↗</small></span>;
            return card.href ? (
              <a className="image-carousel__card image-carousel__card--cta" key={card.title} aria-label={card.title} href={card.href} style={style}>{content}</a>
            ) : (
              <article className="image-carousel__card" key={card.title} aria-label={`${index + 1} of ${CARD_COUNT}: ${card.title}`} style={style}>{content}</article>
            );
          })}
        </div>
      </div>
      <p className="image-carousel__hint">Drag or scroll sideways to explore partners</p>
    </section>
  );
}
