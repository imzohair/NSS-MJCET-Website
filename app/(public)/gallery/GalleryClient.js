'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './gallery.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const translations = {
    en: {
        title: 'Gallery',
        subtitle: 'Moments from Our Events',
        all: 'All',
        events: 'Events',
        team: 'Team',
        awards: 'Awards',
        other: 'Other',
        noImages: 'No images found in this category',
    },
    te: {
        title: 'గ్యాలరీ',
        subtitle: 'మా ఈవెంట్స్ నుండి క్షణాలు',
        all: 'అన్నీ',
        events: 'ఈవెంట్స్',
        team: 'టీమ్',
        awards: 'అవార్డులు',
        other: 'ఇతర',
        noImages: 'ఈ వర్గంలో చిత్రాలు కనుగొనబడలేదు',
    },
};

const CATEGORIES = ['all', 'events', 'team', 'awards', 'other'];

export default function GalleryClient({ initialImages = [] }) {
    const { language } = useLanguage();
    const t = translations[language];
    const [filter, setFilter] = useState('all');

    const filteredImages = filter === 'all'
        ? initialImages
        : initialImages.filter(img => img.category === filter);

    return (
        <div className={styles.galleryPage}>
            <section className={styles.hero}>
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {t.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {t.subtitle}
                    </motion.p>
                </div>
            </section>

            <div className="container">
                <motion.div
                    className={styles.tabs}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.tab} ${filter === cat ? styles.activeTab : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {t[cat] || cat}
                        </button>
                    ))}
                </motion.div>

                <motion.div
                    className={styles.grid}
                    layout
                >
                    <AnimatePresence mode="popLayout">
                        {filteredImages.length > 0 ? (
                            filteredImages.map((image) => (
                                <motion.div
                                    key={image._id}
                                    className={styles.gridItem}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className={styles.imageWrapper}>
                                        <span className={styles.categoryTag}>{t[image.category] || image.category}</span>
                                        <img
                                            src={image.imageUrl}
                                            alt={image.caption[language] || 'Gallery Image'}
                                            className={styles.image}
                                            loading="lazy"
                                        />
                                    </div>
                                    {(image.caption.en || image.caption.te) && (
                                        <div className={styles.caption}>
                                            <h3>{image.caption[language] || image.caption.en}</h3>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                className={styles.emptyState}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <p>{t.noImages}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
