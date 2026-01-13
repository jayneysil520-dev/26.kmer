import React, { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring, useScroll, useMotionTemplate, Variants } from 'framer-motion';
import { createPortal } from 'react-dom'; 
import Spotlight3D from '../components/Spotlight3D';

// --- 3D IMPORTS (Using importmap from index.html) ---
import * as THREE from 'three';
import { Canvas, useFrame, useThree, ThreeElements } from '@react-three/fiber';
import { Environment, Float, Text, MeshTransmissionMaterial, ContactShadows } from '@react-three/drei';

// Fix for TypeScript errors with R3F elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      torusKnotGeometry: any;
      icosahedronGeometry: any;
      torusGeometry: any;
      ambientLight: any;
      spotLight: any;
      color: any;
    }
  }
}

// --- CONFIGURATION ---

// 🔥 IMPORTANT: Update your long image URL here!
const PROJECT_1_LONG_IMAGE = 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E6%88%91%E7%9A%84%E4%BD%8D%E7%BD%AE1-11.png';
const PROJECT_1_LONG_IMAGE_2 = 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E6%88%91%E7%9A%84%E4%BD%8D%E7%BD%AE1-11.png';
const PROJECT_2_LONG_IMAGE = 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E5%BE%97%E5%8A%9B%E8%9B%8B%E4%BB%94%E9%95%BF%E5%9B%BE1-11.png';

// --- ICONS DATA ---
const TOOL_ICONS: Record<string, string> = {
    'Figma': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/figma/figma-original.svg',
    'PS': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg',
    'AI': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg',
    'AE': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg',
    'Blender': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/blender/blender-original.svg',
    'C4D': 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/1197px-C4D_Logo.png',
    'React': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/react/react-original.svg',
    'ThreeJS': 'https://global.discourse-cdn.com/standard17/uploads/threejs/original/2X/e/e4f86d2200d2d35c30f7b1494e96b9595ebc2751.png', 
    'Jimeng': 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E5%8D%B3%E6%A2%A6icon.png',
    'Pinterest': 'https://jsd.cdn.zzko.cn/gh/devicons/devicon/icons/pinterest/pinterest-original.svg',
    'LibLib': 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/LibLib.png'
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
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/1-1.png', 
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
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/2-1.png', 
      desc: '得力在手，蛋仔脑洞全开',
      tools: ['Figma', 'Jimeng', 'PS', 'Blender'],
      layout: 'gallery',
      detailImages: [
          PROJECT_2_LONG_IMAGE 
      ]
  },
  { 
      id: 3, title: '猿辅导运营设计', label: 'VISUAL DESIGN', year: '2022', color: '#4DA6FF', 
      shadowColor: '#4DA6FF',
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E7%8C%BF%E8%BE%85%E5%AF%BC%E5%B0%81%E9%9D%A2.png', 
      desc: 'Cyberpunk aesthetic visual identity system for a futuristic fashion label.',
      tools: ['PS', 'AI', 'C4D']
  },
  { 
      id: 4, title: '卫岗形象设计之LoRA炼制', label: 'LOGO / IP DESIGN', year: '2022', color: '#EA2F2F', 
      img: 'https://jsd.cdn.zzko.cn/gh/jayneysil520-dev/jayneysil@main/%E5%8D%B3%E6%A2%A6icon.png', 
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
      // 🟢 👇 3D GALLERY PROJECT
      id: 7, title: '3D设计长廊', label: 'Gallery', year: '2021-2025', color: '#4ECDC4', 
      img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop', 
      desc: 'A collection of 3D experiments and renders. (Click to Enter 3D View)',
      tools: ['C4D', 'Blender', 'AE'],
      layout: '3d', // 🟢 Set layout to 3D
      models: [
        { name: "Abstract Shape", desc: "Complex topology study", url: "" }, 
        { name: "Glass Torus", desc: "Refraction and caustics test", url: "" },
        { name: "Liquid Orb", desc: "Fluid simulation snapshot", url: "" }
      ]
  },
  { 
      id: 8, title: '自媒体设计能力沉淀', label: 'Personal Growth', year: '2021-2026', color: '#FF0055', 
      img: 'https://images.unsplash.com/photo-1515405295579-ba7f45403022?q=80&w=1000&auto=format&fit=crop', 
      desc: 'Visualizing sound waves in real-time using WebAudio API and Canvas.',
      tools: ['ThreeJS', 'Blender']
  }
];

