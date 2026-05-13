'use client';

import { useState } from 'react';
import FAIcon from './FontAwesome';
import { faTimes, faSearchPlus, faSearchMinus, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import styles from './ImageViewer.module.css';

interface ImageViewerProps {
    src: string;
    alt: string;
    title?: string;
}

export default function ImageViewer({ src, alt, title }: ImageViewerProps) {
    const [open, setOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [fullscreen, setFullscreen] = useState(false);

    return (
        <>
            <div className={styles.thumbnail} onClick={() => setOpen(true)}>
                <img src={src} alt={alt} />
                <div className={styles.overlay}>
                    <FAIcon icon={faSearchPlus} />
                </div>
            </div>

            {open && (
                <div className={`${styles.modal} ${fullscreen ? styles.fullscreen : ''}`}>
                    <div className={styles.toolbar}>
                        <h3>{title || alt}</h3>
                        <div className={styles.controls}>
                            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
                                <FAIcon icon={faSearchMinus} />
                            </button>
                            <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
                            <button onClick={() => setZoom(z => Math.min(3, z + 0.25))}>
                                <FAIcon icon={faSearchPlus} />
                            </button>
                            <button onClick={() => setFullscreen(!fullscreen)}>
                                <FAIcon icon={fullscreen ? faCompress : faExpand} />
                            </button>
                            <button onClick={() => { setOpen(false); setZoom(1); setFullscreen(false); }}>
                                <FAIcon icon={faTimes} />
                            </button>
                        </div>
                    </div>
                    <div className={styles.imageContainer} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
                        <img
                            src={src}
                            alt={alt}
                            style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
