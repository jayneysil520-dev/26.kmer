import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring, useScroll, useMotionTemplate, Variants } from 'framer-motion';
import { createPortal } from 'react-dom'; 
import Spotlight3D from '../components/Spotlight3D';

// --- CONFIGURATION ---

// 🔥 IMPORTANT: Update your long image URL here!
// 这是一个防止回退的常量。请在这里填入你最新的长图链接。
// Adding ?v=2 to bust cache if you replaced the file on GitHub.
const PROJECT_1_LONG_IMAGE = 'https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/%E6%89%80%E6%9C%89IP%E7%9A%84%E4%BD%8D%E7%BD%AE1-11.png';
const PROJECT_1_LONG_IMAGE_2 = 'https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/%E6%89%80%E6%9C%89IP%E7%9A%84%E4%BD%8D%E7%BD%AE1-11.png';

// 🟢 👇 PROJECT 2 CONFIGURATION
// 🟢 请在这里填入你第二个项目的长图链接
const PROJECT_2_LONG_IMAGE = 'https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/%E5%BE%97%E5%8A%9B%E8%9B%8B%E4%BB%94%E9%95%BF%E5%9B%BE1-11.png';


// --- ICONS DATA ---
const TOOL_ICONS: Record<string, string> = {
    'Figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
    'PS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg',
    'AI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg',
    'AE': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg',
    'Blender': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg',
    'C4D': 'https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/1197px-C4D_Logo.png',
    'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'ThreeJS': 'https://global.discourse-cdn.com/standard17/uploads/threejs/original/2X/e/e4f86d2200d2d35c30f7b1494e96b9595ebc2751.png',
    'Jimeng': 'https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/%E5%8D%B3%E6%A2%A6icon.png',
    'Pinterest': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pinterest/pinterest-original.svg',
    'LibLib': 'https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/LibLib.png'
};

// --- PROJECT DATA ---
const projects = [
  { 
      id: 1, 
      title: '得力欧美市场IP形象设计', 
      label: 'IP IMAGE DESIGN', 
      year: '2025', 
      client: 'DELI', 
      color: '#FF7F27', 
      img: 'https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/1-1.png', 
      desc: 'Creating a magical land named "Heart Language Forest" for Deli\'s European and American markets.',
      tools: ['Jimeng', 'PS', 'Figma', 'Blender'],
      layout: 'gallery', 
      detailImages: [
          PROJECT_1_LONG_IMAGE, 
          PROJECT_1_LONG_IMAGE_2
      ]
  },
  { 
      id: 2, 
      title: '蛋仔派对·得力创作大赛视觉设计', 
      label: 'VISUAL DESIGN', 
      year: '2025', 
      color: '#FFA500', 
      img: 'https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/2-1.png', 
      desc: 'An immersive digital coastline experience bringing the ocean breeze.',
      tools: ['Figma', 'Jimeng', 'PS', 'Blender'],
      layout: 'gallery',
      detailImages: [
          PROJECT_2_LONG_IMAGE 
      ]
  },
  { 
      id: 3, title: '猿辅导运营设计', label: 'VISUAL DESIGN', year: '2022', color: '#4DA6FF', 
      shadowColor: '#4DA6FF',
      img: 'https://cdn.jsdelivr.net/gh/jayneysil520-dev/jayneysil@main/%E7%8C%BF%E8%BE%85%E5%AF%BC%E5%B0%81%E9%9D%A2.png', 
      desc: 'Cyberpunk aesthetic visual identity system for a futuristic fashion label.',
      tools: ['PS', 'AI', 'C4D']
  },
  { 
      id: 4, title: '卫岗形象设计之LoRA炼制', label: 'LOGO / IP DESIGN', year: '2022', color: '#EA2F2F', 
      img: 'https://raw.githubusercontent.com/jayneysil520-dev/jayneysil/refs/heads/main/%E5%8D%AB%E5%B2%97%E5%B0%81%E9%9D%A2hero.jpg', 
      desc: 'Rhythm of city life captured in a rhythmic event discovery application.',
      tools: ['Figma', 'LibLib', 'PS']
  },
  { 
      id: 5, title: 'Nature Sync', label: 'IOT INTERFACE', year: '2021', color: '#66DD88', 
      img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop', 
      desc: 'Smart home interface connecting organic patterns with digital control.',
      tools: ['Figma', 'C4D']
  },
  { 
      id: 6, title: 'Abstract Void', label: 'MOTION ART', year: '2021', color: '#AA88EE', 
      img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', 
      desc: 'Experimental motion graphics exploring the concept of digital minimalism.',
      tools: ['C4D', 'AE', 'PS']
  },
  { 
      id: 7, title: 'Glass Horizons', label: 'WEB AWARDS', year: '2020', color: '#4ECDC4', 
      img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop', 
      desc: 'Portfolio site featuring heavy use of glassmorphism and depth effects.',
      tools: ['React', 'Figma']
  },
  { 
      id: 8, title: 'Silent Echo', label: 'AUDIO VIZ', year: '2020', color: '#FF0055', 
      img: 'https://images.unsplash.com/photo-1515405295579-ba7f45403022?q=80&w=1000&auto=format&fit=crop', 
      desc: 'Visualizing sound waves in real-time using WebAudio API and Canvas.',
      tools: ['ThreeJS', 'Blender']
  }
];