// --- 3D COMPONENTS (RENDERED ONLY IN MODAL) ---

const ModelItem = ({ position, rotation, index, label, description }: any) => {
    return (
        <group position={position} rotation={rotation}>
            {/* 
                🟢 SEPARATION: The rotating mesh is inside a group named 'spinner'.
                The Text is outside 'spinner', so it won't rotate with the mesh.
            */}
            <group name="spinner">
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh castShadow receiveShadow>
                        {/* Different geometries for variety */}
                        {index % 3 === 0 ? (
                            <torusKnotGeometry args={[1, 0.3, 128, 16]} />
                        ) : index % 3 === 1 ? (
                            <icosahedronGeometry args={[1.5, 0]} />
                        ) : (
                            <torusGeometry args={[1.2, 0.4, 16, 32]} />
                        )}
                        {/* High-end glass material */}
                        <MeshTransmissionMaterial 
                            backside
                            samples={4}
                            thickness={0.5}
                            chromaticAberration={0.05}
                            anisotropy={0.1}
                            distortion={0.5}
                            distortionScale={0.5}
                            temporalDistortion={0.1}
                            color={index % 2 === 0 ? "#4ECDC4" : "#FF0055"}
                        />
                    </mesh>
                </Float>
            </group>

            {/* Title Text (Bottom Center) */}
            <Text 
                position={[0, -2.5, 0]} 
                fontSize={0.3} 
                color="white" 
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                anchorX="center"
                anchorY="middle"
            >
                {label || `Model ${index + 1}`}
            </Text>

            {/* 🟢 Description Text (Right Side) */}
            <Text
                position={[3.5, 0, 0]}
                fontSize={0.2}
                maxWidth={3}
                color="rgba(255,255,255,0.7)"
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                anchorX="left"
                anchorY="middle"
                textAlign="left"
            >
                {description || "Experimental 3D form exploring geometry, light refraction, and material properties."}
            </Text>
        </group>
    );
};

// 2. The 3D Scene Controller
const GalleryScene = ({ scrollRef, items }: { scrollRef: React.MutableRefObject<number>, items: any[] }) => {
    const { camera } = useThree();
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        // 1. Camera movement
        const targetX = scrollRef.current * 0.01; 
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.08);
        
        // 2. Model Rotation
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                // 🟢 UPDATED: Target the specific 'spinner' group inside the ModelItem
                // This ensures only the model rotates, not the text.
                const spinner = child.getObjectByName('spinner');
                
                if (spinner) {
                    const scrollAngle = scrollRef.current * (Math.PI / 180);
                    // 🟢 UPDATED: Increased rotation speed (divide by 3 for faster rotation)
                    // 原来是 /10 (很慢), 现在改为 /3 (较快)
                    const interactionRotation = scrollAngle / 3;
                    const idleRotation = i * 1.5; 

                    spinner.rotation.y = interactionRotation + idleRotation;
                    spinner.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
                }
            });
        }
    });

    return (
        <group ref={groupRef}>
            {items.map((item, i) => (
                <ModelItem 
                    key={i} 
                    index={i}
                    label={item.name}
                    description={item.desc}
                    // 🟢 UPDATED: Increased spacing from 6 to 15
                    position={[i * 15, 0, 0]} 
                    rotation={[0, 0, 0]}
                />
            ))}
        </group>
    );
};

