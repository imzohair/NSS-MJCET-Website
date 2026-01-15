'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './MeshGradient.module.css';

export default function MeshGradient() {
    const { theme } = useTheme();
    const meshRef = useRef(null);
    const isPatrioticEffect = theme === 'light';

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!meshRef.current) return;
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth) * 100;
            const y = (clientY / window.innerHeight) * 100;

            meshRef.current.style.setProperty('--mouse-x', `${x}%`);
            meshRef.current.style.setProperty('--mouse-y', `${y}%`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className={`${styles.meshContainer} ${isPatrioticEffect ? styles.patrioticMode : ''}`}
            ref={meshRef}
        >
            <div className={`${styles.blob} ${styles.blob1}`} />
            <div className={`${styles.blob} ${styles.blob2}`} />
            <div className={`${styles.blob} ${styles.blob3}`} />
            <div className={`${styles.blob} ${styles.blob4}`} />
            <div className={styles.noise} />
        </div>
    );
}
