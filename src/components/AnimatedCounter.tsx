import { useEffect, useRef, useState } from "react";

/** Animated counter that counts up from 0 to `end` */
const AnimatedCounter = ({ end, duration = 1200 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    if (end === 0) { setCount(0); return; }
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * end));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [end, duration]);

  return <>{count}</>;
};

export default AnimatedCounter;