// 3. Main 3D Gallery View Component
const ThreeDGalleryView: React.FC<{ projects: any }> = ({ projects }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollVal = useRef(0); 

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            scrollVal.current += e.deltaY;
            if (scrollVal.current < 0) scrollVal.current = 0;
        };

        container.addEventListener('wheel', handleWheel);
        return () => container.removeEventListener('wheel', handleWheel);
    }, [projects]);

    return (
        <div 
            ref={containerRef} 
            className="w-full h-full bg-black relative cursor-move"
        >
            {/* Overlay UI */}
            <div className="absolute top-8 left-8 z-10 pointer-events-none text-white mix-blend-difference">
                <h1 className="text-4xl font-albert-black">{projects.title}</h1>
                <p className="text-sm font-mono opacity-70 mt-2">SCROLL TO EXPLORE & ROTATE</p>
                <div className="mt-4 flex gap-2">
                     <span className="px-2 py-1 border border-white/30 rounded text-xs bg-white/10 backdrop-blur-md">
                        MOUSE WHEEL: MOVE + ROTATE (Faster)
                     </span>
                </div>
            </div>

            {/* 3D Canvas */}
            <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
                <color attach="background" args={['#111']} />
                
                {/* 灯光系统 */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                
                <Environment preset="city" />

                <Suspense fallback={null}>
                    <GalleryScene scrollRef={scrollVal} items={projects.models || [{}, {}, {}]} />
                    
                    <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={40} blur={2} far={4.5} />
                </Suspense>
            </Canvas>
        </div>
    );
};


// --- DEPTH CONFIGURATION ---
const DEPTHS = {
    FLOOR: -300,
    PROPS: -290, 
    PROJECTS: -50,
};

// --- COMPONENTS ---

