import React, { useMemo, useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera, RoundedBox, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CubeProps } from '../types';
import { createIconTexture } from '../utils/textures';

gsap.registerPlugin(ScrollTrigger);

// Raised floor so cubes sit visibly on the bottom of the viewport
const PHYSICS_FLOOR_Y = -5.0;

interface PhysicsState {
    active: boolean;
    velocities: THREE.Vector3[];
    offsets: THREE.Vector3[]; 
}

const WireframeShape: React.FC<{ position: [number, number, number], rotation?: [number, number, number], scale?: number, type: 'box' | 'sphere' | 'icosahedron' }> = ({ position, rotation = [0,0,0], scale = 1, type }) => {
    const ref = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    
    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        
        mm.add("(min-width: 1px)", () => {
             if (groupRef.current) {
                gsap.to(groupRef.current.position, {
                    y: -15,
                    opacity: 0,
                    scrollTrigger: {
                        trigger: "#hero-section",
                        start: "top top",
                        end: "bottom center",
                        scrub: 1
                    }
                });
                
                gsap.to(groupRef.current.scale, {
                    x: 0, y: 0, z: 0,
                    scrollTrigger: {
                        trigger: "#hero-section",
                        start: "top top",
                        end: "bottom center",
                        scrub: 1
                    }
                });
             }
        });
        
        return () => mm.revert();
    }, []);

    useFrame((state, delta) => {
        if(ref.current) {
            ref.current.rotation.x += delta * 0.2;
            ref.current.rotation.y += delta * 0.3;
        }
    });
    
    const geometry = useMemo(() => {
        switch (type) {
            case 'sphere': return new THREE.SphereGeometry(1, 16, 16);
            case 'icosahedron': return new THREE.IcosahedronGeometry(1, 0);
            case 'box': default: return new THREE.BoxGeometry(1, 1, 1);
        }
    }, [type]);
    return (
        <group ref={groupRef} position={position} rotation={new THREE.Euler(...rotation)} scale={scale}>
            <mesh ref={ref} geometry={geometry}>
                <meshBasicMaterial color="#111" wireframe transparent opacity={0.1} />
            </mesh>
        </group>
    )
}

const Cube: React.FC<CubeProps & { innerRef?: React.Ref<THREE.Group>, onPointerDown?: (e: ThreeEvent<PointerEvent>) => void }> = ({ 
  position, 
  rotation = [0, 0, 0], 
  color, 
  type = 'solid', 
  iconType, 
  scale = 1,
  innerRef,
  onPointerDown
}) => {
  const localRef = useRef<THREE.Group>(null);
  const ref = (innerRef || localRef) as React.MutableRefObject<THREE.Group>;
  const [hovered, setHovered] = useState(false);
  
  const textureMap = useMemo(() => {
    if (!iconType) return null;
    const url = createIconTexture(iconType, type === 'solid' && color === '#1A1A1A' ? '#FFFFFF' : '#1A1A1A');
    const tex = new THREE.TextureLoader().load(url);
    tex.anisotropy = 16;
    return tex;
  }, [iconType, color, type]);

  const baseMaterial = useMemo(() => new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.3,
      metalness: 0.1,
  }), [color]);

  useFrame((state, delta) => {
      if (ref.current) {
          const targetScale = hovered ? scale * 1.05 : scale;
          ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
      }
  });

  return (
    <group 
        ref={ref} 
        position={position} 
        rotation={new THREE.Euler(...rotation)}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'grab'; }}
        onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onPointerDown={(e) => { 
            if (onPointerDown) onPointerDown(e);
            document.body.style.cursor = 'grabbing'; 
        }}
        onPointerUp={() => { document.body.style.cursor = 'grab'; }}
    >
      <RoundedBox args={[1, 1, 1]} radius={0.08} smoothness={4} material={baseMaterial} castShadow receiveShadow>
         {iconType && textureMap && (
            <mesh position={[0, 0, 0.51]}>
                <planeGeometry args={[0.8, 0.8]} />
                <meshBasicMaterial map={textureMap} transparent opacity={0.9} />
            </mesh>
         )}
      </RoundedBox>
    </group>
  );
};

