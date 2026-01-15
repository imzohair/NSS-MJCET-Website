'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDate } from '@/utils/formatters';
import styles from './events.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const translations = {
    en: {
        title: 'Events',
        subtitle: 'Upcoming and Past Events',
        upcoming: 'Upcoming Events',
        past: 'Past Events',
        all: 'All Events',
        noEvents: 'No events found',
        readMore: 'Read More',
        date: 'Date',
        location: 'Location',
    },
    te: {
        title: 'ఈవెంట్స్',
        subtitle: 'రాబోయే మరియు గత ఈవెంట్స్',
        upcoming: 'రాబోయే ఈవెంట్స్',
        past: 'గత ఈవెంట్స్',
        all: 'అన్ని ఈవెంట్స్',
        noEvents: 'ఈవెంట్స్ కనుగొనబడలేదు',
        readMore: 'మరింత చదవండి',
        date: 'తేదీ',
        location: 'స్థలం',
    },
};

export default function EventsClient({ events }) {
    const { language } = useLanguage();
    const t = translations[language];
    const [filter, setFilter] = useState('all');

    const now = new Date();
    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        if (filter === 'upcoming') return eventDate >= now;
        if (filter === 'past') return eventDate < now;
        return true;
    });

    return (
        <div className={styles.eventsPage}>
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
                    className={styles.filters}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <button
                        className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnActive : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        {t.all}
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'upcoming' ? styles.filterBtnActive : ''}`}
                        onClick={() => setFilter('upcoming')}
                    >
                        {t.upcoming}
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'past' ? styles.filterBtnActive : ''}`}
                        onClick={() => setFilter('past')}
                    >
                        {t.past}
                    </button>
                </motion.div>

                {filteredEvents.length === 0 ? (
                    <motion.div
                        className={styles.noEvents}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p>{t.noEvents}</p>
                    </motion.div>
                ) : (
                    <motion.div
                        className={styles.eventsGrid}
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredEvents.map((event) => (
                                <motion.div
                                    key={event._id}
                                    className={styles.eventCard}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className={styles.eventDate}>
                                        <div className={styles.dateDay}>
                                            {new Date(event.date).getDate()}
                                        </div>
                                        <div className={styles.dateMonth}>
                                            {new Date(event.date).toLocaleDateString(language === 'en' ? 'en-US' : 'te-IN', { month: 'short' })}
                                        </div>
                                    </div>
                                    <div className={styles.eventContent}>
                                        <h3>{event.title[language] || event.title.en}</h3>
                                        <p className={styles.eventDescription}>
                                            {(event.description[language] || event.description.en).substring(0, 160)}...
                                        </p>
                                        <div className={styles.eventMeta}>
                                            <div className={styles.metaItem}>
                                                <span className={styles.metaIcon}>📅</span>
                                                <span>{formatDate(event.date, language === 'en' ? 'en-IN' : 'te-IN')}</span>
                                            </div>
                                            <div className={styles.metaItem}>
                                                <span className={styles.metaIcon}>📍</span>
                                                <span>{event.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
