'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from './FacultyAdvisor.module.css';
import { motion } from 'framer-motion';

const translations = {
    en: {
        title: 'Faculty Advisor',
        name: 'Dr. Laxmi',
        department: 'Department of Mechanical Engineering',
        quote: 'Service to others is the rent you pay for your room here on earth. Through NSS, we cultivate compassionate leaders who dedicate themselves to the betterment of society.',
    },
    te: {
        title: 'ఫ్యాకల్టీ సలహాదారు',
        name: 'డా. లక్ష్మి',
        department: 'మెకానికల్ ఇంజనీరింగ్ విభాగం',
        quote: 'ఇతరులకు సేవ చేయడం మీ భూమిపై గదికి మీరు చెల్లించే అద్దె. NSS ద్వారా, మేము సమాజ అభివృద్ధికి అంకితమైన దయగల నాయకులను పెంచుతాము.',
    },
};

export default function FacultyAdvisor() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <section className={styles.facultySection}>
            <div className="container">
                <motion.div
                    className={styles.facultyCard}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className={styles.imageContainer}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className={styles.imagePlaceholder}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <p>Photo Coming Soon</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className={styles.contentContainer}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <h2 className={styles.sectionTitle}>{t.title}</h2>

                        <div className={styles.advisorInfo}>
                            <h3 className={styles.advisorName}>{t.name}</h3>

                            <div className={styles.departmentTag}>
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v4.066c-.495-.119-.971-.34-1.378-.686a.75.75 0 0 0-.967 1.147 4.57 4.57 0 0 0 2.345 1.023v.938a.75.75 0 0 0 1.5 0v-.938a4.57 4.57 0 0 0 2.345-1.023.75.75 0 1 0-.967-1.147c-.407.346-.883.567-1.378.686v-4.066a3.836 3.836 0 0 0 1.719-.756c.713-.566 1.113-1.35 1.113-2.178 0-.829-.4-1.612-1.113-2.178a3.836 3.836 0 0 0-1.719-.756V6Zm-1.5 3.75v2.316a2.336 2.336 0 0 1-.971-.43c-.309-.246-.529-.58-.529-.866 0-.286.22-.62.529-.865.27-.215.596-.364.971-.43Zm3 .77c0 .286-.22.62-.529.866-.27.215-.596.364-.971.43V9.52c.375.066.7.215.971.43.31.246.529.58.529.866Z" />
                                </svg>
                                <span>{t.department}</span>
                            </div>

                            <div className={styles.quoteContainer}>
                                <div className={styles.quoteIcon}>&quot;</div>
                                <p className={styles.quote}>{t.quote}</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