const HeroFloatingCubes = () => {
    const groupRef = useRef<THREE.Group>(null);
    const { viewport } = useThree();
    
    // Adjust positions based on viewport to keep them visible but not obstructive
    const isMobile = viewport.width < 7;
    
    // Position 1: Top Right (or top center on mobile)
    const pos1: [number, number, number] = isMobile ? [1.2, 3.5, 0] : [-2.5, 1.5, 2];
    // Position 2: Far Left (or bottom left on mobile)
    const pos2: [number, number, number] = isMobile ? [-1.2, -3.5, 0] : [-6, -2.5, 2];
    // Position 3: Bottom Left near CTA
    const pos3: [number, number, number] = isMobile ? [1.2, -1.5, -2] : [-3.5, -2.8, 2.5];

    useLayoutEffect(() => {
        if(!groupRef.current) return;
        
        const mm = gsap.matchMedia();
        mm.add("(min-width: 1px)", () => {
             gsap.to(groupRef.current!.position, {
                y: 10, 
                opacity: 0,
                scrollTrigger: {
                    trigger: "#hero-section",
                    start: "top top",
                    end: "bottom center",
                    scrub: 1
                }
            });
        });
        return () => mm.revert();
    }, [isMobile]); // Re-run if mobile state changes

    return (
        <group ref={groupRef}>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <Cube position={pos1} color="#94A3B8" scale={0.6} rotation={[0.5, 0.5, 0]} />
            </Float>
            <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.4}>
                <Cube position={pos2} color="#1A1A1A" scale={0.5} iconType="link" rotation={[-0.2, 0.4, 0.2]} />
            </Float>
             <Float speed={1.3} rotationIntensity={0.6} floatIntensity={0.4}>
                <Cube position={pos3} color="#F8FAFC" scale={0.4} iconType="wifi" rotation={[0.1, -0.2, 0.1]} />
            </Float>
        </group>
    )
}

