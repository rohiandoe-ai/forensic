'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './LazyImage.module.css';

interface LazyImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
}

export default function LazyImage({ src, alt, width, height, className }: LazyImageProps) {
    const [loaded, setLoaded] = useState(false);
    const [inView, setInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (imgRef.current) observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={imgRef}
            className={`${styles.container} ${className || ''}`}
            style={{ width, height }}
            role="img"
            aria-label={alt}
        >
            {!inView && <div className={styles.placeholder} aria-hidden="true" />}
            {inView && (
                <img
                    src={src}
                    alt={alt}
                    className={`${styles.image} ${loaded ? styles.visible : ''}`}
                    onLoad={() => setLoaded(true)}
                    loading="lazy"
                    decoding="async"
                    width={width}
                    height={height}
                />
            )}
        </div>
    );
}