// --- DEPTH CONFIGURATION ---
const DEPTHS = {
    FLOOR: -300,
    PROJECTS: -50,
};

// --- COMPONENTS ---

const FloorMarquee: React.FC<{ direction: 'left' | 'right', text: string, className?: string, rotate?: number, style?: React.CSSProperties }> = React.memo(({ direction, text, className, rotate = 0, style }) => {
    return (
        <div 
            className="absolute left-[-20%] w-[140%] pointer-events-auto overflow-visible flex group"
            style={{ 
                transform: `translateZ(${DEPTHS.PROJECTS - 40}px) rotate(${rotate}deg)`, 
                zIndex: 0,
                ...style,
            }}
        >
            <motion.div
                className={`flex whitespace-nowrap ${className}`}
                initial={{ x: direction === 'left' ? '0%' : '-50%' }}
                animate={{ x: direction === 'left' ? '-50%' : '0%' }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            >
                {[...Array(6)].map((_, i) => (
                    <span key={i} className="mx-4 transition-colors duration-300">
                        {text} <span className="mx-4 opacity-30">•</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
});

// 1. LEFT SIDE: SQUARE IMAGE CARD
const ProjectImageSquare: React.FC<{ 
    project: any, 
    style: any, 
    onClick: () => void, 
    onHoverStart: () => void, 
    onHoverEnd: () => void, 
    isHovered: boolean, 
    isAnyHovered: boolean,
    isSelected: boolean 
}> = React.memo(({ project, style, onClick, onHoverStart, onHoverEnd, isHovered, isAnyHovered, isSelected }) => {
    
    // Scale Logic
    const targetScale = isHovered ? 1.15 : (isAnyHovered ? 0.9 : 1);
    
    // Opacity Logic
    const targetOpacity = isHovered ? 1 : (isAnyHovered ? 0.7 : 1);
    
    const targetRotate = isHovered ? 0 : (style.rotate as number || 0);
    const targetY = isHovered ? -40 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: -300, rotate: Math.random() * 20 - 10 }}
            whileInView={{ opacity: 1, x: 0, rotate: style.rotate as number || 0 }}
            animate={{ 
                scale: targetScale, 
                opacity: targetOpacity,
                rotate: targetRotate,
                y: targetY
            }}
            transition={{ type: "spring", stiffness: 50, damping: 14, mass: 1 }}
            
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            onClick={onClick}
            
            className="absolute cursor-pointer w-[380px] h-[380px] perspective-1000 group will-change-transform"
            style={{ ...style, transformStyle: "preserve-3d" }}
        >
             <div 
                className="absolute inset-0 rounded-[2.5rem] bg-white/20 border border-white/20 pointer-events-none"
                style={{ 
                    transform: 'translateZ(-10px)',
                    boxShadow: '30px 30px 60px rgba(0,0,0,0.15)' 
                }}
            />

            <Spotlight3D 
                className="w-full h-full rounded-[2.5rem] bg-white/20 backdrop-blur-md border border-white/40 shadow-sm" 
                color={project.shadowColor || project.color}
                disableTilt={false}
                spotlightColor="transparent" 
            >
                <div className="w-full h-full p-4 relative">
                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-gray-100 relative shadow-inner group">
                        <motion.img 
                            src={project.img} 
                            alt={project.title} 
                            className={`w-full h-full object-cover transform transition-all duration-500 ease-out group-hover:scale-105 filter grayscale contrast-75 opacity-80 group-hover:grayscale-0 group-hover:contrast-100 group-hover:opacity-100`}
                            decoding="async" 
                            loading="lazy"
                        />
                    </div>
                </div>
            </Spotlight3D>
        </motion.div>
    );
});

// 2. RIGHT SIDE: INFO PREVIEW CARD
const RightPreviewCard: React.FC<{ 
    project: any, 
    handleProjectEnter: () => void, 
    handleProjectLeave: () => void, 
    setSelectedProject: (p: any) => void
}> = React.memo(({ project, handleProjectEnter, handleProjectLeave, setSelectedProject }) => {
    
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
        if (!cardRef.current) return;
        const { left, top } = cardRef.current.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const randomConfig = useMemo(() => {
        const seed = project.id;
        return {
            y: ((seed * 37) % 240) - 120,
            x: 600 + (seed * 17) % 300,
            initialRotateZ: ((seed * 13) % 60) - 30,
            targetRotateZ: ((seed * 7) % 10) - 5, 
            rotateY: -30 + ((seed * 7) % 15), 
            rotateX: ((seed * 23) % 40) - 20, 
        };
    }, [project.id]);

    const variants: Variants = {
        initial: { 
            x: randomConfig.x, 
            y: randomConfig.y, 
            rotateY: randomConfig.rotateY, 
            rotateZ: randomConfig.initialRotateZ, 
            rotateX: randomConfig.rotateX,
            opacity: 0, 
            scale: 0.85 
        },
        animate: { 
            x: 0, 
            y: 0, 
            rotateY: 0, 
            rotateZ: randomConfig.targetRotateZ, 
            rotateX: 0,
            opacity: 1, 
            scale: 1,
            transition: { 
                type: "spring", 
                stiffness: 120, 
                damping: 18, 
                mass: 1.2 
            }
        },
        exit: { 
            scale: 0.95, 
            opacity: 0, 
            x: 150,
            rotateY: 10,
            filter: "blur(10px)",
            transition: { duration: 0.25, ease: "easeIn" } 
        }
    };

    return (
        <motion.div
            ref={cardRef}
            key={project.id}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleProjectEnter}
            onMouseLeave={handleProjectLeave}
            onClick={() => setSelectedProject(project)}
            className="absolute cursor-pointer will-change-transform"
            style={{
                top: '25%',
                right: '1%', 
                width: '750px', 
                height: '280px', 
                zIndex: 50,
                transformStyle: "preserve-3d",
                transform: `translateZ(${DEPTHS.PROJECTS + 150}px)` 
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
        >
            <div className="w-full h-full rounded-[2.5rem] relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-shadow duration-300">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[20px] rounded-[2.5rem]" />
                <motion.div
                    className="absolute -inset-[1px] rounded-[2.5rem] z-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none blur-2xl"
                    style={{
                        background: project.color,
                        maskImage: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                        WebkitMaskImage: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    }}
                />
                <div className="absolute inset-0 rounded-[2.5rem] border border-white/50 pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60 pointer-events-none rounded-[2.5rem]" />

                <div className="absolute top-8 right-8 z-20">
                    <span className="px-4 py-1.5 rounded-full bg-white/40 border border-white/50 text-xs font-bold font-mono text-gray-600 tracking-widest shadow-sm backdrop-blur-md">
                        {project.year}
                    </span>
                </div>

                <div className="relative z-10 flex flex-col h-full justify-center p-10">
                    <div className="flex items-center gap-4 mb-4 group-hover:translate-x-2 transition-transform duration-500">
                        <h2 className="text-5xl font-albert-black text-black tracking-tight drop-shadow-sm">
                            {project.title}
                        </h2>
                        <div className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-black">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-2.5 h-2.5 rounded-full ring-2 ring-white/50 group-hover:scale-125 transition-transform duration-300 shadow-sm" style={{ backgroundColor: project.color }} />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                            {project.label}
                        </span>
                    </div>
                    <p className="text-lg text-gray-600 font-albert-regular leading-relaxed max-w-xl">
                        {project.desc}
                    </p>
                </div>
            </div>

            {project.tools?.map((tool: string, i: number) => (
                <motion.div
                    key={tool}
                    className="absolute w-[98px] h-[98px] rounded-2xl bg-white/40 backdrop-blur-lg border border-white/50 shadow-lg flex items-center justify-center p-4 overflow-hidden pointer-events-none will-change-transform"
                    style={{
                        top: `${80 + (i % 2) * 20}%`, 
                        right: `${10 + (i * 15)}%`, 
                        zIndex: 40 
                    }}
                    initial={{ scale: 0, y: 30, rotate: 10 }}
                    animate={{ scale: 1, y: 0, rotate: Math.random() * 20 - 10 }}
                    transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 180, damping: 15 }}
                >
                    <img src={TOOL_ICONS[tool] || ''} alt={tool} className="w-full h-full object-contain relative z-10 opacity-90" decoding="async" />
                </motion.div>
            ))}

        </motion.div>
    );
});

// --- NEW COMPONENT: Gallery Modal View with Scroll/Mouse Tracker ---
const GalleryModalView: React.FC<{ images: string[], projectId?: number }> = ({ images, projectId }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollVal, setScrollVal] = useState(0);
    const [mouseVal, setMouseVal] = useState(0);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            setScrollVal(Math.round(scrollContainerRef.current.scrollTop));
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        setMouseVal(Math.round(e.clientX));
    };

    // 🟢 UTILITIES FOR PERCENTAGE POSITIONING
    // Based on your Figma/Design design dimensions
    const DESIGN_WIDTH = 1920;
    
    // 🔥 CRITICAL FIX: The Modal uses w-[95vw], so the content is 95vw wide.
    const MODAL_WIDTH_VW = 95; 

    // Helper: Converts Design X,Y to Percentage Top/Left
    // Usage: style={getPos(200, 2675)}
    // 
    // Logic:
    // Left: Simply percentage of container width. (x / 1920) * 100%
    // Top:  Since the image maintains aspect ratio based on WIDTH, 
    //       the vertical distance corresponds to the WIDTH scaling.
    //       Formula: (y / DESIGN_WIDTH) * (ACTUAL_WIDTH_IN_VW) + 'vw'
    //       This makes the Y position responsive to the Width, just like the image height is!
    const getPos = (x: number, y: number) => ({
        left: `${(x / DESIGN_WIDTH) * 100}%`,
        top: `${(y / DESIGN_WIDTH) * MODAL_WIDTH_VW}vw` 
    });

    // Helper: Converts Design FontSize to VW (responsive text)
    // Usage: fontSize: getSize(240)
    const getSize = (size: number) => `${(size / DESIGN_WIDTH) * MODAL_WIDTH_VW}vw`;

    return (
        <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseMove={handleMouseMove}
            className="w-full h-full overflow-y-auto overflow-x-hidden floating-scrollbar relative z-10 p-0 bg-black"
        >
            {/* Real-time Indicator: Scroll Y & Mouse X */}
            <div className="fixed top-24 right-10 z-[70] font-mono text-[10px] text-green-400 bg-black/80 backdrop-blur-md px-3 py-2 rounded border border-green-500/30 pointer-events-none tracking-widest flex flex-col gap-1 shadow-lg">
                <span className="flex justify-between gap-4"><span>SCROLL Y:</span> <span>{scrollVal}</span></span>
                <span className="flex justify-between gap-4"><span>MOUSE X:</span> <span>{mouseVal}</span></span>
            </div>

            {/* 
                🔥 WRAPPER CONTAINER
                We set a relative container that wraps both the images and the overlays.
                The images define the height of this container naturally.
                The overlays use absolute positioning relative to THIS container.
            */}
            <div className="relative w-full">
                
                {/* 1. THE LONG IMAGES STACK */}
                <div className="flex flex-col w-full">
                    {images.map((imgUrl, index) => (
                        <div key={index} className="w-full bg-black">
                            <img 
                                src={imgUrl} 
                                className="w-full h-auto block" 
                                loading="lazy" 
                                decoding="async" 
                                alt={`Project Detail ${index + 1}`} 
                            />
                        </div>
                    ))}
                </div>

                {/* 2. THE OVERLAY LAYER (Absolute on top of images) */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    
                    {/* --- PROJECT 1 OVERLAYS (Percentage Based) --- */}
                    {projectId === 1 && (
                        <>
                            {/* --- 1. FEHN SECTION --- */}
                            <motion.div
                                // 🟢 Using percentage positioning relative to total height
                                style={{ position: 'absolute', ...getPos(200, 2675), zIndex: 50 }}
                                initial={{ x: -100, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }} 
                                viewport={{ once: true }}
                            >
                                <span style={{ fontFamily: "'Franklin Gothic Medium Cond', sans-serif", fontSize: getSize(240), lineHeight: '1', color: 'white', fontWeight: 'normal' }} className="block drop-shadow-2xl">
                                    Fehn
                                </span>
                            </motion.div>
                            <motion.div
                                style={{ position: 'absolute', ...getPos(213, 2900), zIndex: 50 }}
                                initial={{ x: -50, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }} 
                                viewport={{ once: true }}
                            >
                                 <span style={{ fontFamily: "'OPPOSans H', sans-serif", fontSize: getSize(14), color: 'white', fontWeight: '900', letterSpacing: '1px' }} className="block drop-shadow-lg">
                                    创意工程师    CREATIVE ENGINEER
                                </span>
                            </motion.div>
                             <motion.div
                                style={{ position: 'absolute', ...getPos(1450, 2820), zIndex: 50 }}
                                initial={{ x: 100, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }} 
                                viewport={{ once: true }}
                            >
                                 <span style={{ fontFamily: "'Arizonia', cursive", fontSize: getSize(80), color: 'white' }} className="block drop-shadow-lg">
                                    Fehn
                                </span>
                            </motion.div>

                            {/* --- 2. RABBI SECTION --- */}
                            <motion.div
                                style={{ position: 'absolute', ...getPos(200, 4695), zIndex: 50 }}
                                initial={{ x: -100, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }} 
                                viewport={{ once: true }}
                            >
                                <span style={{ fontFamily: "'Franklin Gothic Medium Cond', sans-serif", fontSize: getSize(240), lineHeight: '1', color: 'white', fontWeight: 'normal' }} className="block drop-shadow-2xl">
                                    Rabbi
                                </span>
                            </motion.div>
                            <motion.div
                                style={{ position: 'absolute', ...getPos(213, 4908), zIndex: 50 }}
                                initial={{ x: -50, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }} 
                                viewport={{ once: true }}
                            >
                                 <span style={{ fontFamily: "'OPPOSans H', sans-serif", fontSize: getSize(14), color: 'white', fontWeight: '900', letterSpacing: '1px' }} className="block drop-shadow-lg">
                                    好奇心先锋 CURIOSITY PIONEER
                                </span>
                            </motion.div>
                             <motion.div
                                style={{ position: 'absolute', ...getPos(1200, 4820), zIndex: 50 }}
                                initial={{ x: 100, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }} 
                                viewport={{ once: true }}
                            >
                                 <span style={{ fontFamily: "'Arizonia', cursive", fontSize: getSize(80), color: 'white' }} className="block drop-shadow-lg">
                                    Rabbi
                                </span>
                            </motion.div>

                            {/* --- 3. CARRO SECTION --- */}
                            <motion.div
                                style={{ position: 'absolute', ...getPos(200, 6710), zIndex: 50 }}
                                initial={{ x: -100, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }} 
                                viewport={{ once: true }}
                            >
                                <span style={{ fontFamily: "'Franklin Gothic Medium Cond', sans-serif", fontSize: getSize(240), lineHeight: '1', color: 'white', fontWeight: 'normal' }} className="block drop-shadow-2xl">
                                    Carro
                                </span>
                            </motion.div>
                            <motion.div
                                style={{ position: 'absolute', ...getPos(215, 6932), zIndex: 50 }}
                                initial={{ x: -50, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }} 
                                viewport={{ once: true }}
                            >
                                 <span style={{ fontFamily: "'OPPOSans H', sans-serif", fontSize: getSize(14), color: 'white', fontWeight: '900', letterSpacing: '1px' }} className="block drop-shadow-lg">
                                    环保监督员  ENVIRONMENTAL SUPERVISOR
                                </span>
                            </motion.div>
                             <motion.div
                                style={{ position: 'absolute', ...getPos(1400, 6855), zIndex: 50 }}
                                initial={{ x: 100, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }} 
                                viewport={{ once: true }}
                            >
                                 <span style={{ fontFamily: "'Arizonia', cursive", fontSize: getSize(80), color: 'white' }} className="block drop-shadow-lg">
                                    Carro
                                </span>
                            </motion.div>

                            {/* --- 4. OLLIE SECTION --- */}
                            <motion.div
                                style={{ position: 'absolute', ...getPos(200, 8735), zIndex: 50 }}
                                initial={{ x: -100, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }} 
                                viewport={{ once: true }}
                            >
                                <span style={{ fontFamily: "'Franklin Gothic Medium Cond', sans-serif", fontSize: getSize(240), lineHeight: '1', color: 'white', fontWeight: 'normal' }} className="block drop-shadow-2xl">
                                    Ollie
                                </span>
                            </motion.div>
                            <motion.div
                                style={{ position: 'absolute', ...getPos(215, 8952), zIndex: 50 }}
                                initial={{ x: -50, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }} 
                                viewport={{ once: true }}
                            >
                                 <span style={{ fontFamily: "'OPPOSans H', sans-serif", fontSize: getSize(14), color: 'white', fontWeight: '900', letterSpacing: '1px' }} className="block drop-shadow-lg">
                                    情感纽带  EMOTIONAL BOND
                                </span>
                            </motion.div>
                             <motion.div
                                style={{ position: 'absolute', ...getPos(1425, 8875), zIndex: 50 }}
                                initial={{ x: 100, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }} 
                                viewport={{ once: true }}
                            >
                                 <span style={{ fontFamily: "'Arizonia', cursive", fontSize: getSize(80), color: 'white' }} className="block drop-shadow-lg">
                                    Ollie
                                </span>
                            </motion.div>

                            {/* --- 5. OLIVER SECTION --- */}
                            <motion.div
                                style={{ position: 'absolute', ...getPos(200, 10755), zIndex: 50 }}
                                initial={{ x: -100, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }} 
                                viewport={{ once: true }}
                            >
                                <span style={{ fontFamily: "'Franklin Gothic Medium Cond', sans-serif", fontSize: getSize(240), lineHeight: '1', color: 'white', fontWeight: 'normal' }} className="block drop-shadow-2xl">
                                    Oliver
                                </span>
                            </motion.div>
                            <motion.div
                                style={{ position: 'absolute', ...getPos(215, 10977), zIndex: 50 }}
                                initial={{ x: -50, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }} 
                                viewport={{ once: true }}
                            >
                                 <span style={{ fontFamily: "'OPPOSans H', sans-serif", fontSize: getSize(14), color: 'white', fontWeight: '900', letterSpacing: '1px' }} className="block drop-shadow-lg">
                                    智慧守护者  THE WISDOM GUIDE
                                </span>
                            </motion.div>
                             <motion.div
                                style={{ position: 'absolute', ...getPos(1410, 10900), zIndex: 50 }}
                                initial={{ x: 100, opacity: 0 }} 
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }} 
                                viewport={{ once: true }}
                            >
                                 <span style={{ fontFamily: "'Arizonia', cursive", fontSize: getSize(80), color: 'white' }} className="block drop-shadow-lg">
                                    Oliver
                                </span>
                            </motion.div>

                        </>
                    )}
                </div>

                <div className="w-full py-32 text-center bg-black">
                    <p className="text-white/30 text-sm">End of Project Gallery</p>
                </div>
            </div>
        </div>
    );
};

