import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const yOffset = direction === 'up' ? 80 : direction === 'down' ? -80 : 0;
    const xOffset = direction === 'left' ? 80 : direction === 'right' ? -80 : 0;

    gsap.set(el, { y: yOffset, x: xOffset, opacity: 0 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(el, {
            y: 0,
            x: 0,
            opacity: 1,
            duration: 1.2,
            delay,
            ease: 'power3.out',
          });
        },
      });
    });

    return () => ctx.revert();
  }, [delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
