'use client';
// Force IDE refresh


import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { useRef, useState, Suspense } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

function EvidenceMarker({ position, label, color = '#ff5252' }: { position: [number, number, number]; label: string; color?: string }) {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);

    return (
        <mesh
            ref={meshRef}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.8 : 0.3} />
            {hovered && (
                <Html distanceFactor={10}>
                    <div style={{
                        background: 'rgba(22, 27, 42, 0.95)',
                        border: '1px solid #00a8ff',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: 'white',
                        fontSize: '12px',
                        fontFamily: 'Roboto, sans-serif',
                        whiteSpace: 'nowrap',
                    }}>
                        {label}
                    </div>
                </Html>
            )}
        </mesh>
    );
}

function PersonMarker({ position, label, color = '#00b0ff' }: { position: [number, number, number]; label: string; color?: string }) {
    const [hovered, setHovered] = useState(false);

    return (
        <group position={position}>
            {/* Head */}
            <mesh
                position={[0, 1.6, 0]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.6 : 0.2} />
            </mesh>
            {/* Body */}
            <mesh position={[0, 1.1, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.15, 0.8, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0.1} transparent opacity={0.7} />
            </mesh>
            {/* Legs */}
            <mesh position={[-0.08, 0.4, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.8, 6]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} transparent opacity={0.5} />
            </mesh>
            <mesh position={[0.08, 0.4, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.8, 6]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} transparent opacity={0.5} />
            </mesh>
            {hovered && (
                <Html position={[0, 2, 0]} distanceFactor={10}>
                    <div style={{
                        background: 'rgba(22, 27, 42, 0.95)',
                        border: `1px solid ${color}`,
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: 'white',
                        fontSize: '12px',
                        fontFamily: 'Roboto, sans-serif',
                        whiteSpace: 'nowrap',
                    }}>
                        {label}
                    </div>
                </Html>
            )}
        </group>
    );
}

function WeaponMarker({ position, label, type = 'knife', color = '#ff5252' }: { position: [number, number, number]; label: string; type?: 'knife' | 'gun' | 'bat'; color?: string }) {
    const [hovered, setHovered] = useState(false);

    return (
        <group position={position}>
            {type === 'knife' && (
                <>
                    {/* Blade */}
                    <mesh
                        rotation={[0, 0, Math.PI / 4]}
                        onPointerOver={() => setHovered(true)}
                        onPointerOut={() => setHovered(false)}
                    >
                        <boxGeometry args={[0.03, 0.35, 0.01]} />
                        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={hovered ? 0.5 : 0.1} />
                    </mesh>
                    {/* Handle */}
                    <mesh rotation={[0, 0, Math.PI / 4]} position={[0.15, -0.15, 0]}>
                        <boxGeometry args={[0.04, 0.12, 0.02]} />
                        <meshStandardMaterial color="#4a3728" />
                    </mesh>
                </>
            )}
            {type === 'gun' && (
                <>
                    {/* Barrel */}
                    <mesh
                        rotation={[0, Math.PI / 2, 0]}
                        onPointerOver={() => setHovered(true)}
                        onPointerOut={() => setHovered(false)}
                    >
                        <boxGeometry args={[0.25, 0.04, 0.04]} />
                        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={hovered ? 0.5 : 0.1} />
                    </mesh>
                    {/* Grip */}
                    <mesh position={[0.05, -0.08, 0]} rotation={[0, 0, 0.3]}>
                        <boxGeometry args={[0.04, 0.12, 0.04]} />
                        <meshStandardMaterial color="#1a1a1a" />
                    </mesh>
                </>
            )}
            {type === 'bat' && (
                <mesh
                    rotation={[Math.PI / 6, 0, 0]}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    <cylinderGeometry args={[0.03, 0.05, 0.6, 8]} />
                    <meshStandardMaterial color="#8B4513" emissive={color} emissiveIntensity={hovered ? 0.4 : 0.1} />
                </mesh>
            )}
            {hovered && (
                <Html position={[0, 0.3, 0]} distanceFactor={10}>
                    <div style={{
                        background: 'rgba(22, 27, 42, 0.95)',
                        border: `1px solid ${color}`,
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: 'white',
                        fontSize: '12px',
                        fontFamily: 'Roboto, sans-serif',
                        whiteSpace: 'nowrap',
                    }}>
                        {label}
                    </div>
                </Html>
            )}
        </group>
    );
}

function CrimeSceneRoom() {
    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[8, 6]} />
                <meshStandardMaterial color="#1a1f35" />
            </mesh>

            {/* Back Wall */}
            <mesh position={[0, 2, -3]} receiveShadow>
                <planeGeometry args={[8, 4]} />
                <meshStandardMaterial color="#121826" />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-4, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                <planeGeometry args={[6, 4]} />
                <meshStandardMaterial color="#0f1420" />
            </mesh>

            {/* Right Wall */}
            <mesh position={[4, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
                <planeGeometry args={[6, 4]} />
                <meshStandardMaterial color="#0f1420" />
            </mesh>

            {/* Door Frame */}
            <mesh position={[3, 1.2, -2.95]}>
                <boxGeometry args={[1.2, 2.4, 0.1]} />
                <meshStandardMaterial color="#2a2f45" />
            </mesh>

            {/* Table */}
            <mesh position={[-1, 0.5, -1]} castShadow>
                <boxGeometry args={[1.5, 0.05, 0.8]} />
                <meshStandardMaterial color="#2a2f45" />
            </mesh>
            {/* Table Legs */}
            {[[-1.6, 0.25, -1.3], [-0.4, 0.25, -1.3], [-1.6, 0.25, -0.7], [-0.4, 0.25, -0.7]].map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]}>
                    <boxGeometry args={[0.05, 0.5, 0.05]} />
                    <meshStandardMaterial color="#1a1f35" />
                </mesh>
            ))}

            {/* Evidence Markers */}
            <EvidenceMarker position={[3, 1.2, -2.8]} label="EV-001: Forced Entry Point" color="#ff5252" />
            <EvidenceMarker position={[-1, 0.55, -1]} label="EV-002: Evidence on Table" color="#ff9800" />
            <EvidenceMarker position={[0, 0.15, 1]} label="EV-003: Blood Spatter" color="#00e676" />
            <EvidenceMarker position={[-3, 1, -2]} label="EV-004: Window Marks" color="#00a8ff" />
            <EvidenceMarker position={[2, 0.15, 0.5]} label="EV-005: Footprints" color="#00d2ff" />

            {/* Person Markers */}
            <PersonMarker position={[-2.5, 0, -1]} label="Victim (Deceased)" color="#ff5252" />
            <PersonMarker position={[1, 0, 1.5]} label="Witness #1 - Mr. Johnson" color="#00e676" />
            <PersonMarker position={[3.5, 0, -1]} label="Suspect - Unknown Male" color="#ff9800" />
            <PersonMarker position={[-3, 0, 1]} label="First Responder - Officer Davis" color="#00b0ff" />

            {/* Weapons */}
            <WeaponMarker position={[0, 0.05, 1.2]} label="WEAPON-001: Kitchen Knife" type="knife" color="#ff5252" />
            <WeaponMarker position={[-1.2, 0.55, -0.8]} label="WEAPON-002: Handgun" type="gun" color="#ff9800" />
            <WeaponMarker position={[1.5, 0.05, -0.5]} label="WEAPON-003: Baseball Bat" type="bat" color="#ff5252" />

            {/* Trajectory Line */}
            <mesh position={[1.5, 0.675, -0.9]}>
                <cylinderGeometry args={[0.02, 0.02, 4.2, 8]} />
                <meshStandardMaterial color="#ff9800" emissive="#ff9800" emissiveIntensity={0.5} />
            </mesh>
        </group>
    );
}

