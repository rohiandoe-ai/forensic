'use client';

import { useEffect, useRef, useState } from 'react';
import FAIcon from './FontAwesome';
import { faMap, faFire } from '@fortawesome/free-solid-svg-icons';

interface MapMarker {
    lat: number;
    lng: number;
    label: string;
    type: 'high' | 'medium' | 'low';
}

const markers: MapMarker[] = [
    { lat: 40.7128, lng: -74.006, label: 'CS-2024-001: Downtown Burglary', type: 'high' },
    { lat: 40.7282, lng: -73.7949, label: 'CS-2024-002: Vehicle Theft', type: 'medium' },
    { lat: 40.7489, lng: -73.9680, label: 'CS-2024-003: Assault Case', type: 'high' },
    { lat: 40.6892, lng: -74.0445, label: 'CS-2024-004: Fraud Investigation', type: 'low' },
    { lat: 40.7614, lng: -73.9776, label: 'CS-2024-005: Robbery', type: 'medium' },
];

const colors = { high: '#ff5252', medium: '#ff9800', low: '#00e676' };

export default function CrimeMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showHeatmap, setShowHeatmap] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width = canvas.offsetWidth * 2;
        const height = canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;

        // Background
        ctx.fillStyle = '#0a0e17';
        ctx.fillRect(0, 0, w, h);

        // Grid lines (streets)
        ctx.strokeStyle = 'rgba(0, 168, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
            const x = (w / 20) * i;
            const y = (h / 20) * i;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Major roads
        ctx.strokeStyle = 'rgba(0, 168, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(w * 0.3, 0); ctx.lineTo(w * 0.3, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w * 0.7, 0); ctx.lineTo(w * 0.7, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, h * 0.4); ctx.lineTo(w, h * 0.4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, h * 0.7); ctx.lineTo(w, h * 0.7); ctx.stroke();

        // River
        ctx.strokeStyle = 'rgba(0, 168, 255, 0.12)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.5);
        ctx.bezierCurveTo(w * 0.3, h * 0.45, w * 0.6, h * 0.55, w, h * 0.48);
        ctx.stroke();

        // Blocks
        ctx.fillStyle = 'rgba(0, 168, 255, 0.03)';
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if (Math.random() > 0.3) {
                    ctx.fillRect(
                        w * 0.1 + x * w * 0.17 + 4,
                        h * 0.08 + y * h * 0.18 + 4,
                        w * 0.13,
                        h * 0.14
                    );
                }
            }
        }

        // Heatmap layer
        if (showHeatmap) {
            markers.forEach((m, i) => {
                const x = w * 0.15 + (i * w * 0.17);
                const y = h * 0.2 + (i % 3) * h * 0.25;
                
                // Heatmap blob
                const intensity = m.type === 'high' ? 1.5 : m.type === 'medium' ? 1 : 0.6;
                const heatRadius = 60 * intensity;
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, heatRadius);
                
                // Intense red center fading out
                gradient.addColorStop(0, `rgba(255, 0, 0, ${0.4 * intensity})`);
                gradient.addColorStop(0.3, `rgba(255, 82, 82, ${0.2 * intensity})`);
                gradient.addColorStop(0.6, `rgba(255, 152, 0, ${0.1 * intensity})`);
                gradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = gradient;
                ctx.beginPath(); ctx.arc(x, y, heatRadius, 0, Math.PI * 2); ctx.fill();
            });
        }

        // Markers
        markers.forEach((m, i) => {
            const x = w * 0.15 + (i * w * 0.17);
            const y = h * 0.2 + (i % 3) * h * 0.25;
            const color = colors[m.type];

            // Glow
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 25);
            gradient.addColorStop(0, color + '40');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath(); ctx.arc(x, y, 25, 0, Math.PI * 2); ctx.fill();

            // Pulse ring
            ctx.strokeStyle = color + '60';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.stroke();

            // Center dot
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();

            // Inner dot
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();

            // Label
            ctx.fillStyle = '#b0b7c3';
            ctx.font = '10px Roboto, sans-serif';
            ctx.fillText(m.label.split(':')[0], x - 30, y + 22);
        });

        // Legend
        ctx.fillStyle = 'rgba(22, 27, 42, 0.9)';
        ctx.fillRect(w - 140, 10, 130, 75);
        ctx.strokeStyle = '#2a2f45';
        ctx.lineWidth = 1;
        ctx.strokeRect(w - 140, 10, 130, 75);

        ctx.font = '11px Orbitron, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Priority', w - 125, 30);

        const legendItems = [
            { label: 'High', color: colors.high },
            { label: 'Medium', color: colors.medium },
            { label: 'Low', color: colors.low },
        ];

        legendItems.forEach((item, i) => {
            ctx.fillStyle = item.color;
            ctx.beginPath(); ctx.arc(w - 118, 45 + i * 18, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#b0b7c3';
            ctx.font = '10px Roboto, sans-serif';
            ctx.fillText(item.label, w - 108, 49 + i * 18);
        });

    }, [showHeatmap]);

    return (
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
                <button 
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    style={{ 
                        background: showHeatmap ? 'rgba(255, 82, 82, 0.2)' : 'rgba(22, 27, 42, 0.9)', 
                        border: `1px solid ${showHeatmap ? '#ff5252' : '#2a2f45'}`,
                        color: showHeatmap ? '#ff5252' : '#b0b7c3',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: 'var(--font-heading)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <FAIcon icon={showHeatmap ? faFire : faMap} /> 
                    {showHeatmap ? 'Heatmap Active' : 'Show Heatmap'}
                </button>
            </div>
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '300px', borderRadius: '12px', border: '1px solid var(--border-color)' }}
            />
        </div>
    );
}
