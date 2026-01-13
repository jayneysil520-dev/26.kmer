import React, { useRef, useState } from 'react';
import { motion, useTransform, useMotionValue, useSpring, useScroll } from 'framer-motion';
import Spotlight3D from '../components/Spotlight3D';
import PatternPlaceholder from '../components/PatternPlaceholder';
import Magnetic from '../components/Magnetic';

// --- DATA ---
// 🟢 FIX: Using China-accessible CDN mirror (jsd.cdn.zzko.cn)
const heroCards = [
  { 
      id: 1, 
      color: '#FF7F27', 
      rotate: -12, 
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/1.png',
      scale: 1.15
  }, 
  { 
      id: 2, 
      color: '#00A2E8', 
      rotate: 8, 
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/2.png',
      scale: 1.05
  }, 
  { 
      id: 3, 
      color: '#55FFFF', 
      rotate: -15, 
      scale: 0.95,
      // Placeholder for 3rd card content - Replace with your image
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E7%8C%BF%E8%BE%85%E5%AF%BC%E5%B0%81%E9%9D%A2.png'
  }, 
  { 
      id: 4, 
      color: '#EA2F2F', 
      rotate: 10, 
      scale: 0.9,
      // 🟢 修复：将 GitHub Raw 链接替换为国内镜像链接
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E5%8D%AB%E5%B2%97%E5%B0%81%E9%9D%A2hero.jpg'
  }, 
  { id: 5, color: '#FFCCAA', rotate: 5, scale: 1.0 }, 
];

// --- DEPTH CONFIGURATION ---
const DEPTHS = {
    FLOOR: -300,
    PROPS: -290,
    CARDS: -50,
    TEXT: 10, 
};

// --- LAYOUT CONFIG ---
const layoutConfig = [
    { left: '15%', top: '45%', zIndex: 10 }, 
    { left: '65%', top: '50%', zIndex: 12 }, 
    { left: '25%', top: '65%', zIndex: 14 }, 
    { left: '80%', top: '40%', zIndex: 8 },  
    { left: '50%', top: '55%', zIndex: 15 }, 
];

const Hero: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasEntered, setHasEntered] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const floorY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
    
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 40, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 40, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const w = window.innerWidth;
        const h = window.innerHeight;
        x.set(clientX / w - 0.5);
        y.set(clientY / h - 0.5);
    };

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["35deg", "25deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
    const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-2%", "2%"]);

    return (
        <section 
            ref={containerRef}
            className="relative w-full bg-white overflow-hidden"
            onMouseMove={handleMouseMove}
            style={{ height: '140vh' }}
        >
             <motion.div 
                className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center will-change-transform"
                onViewportEnter={() => setHasEntered(true)}
             >
                <div className="absolute inset-0 flex items-center justify-center perspective-2000">
                    <motion.div
                        // OPTIMIZATION: Added transform-gpu to force hardware acceleration
                        className="relative w-full max-w-[1400px] will-change-transform transform-gpu"
                        style={{
                            rotateX,
                            rotateY,
                            x: translateX,
                            y: floorY,
                            aspectRatio: '16/9',
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {/* Floor */}
                        <div className="absolute inset-[-50%] bg-white transform-preserve-3d" style={{ transform: `translateZ(${DEPTHS.FLOOR}px)` }} />
                        
                        {/* 1. Main Title - Animation Updated: Slide up from y: 150 */}
                        <div className="absolute top-[15%] left-0 w-full text-center pointer-events-none" style={{ transform: `translateZ(${DEPTHS.TEXT}px) rotateX(-10deg)` }}>
                             <motion.div 
                                className="font-albert-black text-[6vw] md:text-[8vw] leading-none tracking-tighter mix-blend-multiply opacity-90 whitespace-nowrap flex flex-col justify-center items-center"
                                // MODIFIED: Changed y from 60 to 150 for a deeper slide-up effect
                                initial={{ opacity: 0, y: 150 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                // MODIFIED: Adjusted ease for a smoother "reveal" feel
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                viewport={{ once: true }}
                             >
                                <span className="text-black transform -skew-x-6">zhanG minGlei</span>
                            </motion.div>

                            <motion.div 
                                className="mt-4 flex flex-col items-center gap-2"
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <div className="font-albert-light text-2xl md:text-3xl text-gray-500 tracking-widest uppercase">Visual Designer</div>
                                <div className="w-12 h-[1px] bg-gray-300 my-1" />
                                <div className="font-albert-light text-xl md:text-2xl text-gray-400 tracking-widest uppercase">Illustrator & Animator</div>
                            </motion.div>
                        </div>

                        {/* 2. Scattered Cards */}
                        {heroCards.map((card, idx) => {
                            const layout = layoutConfig[idx];
                            const sizeClass = "w-[240px] md:w-[300px]";
                            
                            const initialX = idx % 2 === 0 ? -1500 : 1500;

                            return (
                                <motion.div
                                    key={card.id}
                                    className={`absolute cursor-pointer ${sizeClass} will-change-transform`}
                                    style={{
                                        top: layout.top,
                                        left: layout.left,
                                        aspectRatio: '1/1',
                                        zIndex: layout.zIndex,
                                        transformStyle: "preserve-3d",
                                        z: DEPTHS.CARDS,
                                    }}
                                    initial={{ opacity: 0, x: initialX, rotate: card.rotate * 2 }}
                                    animate={hasEntered ? { opacity: 1, x: 0, rotate: card.rotate } : {}}
                                    transition={{ duration: 0.6, delay: idx * 0.08, type: "spring", stiffness: 60, damping: 12 }}
                                    whileHover={{ 
                                        y: -40, 
                                        scale: card.scale * 1.05, 
                                        rotate: 0,
                                        transition: { duration: 0.3, ease: "easeOut" }
                                    }}
                                >
                                    <Magnetic strength={30}>
                                        <Spotlight3D 
                                            className="w-full h-full rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]" 
                                            color={card.color}
                                            enableElasticScale={false} 
                                            spotlightColor="rgba(255,255,255,0.5)"
                                        >
                                            <div className="w-full h-full relative p-3">
                                                <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-inner">
                                                    {card.img ? (
                                                        <div className="w-full h-full relative group">
                                                             <img 
                                                                src={card.img} 
                                                                alt={`Card ${card.id}`} 
                                                                className="w-full h-full object-cover"
                                                                decoding="async"
                                                             />
                                                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                                        </div>
                                                    ) : (
                                                        <PatternPlaceholder color={card.color} number={card.id} />
                                                    )}
                                                </div>
                                            </div>
                                        </Spotlight3D>
                                    </Magnetic>
                                </motion.div>
                            );
                        })}

                    </motion.div>
                </div>
             </motion.div>
        </section>
    );
};

export default Hero;