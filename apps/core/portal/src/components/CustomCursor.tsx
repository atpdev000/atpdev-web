"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, MotionValue } from "framer-motion";

// ==========================================
// HIGH-PERFORMANCE BUBBLES CANVAS
// ==========================================
function BubblesEffect({ cursorX, cursorY }: { cursorX: MotionValue<number>, cursorY: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize, { passive: true });
    
    // Read CSS token outside the animation loop to avoid per-frame forced style recalculations
    let primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#3b82f6';
    const onThemeMessage = (e: MessageEvent) => {
      if (e.data?.type === 'UPDATE_THEME_PREVIEW') {
        primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || primaryColor;
      }
    };
    window.addEventListener('message', onThemeMessage);

    const particles: { x: number, y: number, size: number, vx: number, vy: number, life: number, maxLife: number }[] = [];
    let animationId: number | null = null;
    let lastX = cursorX.get();
    let lastY = cursorY.get();

    const spawnIfMoved = () => {
      const currentX = cursorX.get();
      const currentY = cursorY.get();
      const dist = Math.hypot(currentX - lastX, currentY - lastY);
      if (dist > 5 && Math.random() > 0.3) {
        particles.push({
          x: currentX,
          y: currentY,
          size: Math.random() * 4 + 2,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          life: 1,
          maxLife: Math.random() * 30 + 30
        });
        lastX = currentX;
        lastY = currentY;
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      spawnIfMoved();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        
        const progress = p.life / p.maxLife;
        const opacity = Math.max(0, 1 - progress);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        ctx.fillStyle = primaryColor;
        ctx.globalAlpha = opacity;
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = opacity * 0.5;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }
      
      ctx.globalAlpha = 1;
      if (particles.length > 0) {
        animationId = requestAnimationFrame(render);
      } else {
        animationId = null;
      }
    };

    const unsubX = cursorX.on("change", () => {
      if (animationId === null) {
        animationId = requestAnimationFrame(render);
      }
    });
    
    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      unsubX();
      window.removeEventListener('resize', setSize);
      window.removeEventListener('message', onThemeMessage);
    };
  }, [cursorX, cursorY]);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9997]" />;
}

export default function CustomCursor({ glowStyle: initialGlowStyle }: { glowStyle?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [glowStyle, setGlowStyle] = useState(initialGlowStyle || '');

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "UPDATE_THEME_PREVIEW" && e.data.payload?.glowStyle !== undefined) {
        setGlowStyle(e.data.payload.glowStyle);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const style = glowStyle.includes('cursor-off') 
    ? 'off' 
    : glowStyle.includes('cursor-trail')
      ? 'trail'
      : glowStyle.includes('cursor-bubbles')
        ? 'bubbles'
        : glowStyle.includes('cursor-crosshair')
          ? 'crosshair'
          : glowStyle.includes('cursor-pulse')
            ? 'pulse'
            : glowStyle.includes('cursor-dot') 
              ? 'dot' 
              : 'ia';

  // Use motion values for raw coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Apply spring physics for smooth following
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 300, mass: 0.5 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 300, mass: 0.5 });

  // For trail effect
  const cursorXSpring2 = useSpring(cursorX, { damping: 20, stiffness: 200, mass: 0.8 });
  const cursorYSpring2 = useSpring(cursorY, { damping: 20, stiffness: 200, mass: 0.8 });
  const cursorXSpring3 = useSpring(cursorX, { damping: 15, stiffness: 100, mass: 1 });
  const cursorYSpring3 = useSpring(cursorY, { damping: 15, stiffness: 100, mass: 1 });

  useEffect(() => {
    // Skip custom cursor on touch/coarse-pointer devices or reduced motion preferences
    const isTouchOrReduced =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (style === 'off' || isTouchOrReduced) {
      document.body.style.cursor = 'auto';
      return;
    }

    setIsVisible(true);
    document.body.style.cursor = 'none'; // Hide default cursor globally on desktop

    const moveMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over clickable elements or specific classes
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive-card') ||
        target.closest('[role="button"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = 'auto'; // Restore default cursor on unmount
    };
  }, [cursorX, cursorY, style]);

  if (!isVisible || style === 'off') return null;

  return (
    <>
      {/* Small dot that strictly follows the mouse */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          backgroundColor: "var(--primary, #fff)",
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
      
      {/* Outer ring for IA style only */}
      {style === 'ia' && (
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white pointer-events-none z-[9998] mix-blend-difference flex items-center justify-center"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: "-50%",
            translateY: "-50%",
            borderColor: isHovering ? "var(--primary, #fff)" : "rgba(255,255,255,0.6)",
            boxShadow: isHovering ? "0 0 20px var(--primary, rgba(255,255,255,0.8))" : "0 0 10px rgba(255,255,255,0.3)",
          }}
          animate={{
            scale: isHovering ? 1.8 : 1,
            opacity: isHovering ? 0.8 : 0.4,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Optional inner glow when hovering */}
          <motion.div 
            className="w-full h-full rounded-full bg-white opacity-0"
            animate={{ opacity: isHovering ? 0.15 : 0 }}
          />
        </motion.div>
      )}
      
      {/* TRial Effect (Estela) */}
      {style === 'trail' && (
        <>
          <motion.div
            className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9998] mix-blend-difference opacity-60"
            style={{
              backgroundColor: "var(--primary, #fff)",
              x: cursorXSpring2,
              y: cursorYSpring2,
              translateX: "-50%",
              translateY: "-50%",
            }}
          />
          <motion.div
            className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9997] mix-blend-difference opacity-30"
            style={{
              backgroundColor: "var(--primary, #fff)",
              x: cursorXSpring3,
              y: cursorYSpring3,
              translateX: "-50%",
              translateY: "-50%",
            }}
          />
        </>
      )}

      {/* Bubbles Effect */}
      {style === 'bubbles' && <BubblesEffect cursorX={cursorX} cursorY={cursorY} />}

      {/* Crosshair Effect (Mira Láser) */}
      {style === 'crosshair' && (
        <>
          <motion.div
            className="fixed top-0 left-0 w-[100vw] h-[1px] pointer-events-none z-[9997] mix-blend-difference"
            style={{
              backgroundColor: "var(--primary, #fff)",
              y: cursorY,
              opacity: isHovering ? 0.8 : 0.3,
              boxShadow: "0 0 8px var(--primary, #fff)"
            }}
          />
          <motion.div
            className="fixed top-0 left-0 h-[100vh] w-[1px] pointer-events-none z-[9997] mix-blend-difference"
            style={{
              backgroundColor: "var(--primary, #fff)",
              x: cursorX,
              opacity: isHovering ? 0.8 : 0.3,
              boxShadow: "0 0 8px var(--primary, #fff)"
            }}
          />
        </>
      )}

      {/* Pulse Effect (Radar) */}
      {style === 'pulse' && (
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 pointer-events-none z-[9998] mix-blend-difference flex items-center justify-center"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: "-50%",
            translateY: "-50%",
            borderColor: "var(--primary, #fff)"
          }}
          animate={{
            scale: isHovering ? [1.5, 2.5] : [1, 2, 2.5],
            opacity: isHovering ? [0.8, 0] : [0.8, 0.3, 0],
          }}
          transition={{ 
            duration: isHovering ? 1 : 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      )}
    </>
  );
}