const RubiksCube = () => {
    const topSliceRef = useRef<THREE.Group>(null);
    const midSliceRef = useRef<THREE.Group>(null);
    const botSliceRef = useRef<THREE.Group>(null);
    const mainGroupRef = useRef<THREE.Group>(null);
    const cubesRefs = useRef<THREE.Group[]>([]);
    
    // Track idle animation so we can pause/play it
    const idleTimeline = useRef<gsap.core.Timeline | null>(null);
    
    // Physics system
    const physics = useRef<PhysicsState>({ active: false, velocities: [], offsets: [] });
    
    // Dragging state
    const dragRef = useRef<number | null>(null);

    const { viewport, mouse, camera, gl } = useThree();

    // Grid data
    const slices = useMemo(() => {
        const top = [], mid = [], bot = [];
        const gap = 1.05;
        const colors = ['#FFFFFF', '#94A3B8', '#1A1A1A', '#CBD5E1', '#F8FAFC', '#475569'];

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const colorIndex = Math.floor(Math.random() * colors.length);
                    let iconType: CubeProps['iconType'] | undefined = undefined;

                    if (z === 1 && x === 0 && y === 0) iconType = 'link';
                    else if (z === -1 && x === 0 && y === 0) iconType = 'dots';
                    else if (y === 1 && x === 0 && z === 0) iconType = 'wifi';
                    else if (x === 1 && y === 0 && z === 0) iconType = 'cloud';
                    else if (x === -1 && y === 0 && z === 0) iconType = 'shield';
                    
                    const cubeData = {
                        localPosition: [x * gap, 0, z * gap] as [number, number, number], 
                        color: colors[colorIndex],
                        iconType,
                        id: `${x}-${y}-${z}`
                    };

                    if (y === 1) top.push(cubeData);
                    else if (y === 0) mid.push(cubeData);
                    else bot.push(cubeData);
                }
            }
        }
        return { top, mid, bot };
    }, []);

    useEffect(() => {
        const totalCubes = 27;
        for(let i=0; i<totalCubes; i++) {
            physics.current.velocities.push(new THREE.Vector3(0,0,0));
            physics.current.offsets.push(new THREE.Vector3(0,0,0));
        }
    }, []);

    // Setup dedicated ScrollTrigger for idle animation state
    useEffect(() => {
        // Start playing initially
        idleTimeline.current?.play();

        const st = ScrollTrigger.create({
            trigger: "#details-section",
            start: "center center", 
            onEnter: () => {
                 // Stop rotation when entering the breakdown phase
                 idleTimeline.current?.pause();
                 // Resetting rotations happens in the breakdown timeline
            },
            onLeaveBack: () => {
                 // Resume when going back up to details/hero
                 idleTimeline.current?.play();
            }
        });
        return () => st.kill();
    }, []);
    
    // Add global pointer up listener to stop dragging
    useEffect(() => {
        const handlePointerUp = () => {
            dragRef.current = null;
        };
        window.addEventListener('pointerup', handlePointerUp);
        return () => window.removeEventListener('pointerup', handlePointerUp);
    }, []);

    const handleCubePointerDown = (index: number, e: ThreeEvent<PointerEvent>) => {
        if (!physics.current.active) return;
        e.stopPropagation();
        // @ts-ignore
        e.target.setPointerCapture(e.pointerId);
        dragRef.current = index;
    };

    useFrame((state, delta) => {
        if (!physics.current.active) return;

        const vec = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vec.unproject(camera);
        const dir = vec.sub(camera.position).normalize();
        const distanceToFloor = (PHYSICS_FLOOR_Y - camera.position.y) / dir.y;
        const mouseWorldPos = camera.position.clone().add(dir.multiplyScalar(distanceToFloor));
        
        // Physics constants for "Play Mode"
        const repulsionRadius = 4.0; 
        const repulsionForce = 45.0; 
        const drag = 0.96; 
        
        const worldWidth = viewport.width / 2;

        cubesRefs.current.forEach((mesh, i) => {
            if (!mesh) return;
            const velocity = physics.current.velocities[i];
            
            const currentWorldPos = new THREE.Vector3();
            mesh.getWorldPosition(currentWorldPos);
            const meshFloorPos = new THREE.Vector3(currentWorldPos.x, PHYSICS_FLOOR_Y, currentWorldPos.z);
            const mouseFloorPos = new THREE.Vector3(mouseWorldPos.x, PHYSICS_FLOOR_Y, mouseWorldPos.z);

            // DRAG LOGIC
            if (dragRef.current === i) {
                 const targetPos = mouseFloorPos.clone();
                 // Lift slightly when dragging
                 targetPos.y = PHYSICS_FLOOR_Y + 0.5;
                 
                 // Impart velocity based on drag movement (for "throwing")
                 const moveDiff = targetPos.clone().sub(mesh.position);
                 velocity.copy(moveDiff.multiplyScalar(10));
                 
                 mesh.position.lerp(targetPos, 0.2);
                 
                 // Force collisions with others from the perspective of the dragged item
                 cubesRefs.current.forEach((otherMesh, j) => {
                    if (i === j || !otherMesh) return;
                    const otherPos = new THREE.Vector3();
                    otherMesh.getWorldPosition(otherPos);
                    const dist = mesh.position.distanceTo(otherPos);
                    const minDist = 1.3;
                    if (dist < minDist) {
                         const pushDir = otherPos.clone().sub(mesh.position).normalize();
                         const force = (minDist - dist) * 30.0;
                         physics.current.velocities[j].add(pushDir.multiplyScalar(force * delta));
                    }
                 });

                 return;
            }

            // Mouse Interaction (Push)
            if (dragRef.current === null) {
                const distToMouse = meshFloorPos.distanceTo(mouseFloorPos);
                if (distToMouse < repulsionRadius) {
                    const forceDir = meshFloorPos.clone().sub(mouseFloorPos).normalize();
                    const force = (1 - distToMouse / repulsionRadius) * repulsionForce;
                    velocity.add(forceDir.multiplyScalar(force * delta));
                }
            }

            // Cube-to-Cube Collision
            cubesRefs.current.forEach((otherMesh, j) => {
                if (i === j || !otherMesh) return;
                const otherPos = new THREE.Vector3();
                otherMesh.getWorldPosition(otherPos);
                
                const dist = currentWorldPos.distanceTo(otherPos);
                const minDist = 1.1; 
                if (dist < minDist) {
                    const pushDir = currentWorldPos.clone().sub(otherPos).normalize();
                    pushDir.x += (Math.random() - 0.5) * 0.1;
                    pushDir.z += (Math.random() - 0.5) * 0.1;
                    const force = (minDist - dist) * 15.0;
                    velocity.add(pushDir.multiplyScalar(force * delta));
                }
            });
            
            // Wall Collision
            const safeBoundary = Math.max(2, worldWidth - 1); 
            
            if (mesh.position.x > safeBoundary) {
                 velocity.x *= -0.8;
                 mesh.position.x = safeBoundary;
            } else if (mesh.position.x < -safeBoundary) {
                 velocity.x *= -0.8;
                 mesh.position.x = -safeBoundary;
            }

            // Apply Velocity
            mesh.position.x += velocity.x * delta;
            mesh.position.z += velocity.z * delta;
            
            // Idle bobbing
            mesh.position.y += Math.sin(state.clock.elapsedTime * 3 + i) * 0.003; 
            
            // Friction
            velocity.multiplyScalar(drag); 
        });
    });

    useLayoutEffect(() => {
        if (!mainGroupRef.current || !topSliceRef.current || !midSliceRef.current || !botSliceRef.current) return;

        const mm = gsap.matchMedia();

        mm.add({
            isMobile: "(max-width: 799px)",
            isDesktop: "(min-width: 800px)"
        }, (context) => {
            const { isMobile } = context.conditions as { isMobile: boolean };
            const screenWidth = viewport.width;

            // 1. Initial State
            const startPos: [number,number,number] = isMobile ? [0, -2.8, 0] : [3.5, 0, 0];
            const startScale = isMobile ? 0.65 : 0.95;
            
            mainGroupRef.current!.position.set(...startPos);
            mainGroupRef.current!.scale.set(startScale, startScale, startScale);
            mainGroupRef.current!.rotation.set(0.3, -0.5, 0);

            // 2. Idle Animation
            if (idleTimeline.current) idleTimeline.current.kill();
            
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2, defaults: { ease: "power3.inOut" } });
            idleTimeline.current = tl;
            
            const t = 0.8;
            tl.to(topSliceRef.current!.rotation, { y: Math.PI / 2, duration: t })
              .to(botSliceRef.current!.rotation, { y: -Math.PI / 2, duration: t }, "<0.1")
              .to(mainGroupRef.current!.rotation, { z: Math.PI / 2, duration: t * 1.2 }, "+=0.1")
              .to(midSliceRef.current!.rotation, { y: Math.PI / 2, duration: t })
              .to(topSliceRef.current!.rotation, { y: Math.PI, duration: t }, "<0.1")
              .to(mainGroupRef.current!.rotation, { x: 0.2, y: -0.5, z: 0, duration: t * 1.5 }, "+=0.1")
              .to(midSliceRef.current!.rotation, { y: 0, duration: t }, "+=0.2")
              .to(topSliceRef.current!.rotation, { y: 0, duration: t }, "<")
              .to(botSliceRef.current!.rotation, { y: 0, duration: t }, "<");


            // 3. Scroll to Details
            const centerPosDetails: [number,number,number] = isMobile ? [0, 0.5, 0] : [0, -2.5, 0];
            const detailScale = isMobile ? 0.6 : 0.9;

            const tl1 = gsap.timeline({
                scrollTrigger: {
                    trigger: "#hero-section",
                    start: "top top", 
                    endTrigger: "#details-section",
                    end: "center center",
                    scrub: 1.2,
                    immediateRender: false, 
                }
            });
            
            // NOTE: REMOVED slice rotation resets here to allow idle animation to continue through Section 2
            tl1.to(mainGroupRef.current!.rotation, {
                x: 0.2, y: Math.PI * 0.25, z: 0, duration: 1, ease: "power2.inOut"
            }, 0)
            .to(mainGroupRef.current!.position, {
                x: centerPosDetails[0], y: centerPosDetails[1], z: centerPosDetails[2], ease: "power1.inOut"
            }, 0)
            .to(mainGroupRef.current!.scale, {
                x: detailScale, y: detailScale, z: detailScale, ease: "power1.inOut"
            }, 0);

            // 4. Scroll to Breakdown
            const centerPosBreakdown = [0, 0, 0];
            const breakdownScale = isMobile ? 0.55 : 0.8;

            const tl2 = gsap.timeline({
                scrollTrigger: {
                    trigger: "#details-section",
                    start: "bottom bottom",
                    endTrigger: "#breakdown-section",
                    end: "center center",
                    scrub: 1,
                }
            });

            // FIRST: Reset Slices to flat before exploding
            tl2.to([topSliceRef.current!.rotation, midSliceRef.current!.rotation, botSliceRef.current!.rotation], { 
                x: 0, y: 0, z: 0, duration: 0.3, ease: "power2.inOut"
            }, 0);

            tl2.to(mainGroupRef.current!.position, {
                x: centerPosBreakdown[0], y: centerPosBreakdown[1], z: centerPosBreakdown[2],
                ease: "power2.inOut"
            }, 0)
            .to(mainGroupRef.current!.scale, {
                 x: breakdownScale, y: breakdownScale, z: breakdownScale,
                 ease: "power2.inOut"
            }, 0)
            .to(mainGroupRef.current!.rotation, {
                x: 0.5, y: Math.PI * 2.25, z: 0.2, 
                ease: "power2.inOut"
            }, 0);

            cubesRefs.current.forEach((mesh) => {
                if(!mesh) return;
                const parentY = 
                    slices.top.find(c => c.id === mesh.userData.id) ? 1.05 : 
                    slices.bot.find(c => c.id === mesh.userData.id) ? -1.05 : 0;
                
                const direction = new THREE.Vector3(mesh.position.x, parentY, mesh.position.z).normalize();
                if (direction.length() === 0) direction.set(0,1,0); 

                // Reduce horizontal spread to avoid overlapping side text in Section 3
                const safeSpread = Math.min(3.0, screenWidth * 0.25); 
                const explodeDist = safeSpread + Math.random() * 2;
                
                // Bias towards vertical explosion (Y) and depth (Z) rather than width (X)
                const targetX = mesh.position.x + direction.x * (explodeDist * 0.7); 
                const targetY = mesh.position.y + (direction.y * explodeDist) - parentY; 
                const targetZ = mesh.position.z + direction.z * explodeDist;

                tl2.to(mesh.position, {
                    x: targetX, y: targetY, z: targetZ, ease: "power2.out"
                }, 0);
                
                tl2.to(mesh.rotation, {
                    x: Math.random() * Math.PI * 2,
                    y: Math.random() * Math.PI * 2,
                    z: Math.random() * Math.PI * 2,
                    duration: 1
                }, 0);
            });

            // 5. Physics Drop
            const tl3 = gsap.timeline({
                scrollTrigger: {
                    trigger: "#breakdown-section",
                    start: "center center", 
                    endTrigger: "#footer-section",
                    end: "bottom bottom",
                    scrub: 1.5,
                    onLeave: () => { physics.current.active = true; },
                    onEnterBack: () => { physics.current.active = false; physics.current.velocities.forEach(v => v.set(0,0,0)); }
                }
            });

             cubesRefs.current.forEach((mesh, i) => {
                if (!mesh) return;
                
                const dropRange = Math.max(2, screenWidth * 0.8);
                const dropTargetX = (Math.random() - 0.5) * dropRange; 
                const dropTargetZ = (Math.random() - 0.5) * 10; 
                const dropTargetY = PHYSICS_FLOOR_Y + Math.random() * 1.5; 
                 const parentYOffset = 
                    slices.top.find(c => c.id === mesh.userData.id) ? 1.05 : 
                    slices.bot.find(c => c.id === mesh.userData.id) ? -1.05 : 0;

                const finalLocalY = dropTargetY - parentYOffset;
                const randRot = Math.random() * Math.PI * 6;

                tl3.to(mesh.position, {
                    x: dropTargetX, y: finalLocalY, z: dropTargetZ,
                    ease: "bounce.out", duration: 2, 
                }, i * 0.01); 
                tl3.to(mesh.rotation, {
                    x: randRot, y: randRot, z: randRot, ease: "power1.out"
                }, "<");
            });
        });

        return () => mm.revert();
    }, [slices, viewport.width]); 

    const addToRefs = (el: THREE.Group) => {
        if (el && !cubesRefs.current.includes(el)) cubesRefs.current.push(el);
    };
    cubesRefs.current = [];

    // Map through array to calculate index and pass it to handler
    const allCubes = [...slices.top, ...slices.mid, ...slices.bot];
    const topCount = slices.top.length;
    const midCount = slices.mid.length;

    return (
        <group ref={mainGroupRef}>
             <PresentationControls
                global={false}
                cursor={true}
                snap={true}
                speed={2}
                zoom={1}
                rotation={[0, 0, 0]}
                polar={[-Infinity, Infinity]}
                azimuth={[-Infinity, Infinity]}
             >
                <group>
                    <group ref={topSliceRef} position={[0, 1.05, 0]}>
                        {slices.top.map((c, i) => (
                            <Cube 
                                key={c.id} 
                                innerRef={addToRefs} 
                                position={c.localPosition} 
                                color={c.color} 
                                iconType={c.iconType} 
                                onPointerDown={(e) => handleCubePointerDown(i, e)}
                                {...{ userData: { id: c.id } }} 
                            />
                        ))}
                    </group>
                    <group ref={midSliceRef} position={[0, 0, 0]}>
                         {slices.mid.map((c, i) => (
                            <Cube 
                                key={c.id} 
                                innerRef={addToRefs} 
                                position={c.localPosition} 
                                color={c.color} 
                                iconType={c.iconType} 
                                onPointerDown={(e) => handleCubePointerDown(topCount + i, e)}
                                {...{ userData: { id: c.id } }} 
                            />
                        ))}
                    </group>
                    <group ref={botSliceRef} position={[0, -1.05, 0]}>
                         {slices.bot.map((c, i) => (
                            <Cube 
                                key={c.id} 
                                innerRef={addToRefs} 
                                position={c.localPosition} 
                                color={c.color} 
                                iconType={c.iconType} 
                                onPointerDown={(e) => handleCubePointerDown(topCount + midCount + i, e)}
                                {...{ userData: { id: c.id } }} 
                            />
                        ))}
                    </group>
                </group>
            </PresentationControls>
        </group>
    );
};

const ThreeScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={35} />
        <color attach="background" args={['#F3F6FB']} />
        
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 7]} intensity={1.5} castShadow />
        <directionalLight position={[-5, 5, -2]} intensity={1} color="#bfdbfe" />
        <spotLight position={[0, 5, -10]} intensity={0.5} color="#ffffff" />

        <RubiksCube />
        <HeroFloatingCubes />

        {/* Background Decorative Elements */}
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
            <WireframeShape position={[0, 4, -5]} type="box" scale={1.5} rotation={[0.5, 0.5, 0]} />
        </Float>
        <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.3}>
                <WireframeShape position={[6, -4, -2]} type="sphere" scale={1.2} />
        </Float>
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
                <WireframeShape position={[-5, 5, -8]} type="icosahedron" scale={2} />
        </Float>
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default ThreeScene;