function ServerRoom() {
    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#050505" />
            </mesh>
            {[ -2, 0, 2 ].map((x) => (
                <mesh key={x} position={[x, 1.25, -2]} castShadow>
                    <boxGeometry args={[1, 2.5, 1]} />
                    <meshStandardMaterial color="#1a1a1a" emissive="#00a8ff" emissiveIntensity={0.2} />
                    <pointLight position={[0, 0, 0.6]} intensity={0.5} color="#00a8ff" />
                </mesh>
            ))}
            <EvidenceMarker position={[0, 1.5, -1.4]} label="EV-SERVER: Data Breach Entry" color="#00a8ff" />
        </group>
    );
}

function TrafficScene() {
    return (
        <group>
            {/* Road */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[20, 10]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <planeGeometry args={[20, 0.2]} />
                <meshStandardMaterial color="yellow" />
            </mesh>
            {/* Car placeholder */}
            <mesh position={[-2, 0.4, 1]} castShadow>
                <boxGeometry args={[2, 0.8, 1]} />
                <meshStandardMaterial color="#ff5252" />
            </mesh>
            <EvidenceMarker position={[-1, 0.2, 0.5]} label="EV-TRAFFIC: Skid Marks" color="#ff9800" />
        </group>
    );
}

export default function CrimeScene3D({ caseType = 'Burglary' }: { caseType?: string }) {
    return (
        <div style={{ width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <Canvas camera={{ position: [5, 4, 5], fov: 50 }} shadows={{ type: THREE.PCFShadowMap }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
                    
                    {caseType === 'Cyber Crime' ? (
                        <ServerRoom />
                    ) : caseType === 'Traffic Accident' ? (
                        <TrafficScene />
                    ) : (
                        <group>
                            {caseType === 'Homicide' && <pointLight position={[2, 2, 2]} color="#ff0000" intensity={0.5} />}
                            <CrimeSceneRoom />
                        </group>
                    )}

                    <Grid
                        args={[20, 20]}
                        position={[0, -0.01, 0]}
                        cellSize={0.5}
                        cellThickness={0.5}
                        cellColor="#2a2f45"
                        sectionSize={2}
                        sectionThickness={1}
                        sectionColor="#00a8ff"
                        fadeDistance={15}
                        infiniteGrid
                    />
                    <OrbitControls enableDamping dampingFactor={0.1} minDistance={2} maxDistance={20} />
                    <Environment preset="night" />
                </Suspense>
            </Canvas>
        </div>
    );
}