const ProjectImageSquare: React.FC<{ 
    project: any, 
    style: any, 
    onClick: () => void, 
    onHoverStart: () => void, 
    onHoverEnd: () => void, 
    isHovered: boolean, 
    isAnyHovered: boolean,
    isSelected: boolean 
}> = React.memo(({ project, style, onClick, onHoverStart, onHoverEnd, isHovered, isAnyHovered }) => {
    
    const targetScale = isHovered ? 1.15 : (isAnyHovered ? 0.9 : 1);
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

    const variants: Variants = {
        initial: { x: 800, opacity: 0, scale: 0.85 },
        animate: { 
            x: 0, opacity: 1, scale: 1,
            transition: { type: "spring", stiffness: 120, damping: 18 }
        },
        exit: { 
            scale: 0.95, opacity: 0, x: 150,
            transition: { duration: 0.25 } 
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
                <div className="relative z-10 flex flex-col h-full justify-center p-10">
                    <h2 className="text-5xl font-albert-black text-black tracking-tight drop-shadow-sm mb-4">
                        {project.title}
                    </h2>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-2.5 h-2.5 rounded-full ring-2 ring-white/50" style={{ backgroundColor: project.color }} />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{project.label}</span>
                    </div>
                    <p className="text-lg text-gray-600 font-albert-regular leading-relaxed max-w-xl">{project.desc}</p>
                </div>
            </div>
            {project.tools?.map((tool: string, i: number) => (
                <motion.div
                    key={tool}
                    className="absolute w-[98px] h-[98px] rounded-2xl bg-white/40 backdrop-blur-lg border border-white/50 shadow-lg flex items-center justify-center p-4 overflow-hidden pointer-events-none will-change-transform"
                    style={{ top: `${80 + (i % 2) * 20}%`, right: `${10 + (i * 15)}%`, zIndex: 40 }}
                    initial={{ scale: 0, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, type: "spring" }}
                >
                    <img src={TOOL_ICONS[tool] || ''} alt={tool} className="w-full h-full object-contain relative z-10 opacity-90" decoding="async" />
                </motion.div>
            ))}
        </motion.div>
    );
});

const GalleryModalView: React.FC<{ images: string[], projectId?: number }> = ({ images, projectId }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollVal, setScrollVal] = useState(0);

    const handleScroll = () => {
        if (scrollContainerRef.current) setScrollVal(Math.round(scrollContainerRef.current.scrollTop));
    };

    const DESIGN_WIDTH = 1920;
    const MODAL_WIDTH_VW = 95; 

    const getPos = (x: number, y: number) => ({
        left: `${(x / DESIGN_WIDTH) * 100}%`,
        top: `${(y / DESIGN_WIDTH) * MODAL_WIDTH_VW}vw` 
    });

    const getSize = (size: number) => `${(size / DESIGN_WIDTH) * MODAL_WIDTH_VW}vw`;

    return (
        <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="w-full h-full overflow-y-auto overflow-x-hidden floating-scrollbar relative z-10 p-0 bg-black"
        >
            <div className="relative w-full">
                <div className="flex flex-col w-full">
                    {images.map((imgUrl, index) => (
                        <div key={index} className="w-full bg-black">
                            <img src={imgUrl} className="w-full h-auto block" loading="lazy" decoding="async" alt="Project" />
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    {projectId === 1 && (
                        <>
                            <motion.div
                                style={{ position: 'absolute', ...getPos(200, 2675), zIndex: 50 }}
                                initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                            >
                                <span style={{ fontFamily: "'Franklin Gothic Medium Cond', sans-serif", fontSize: getSize(240), lineHeight: '1', color: 'white' }}>Fehn</span>
                            </motion.div>
                             <motion.div
                                style={{ position: 'absolute', ...getPos(1450, 2820), zIndex: 50 }}
                                initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
                            >
                                 <span style={{ fontFamily: "'Arizonia', cursive", fontSize: getSize(80), color: 'white' }}>Fehn</span>
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

const FloorMarquee: React.FC<{ direction: 'left' | 'right', text: string, className?: string, rotate?: number, style?: React.CSSProperties }> = React.memo(({ direction, text, className, rotate = 0, style }) => {
    return (
        <div 
            className="absolute left-[-20%] w-[140%] pointer-events-auto overflow-visible flex will-change-transform"
            style={{ 
                // 🟢 Z-INDEX FIX: Pushed deeper (-250) to sit between floor (-300) and cards (-50).
                transform: `translateZ(-250px) rotate(${rotate}deg)`, 
                // Removed negative z-index to avoid stacking context issues, relying on translateZ and DOM order.
                ...style,
            }}
        >
            <motion.div
                className={`flex whitespace-nowrap ${className}`}
                initial={{ x: direction === 'left' ? '0%' : '-50%' }}
                animate={{ x: direction === 'left' ? '-50%' : '0%' }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
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

const VinylProjects: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredProject, setHoveredProject] = useState<any>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // 🟢 KEEPING EXISTING PHYSICS (As requested: "Mine is fine")
    // Original scroll range and height
    // 🟢 UPDATED: Increased floor movement range to -190% to accommodate the increased spread of cards (up to 175% top).
    const floorY = useTransform(scrollYProgress, [0, 1], ["5%", "-190%"]);
    
    // Optional: Visual Anchor movement (Marquee moves slightly slower to create depth)
    const marqueeY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 30, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 30, damping: 25 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        x.set(clientX / window.innerWidth - 0.5);
        y.set(clientY / window.innerHeight - 0.5);
    };

    // 🟢 ADJUST PERSPECTIVE HERE (TILT ANGLE)
    // 调整这里的角度可以改变 Projects 页面的透视感 (数值越大倾斜越明显)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["45deg", "35deg"]);

    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
    const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-2%", "2%"]);

    // 🟢 KEEPING EXISTING LAYOUT (As requested)
    // 🟢 UPDATED: Spread out top positions (increments of 25%) to reduce crowding in the taller 550vh section.
    const cardPositions = useMemo(() => [
        { top: '0%',   left: '5%',  rotate: -15, zIndex: 1 },
        { top: '25%',  left: '30%', rotate: 12,  zIndex: 2 },
        { top: '50%',  left: '8%',  rotate: 5,   zIndex: 3 },
        { top: '75%',  left: '25%', rotate: -8,  zIndex: 4 },
        { top: '100%', left: '2%',  rotate: 20,  zIndex: 5 },
        { top: '125%', left: '32%', rotate: -12, zIndex: 6 },
        { top: '150%', left: '10%', rotate: 8,   zIndex: 7 },
        { top: '175%', left: '28%', rotate: -5,  zIndex: 8 },
    ], []);

    return (
        <section 
            ref={containerRef}
            className="w-full relative bg-white" 
            onMouseMove={handleMouseMove}
            // 🟢 UPDATED: Increased height to 550vh as requested to reduce crowding perception during scroll
            style={{ height: '550vh' }}
        >
             <div id="projects-deck" className="absolute top-0" />
             <style>{`
                .floating-scrollbar::-webkit-scrollbar { width: 6px; }
                .floating-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.4); border-radius: 99px; }
             `}</style>

             <motion.div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-white will-change-transform">
                 <div className="absolute inset-0 flex items-center justify-center perspective-2000">
                    <motion.div
                        className="relative w-full max-w-[1600px] will-change-transform transform-gpu"
                        style={{
                            rotateX,
                            rotateY,
                            x: translateX,
                            aspectRatio: '16/9',
                            transformStyle: "preserve-3d",
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {hoveredProject && (
                                <RightPreviewCard 
                                    project={hoveredProject}
                                    handleProjectEnter={() => setHoveredProject(hoveredProject)}
                                    handleProjectLeave={() => setHoveredProject(null)}
                                    setSelectedProject={setSelectedProject}
                                />
                            )}
                        </AnimatePresence>

                        {/* FLOOR */}
                        <motion.div 
                            className="absolute inset-0 w-full h-full will-change-transform"
                            style={{ y: floorY, transformStyle: "preserve-3d" }} 
                        >
                            <div className="absolute inset-[-50%] bg-white transform-preserve-3d" style={{ transform: `translateZ(${DEPTHS.FLOOR}px)` }} />
                            
                            {/* Marquee moves slightly to create parallax speed cue */}
                            {/* 
                                🟢 MARQUEE FIX: 
                                1. Removed zIndex: -10 to avoid stacking context traps. 
                                2. Placed physically between floor (-300) and cards (-50) at -250.
                            */}
                            {/* 🟢 MODIFY MARQUEE POSITION AND ROTATION HERE */}
                            <motion.div style={{ y: marqueeY, position: 'absolute', top: '0%', left: '0%', width: '100%' }}>
                                <FloorMarquee 
                                    direction="right" 
                                    text="PROJECTS" 
                                    rotate={-5} // 🟢 Adjust Rotation Angle Here
                                    className="text-[140px] font-albert-black text-gray-100 leading-none" 
                                />
                            </motion.div>

                            <div className="absolute w-full h-full pointer-events-none" style={{ zIndex: 10, transformStyle: "preserve-3d", transform: `translateZ(${DEPTHS.PROJECTS}px)` }}>
                                {projects.map((proj, idx) => (
                                    <div key={proj.id} className="pointer-events-auto">
                                        <ProjectImageSquare 
                                            project={proj}
                                            style={cardPositions[idx] as any}
                                            onClick={() => setSelectedProject(proj)}
                                            onHoverStart={() => setHoveredProject(proj)}
                                            onHoverEnd={() => setHoveredProject(null)}
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

             {/* MODAL WINDOW */}
             {createPortal(
                <AnimatePresence>
                    {selectedProject && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center perspective-2000">
                            <motion.div 
                                initial={{ opacity: 0, backgroundColor: 'rgba(255,255,255,0)' }} 
                                animate={{ opacity: 1, backgroundColor: 'rgba(100,100,100,0.95)' }}
                                exit={{ opacity: 0, backgroundColor: 'rgba(255,255,255,0)' }} 
                                transition={{ duration: 0.8 }}
                                className="absolute inset-0 backdrop-blur-md"
                                onClick={() => setSelectedProject(null)}
                            />
                            <motion.div
                                initial={{ y: "110%", opacity: 0.5, scale: 0.95 }} 
                                animate={{ y: 0, opacity: 1, scale: 1 }} 
                                exit={{ y: "110%", opacity: 0, scale: 0.95 }} 
                                transition={{ type: "spring", damping: 24, stiffness: 180, mass: 0.8 }}
                                className={`relative w-[95vw] h-[95vh] rounded-[3rem] pointer-events-auto shadow-2xl overflow-hidden`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button 
                                    onClick={() => setSelectedProject(null)} 
                                    className={`absolute top-8 right-8 z-[60] w-12 h-12 flex items-center justify-center rounded-full transition-colors border shadow-lg group ${
                                        selectedProject.layout === 'gallery' ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' : 'bg-white/90 hover:bg-white border-gray-200 text-black'
                                    }`}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-90 transition-transform duration-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                                <div className="w-full h-full bg-black">
                                    {selectedProject.layout === '3d' ? (
                                        <ThreeDGalleryView projects={selectedProject} />
                                    ) : selectedProject.layout === 'gallery' ? (
                                        <GalleryModalView images={selectedProject.detailImages || []} projectId={selectedProject.id} />
                                    ) : (
                                        <div className="w-full h-full overflow-y-auto floating-scrollbar relative z-10 bg-white">
                                           <div className="p-20"><h1 className="text-4xl">{selectedProject.title}</h1><p>{selectedProject.desc}</p></div>
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