const VinylProjects: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredProject, setHoveredProject] = useState<any>(null);
    const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const floorY = useTransform(scrollYProgress, [0, 1], ["-10%", "-280%"]);
    
    // Performance: springs
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 30, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 30, damping: 25 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const w = window.innerWidth;
        const h = window.innerHeight;
        x.set(clientX / w - 0.5);
        y.set(clientY / h - 0.5);
    };

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["45deg", "35deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
    const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-2%", "2%"]);

    const handleProjectEnter = (proj: any) => {
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
        setHoveredProject(proj);
    };

    const handleProjectLeave = () => {
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        // REMOVED 3s DELAY: Immediate exit on mouse leave
        setHoveredProject(null);
    };

    const cardPositions = useMemo(() => [
        { top: '-2%',  left: '5%',  rotate: -15, zIndex: 1 },
        { top: '28%',  left: '30%', rotate: 12,  zIndex: 2 },
        { top: '45%',  left: '8%',  rotate: 5,   zIndex: 3 },
        { top: '70%',  left: '25%', rotate: -8,  zIndex: 4 },
        { top: '100%', left: '2%',  rotate: 20,  zIndex: 5 },
        { top: '125%', left: '32%', rotate: -12, zIndex: 6 },
        { top: '155%', left: '10%', rotate: 8,   zIndex: 7 },
        { top: '185%', left: '28%', rotate: -5,  zIndex: 8 },
    ], []);

    return (
        <section 
            ref={containerRef}
            className="w-full relative bg-white" 
            onMouseMove={handleMouseMove}
            style={{ height: '550vh' }}
        >
             <div id="projects-deck" className="absolute top-0" />

             {/* 
                SCROLLBAR STYLES:
                - Track is hidden (background: transparent)
                - Thumb is visible
             */}
             <style>{`
                .floating-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .floating-scrollbar::-webkit-scrollbar-track {
                    background: transparent; /* Invisible Track */
                }
                .floating-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.4); /* Visible Thumb */
                    border-radius: 99px;
                }
                .floating-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(255, 255, 255, 0.6);
                }
                
                /* Backface visibility utility */
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
             `}</style>

             <motion.div 
                className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-white will-change-transform"
             >
                 <div className="absolute inset-0 flex items-center justify-center perspective-2000">
                    <motion.div
                        // OPTIMIZATION: Added transform-gpu to force hardware acceleration on the large projects wheel
                        className="relative w-full max-w-[1600px] will-change-transform transform-gpu"
                        style={{
                            rotateX,
                            rotateY,
                            x: translateX,
                            aspectRatio: '16/9',
                            transformStyle: "preserve-3d",
                        }}
                    >
                         {/* --- RIGHT SIDE: RECTANGULAR INFO CARD --- */}
                        <AnimatePresence mode="wait">
                            {hoveredProject && (
                                <RightPreviewCard 
                                    project={hoveredProject}
                                    handleProjectEnter={() => handleProjectEnter(hoveredProject)}
                                    handleProjectLeave={handleProjectLeave}
                                    setSelectedProject={setSelectedProject}
                                />
                            )}
                        </AnimatePresence>

                        {/* FLOOR */}
                        <motion.div 
                            className="absolute inset-0 w-full h-full will-change-transform"
                            style={{ 
                                y: floorY, 
                                transformStyle: "preserve-3d" 
                            }} 
                        >
                            <div className="absolute inset-[-50%] bg-white transform-preserve-3d" style={{ transform: `translateZ(${DEPTHS.FLOOR}px)` }} />
                            
                            <FloorMarquee 
                                direction="left" 
                                text="PROJECTS" 
                                rotate={-10} 
                                className="text-[140px] font-albert-black text-gray-100 leading-none" 
                                style={{ top: '5%', right: '-10%', left: 'auto' }}
                            />

                            <div className="absolute w-full h-full pointer-events-none" style={{ zIndex: 10, transformStyle: "preserve-3d", transform: `translateZ(${DEPTHS.PROJECTS}px)` }}>
                                {projects.map((proj, idx) => (
                                    <div key={proj.id} className="pointer-events-auto">
                                        <ProjectImageSquare 
                                            project={proj}
                                            style={cardPositions[idx] as any}
                                            onClick={() => setSelectedProject(proj)}
                                            onHoverStart={() => handleProjectEnter(proj)}
                                            onHoverEnd={handleProjectLeave}
                                            isHovered={hoveredProject?.id === proj.id}
                                            isAnyHovered={!!hoveredProject}
                                            isSelected={selectedProject?.id === proj.id}
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    </motion.div>
                 </div>
             </motion.div>

             {/* MODAL WINDOW (UPDATED ANIMATION: SLIDE FROM BOTTOM WITH ELASTIC STOP) */}
             {createPortal(
                <AnimatePresence>
                    {selectedProject && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center perspective-2000">
                            
                            {/* 1. BACKDROP: White to Dark Gray Transition (Simulating Night) */}
                            <motion.div 
                                initial={{ opacity: 0, backgroundColor: 'rgba(255,255,255,0)' }} 
                                animate={{ opacity: 1, backgroundColor: 'rgba(100,100,100,0.95)' }} // 🟢 DARK GRAY NIGHT MODE
                                exit={{ opacity: 0, backgroundColor: 'rgba(255,255,255,0)' }} 
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="absolute inset-0 backdrop-blur-md"
                                onClick={() => setSelectedProject(null)}
                            />

                            {/* 2. SLIDING MODAL CONTAINER (No more Flip) */}
                            <motion.div
                                // INITIAL: Start off-screen BOTTOM
                                initial={{ 
                                    y: "110%", 
                                    opacity: 0.5,
                                    scale: 0.95
                                }} 
                                // ANIMATE: Slide UP to center with spring
                                animate={{ 
                                    y: 0,
                                    opacity: 1,
                                    scale: 1
                                }} 
                                // EXIT: Slide DOWN off-screen
                                exit={{ 
                                    y: "110%", 
                                    opacity: 0,
                                    scale: 0.95
                                }} 
                                // 🟢 ELASTIC SPRING TRANSITION (Elegant Stop)
                                transition={{ 
                                    type: "spring",
                                    damping: 24,    // Controls how quickly it stops oscillating (higher = less bounce)
                                    stiffness: 180, // Controls speed
                                    mass: 0.8       // Lighter mass for snappier feel
                                }}
                                className={`relative w-[95vw] h-[95vh] rounded-[3rem] pointer-events-auto shadow-2xl overflow-hidden`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button 
                                    onClick={() => setSelectedProject(null)} 
                                    className={`absolute top-8 right-8 z-[60] w-12 h-12 flex items-center justify-center rounded-full transition-colors border shadow-lg group ${
                                        selectedProject.layout === 'gallery'
                                            ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                                            : 'bg-white/90 hover:bg-white border-gray-200 text-black'
                                    }`}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-90 transition-transform duration-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>

                                {/* Content Container - Directly showing content now (No Flip) */}
                                <div className="w-full h-full bg-black">
                                    {selectedProject.layout === 'gallery' ? (
                                        <GalleryModalView images={selectedProject.detailImages || []} projectId={selectedProject.id} />
                                    ) : (
                                        <div className="w-full h-full overflow-y-auto floating-scrollbar relative z-10 bg-white">
                                            <div className="relative w-full h-[60vh] md:h-[70vh] bg-gray-100 flex items-center justify-center overflow-hidden">
                                                {selectedProject.img ? (
                                                    <img src={selectedProject.img} className="w-full h-full object-cover" decoding="async" alt="Project Hero" />
                                                ) : (
                                                    <div className="text-gray-400 font-bold tracking-widest">[ IMAGE CONTAINER: HERO ]</div>
                                                )}
                                                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white/90 via-white/40 to-transparent" />
                                            </div>
                                            <div className="relative z-10 -mt-32 px-4 md:px-12 pb-12">
                                                <div className="mx-auto max-w-7xl bg-white border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 md:p-14 overflow-hidden relative">
                                                    <div className="mb-12 relative z-10">
                                                        <h1 className="text-4xl md:text-7xl font-albert-black text-black tracking-tight mb-4">{selectedProject.title}</h1>
                                                        <div className="flex items-center gap-4 text-sm font-bold tracking-widest text-gray-500 uppercase">
                                                            <span className="px-3 py-1 bg-black text-white rounded-full">{selectedProject.year}</span>
                                                            <span>{selectedProject.client || 'Client'}</span>
                                                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                                            <span>{selectedProject.label}</span>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                                        <div className="md:col-span-2">
                                                            <h3 className="text-xl font-bold mb-4">Project Overview</h3>
                                                            <p className="text-2xl text-gray-800 font-albert-regular leading-relaxed">{selectedProject.desc}</p>
                                                        </div>
                                                        <div className="md:col-span-1 space-y-8">
                                                            <div>
                                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tools</h4>
                                                                <div className="flex gap-2 flex-wrap">
                                                                    {selectedProject.tools?.map((tool: string) => (
                                                                        <span key={tool} className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs font-bold text-gray-600">{tool}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-24" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
             )}
        </section>
    );
};

export default VinylProjects;