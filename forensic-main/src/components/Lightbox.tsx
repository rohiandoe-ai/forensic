'use client';

import { useState, useEffect, useRef } from 'react';
import FAIcon from './FontAwesome';
import { faTimes, faSearchPlus, faSearchMinus, faExpand, faDownload, faPaintBrush, faEraser } from '@fortawesome/free-solid-svg-icons';
import styles from './Lightbox.module.css';

interface LightboxProps {
    src: string;
    alt: string;
    type?: 'image' | 'video' | 'document';
    isOpen: boolean;
    onClose: () => void;
}

export default function Lightbox({ src, alt, type = 'image', isOpen, onClose }: LightboxProps) {
    const [scale, setScale] = useState(1);
    const [isAnnotating, setIsAnnotating] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const t = window.setTimeout(() => {
                setScale(1);
                setIsAnnotating(false);
            }, 0);
            return () => {
                clearTimeout(t);
                document.body.style.overflow = 'auto';
            };
        }
        document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Canvas drawing logic
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isAnnotating) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            setIsDrawing(true);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !isAnnotating) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            ctx.strokeStyle = '#ff5252';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    if (!isOpen) return null;

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.5));
    const handleReset = () => setScale(1);

    return (
        <div className={styles.lightboxOverlay} onClick={onClose}>
            <div className={styles.lightboxToolbar} onClick={e => e.stopPropagation()}>
                <div className={styles.toolbarTitle}>{alt}</div>
                <div className={styles.toolbarActions}>
                    {type === 'image' && (
                        <>
                            <button onClick={() => setIsAnnotating(!isAnnotating)} aria-label="Draw" className={isAnnotating ? styles.activeTool : ''}><FAIcon icon={faPaintBrush} /></button>
                            {isAnnotating && <button onClick={clearCanvas} aria-label="Clear drawing"><FAIcon icon={faEraser} /></button>}
                        </>
                    )}
                    <button onClick={handleZoomOut} aria-label="Zoom out"><FAIcon icon={faSearchMinus} /></button>
                    <button onClick={handleReset} aria-label="Reset zoom"><FAIcon icon={faExpand} /></button>
                    <button onClick={handleZoomIn} aria-label="Zoom in"><FAIcon icon={faSearchPlus} /></button>
                    <button aria-label="Download media"><FAIcon icon={faDownload} /></button>
                    <button onClick={onClose} aria-label="Close" className={styles.closeBtn}><FAIcon icon={faTimes} /></button>
                </div>
            </div>
            
            <div className={styles.imageContainer} onClick={e => e.stopPropagation()}>
                {type === 'image' && (
                    <div style={{ position: 'relative', transform: `scale(${scale})`, transformOrigin: 'center center', transition: isAnnotating ? 'none' : 'transform 0.3s' }}>
                        <img 
                            ref={imgRef}
                            src={src || undefined} 
                            alt={alt} 
                            className={styles.lightboxImage}
                            onLoad={() => {
                                if (canvasRef.current && imgRef.current) {
                                    canvasRef.current.width = imgRef.current.width;
                                    canvasRef.current.height = imgRef.current.height;
                                }
                            }}
                            style={{ display: 'block', maxWidth: '90vw', maxHeight: '80vh' }}
                        />
                        <canvas
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                pointerEvents: isAnnotating ? 'auto' : 'none',
                                cursor: isAnnotating ? 'crosshair' : 'default',
                                zIndex: 10
                            }}
                        />
                    </div>
                )}
                
                {type === 'video' && (
                    <video controls src={src || undefined} className={styles.lightboxImage} style={{ transform: `scale(${scale})` }} />
                )}

                {type === 'document' && (
                    <iframe src={src || undefined} style={{ width: '80vw', height: '80vh', border: 'none', background: 'white' }} />
                )}
            </div>
        </div>
    );
}
