'use client';

import Link from 'next/link';
import { useLanguage, getText } from '@/contexts/LanguageContext';
import styles from './page.module.css';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import FacultyAdvisor from '@/components/FacultyAdvisor';

const translations = {
    hero: {
        title: {
            en: 'NSS MJCET',
            te: 'NSS MJCET',
        },
        tagline: {
            en: 'Not Me But You',
            te: 'నేను కాదు మీరు',
        },
        description: {
            en: 'Empowering students to serve the community and build a better tomorrow through dedicated social service.',
            te: 'అంకిత సామాజిక సేవ ద్వారా సమాజానికి సేవ చేయడానికి మరియు మంచి రేపటిని నిర్మించడానికి విద్యార్థులకు శక్తినిస్తోంది.',
        },
        joinBtn: {
            en: 'Become a Volunteer',
            te: 'వాలంటీర్ అవ్వండి',
        },
        learnMore: {
            en: 'Learn More',
            te: 'మరింత తెలుసుకోండి',
        },
    },
    stats: {
        title: {
            en: 'Our Impact',
            te: 'మా ప్రభావం',
        },
        volunteers: {
            en: 'Active Volunteers',
            te: 'క్రియాశీల వాలంటీర్లు',
        },
        events: {
            en: 'Events Conducted',
            te: 'నిర్వహించిన కార్యక్రమాలు',
        },
        hours: {
            en: 'Service Hours',
            te: 'సేవా గంటలు',
        },
        beneficiaries: {
            en: 'People Benefited',
            te: 'ప్రయోజనం పొందిన వ్యక్తులు',
        },
    },
    announcements: {
        title: {
            en: 'Latest Announcements',
            te: 'తాజా ప్రకటనలు',
        },
        viewAll: {
            en: 'View All Announcements',
            te: 'అన్ని ప్రకటనలను చూడండి',
        },
    },
    events: {
        title: {
            en: 'Upcoming Events',
            te: 'రాబోయే కార్యక్రమాలు',
        },
        viewAll: {
            en: 'View All Events',
            te: 'అన్ని కార్యక్రమాలను చూడండి',
        },
    },
    motto: {
        title: {
            en: 'NSS Motto',
            te: 'NSS నినాదం',
        },
        text: {
            en: 'The motto of NSS "Not Me But You" reflects the essence of democratic living and upholds the need for selfless service and appreciation of the other person\'s point of view.',
            te: 'NSS యొక్క నినాదం "నేను కాదు మీరు" ప్రజాస్వామ్య జీవన సారాంశాన్ని ప్రతిబింబిస్తుంది మరియు నిస్వార్థ సేవ మరియు ఇతర వ్యక్తి యొక్క దృక్కోణాన్ని అభినందించే అవసరాన్ని సమర్థిస్తుంది.',
        },
    },
    objectives: {
        title: {
            en: 'NSS Objectives',
            te: 'NSS లక్ష్యాలు',
        },
        list: [
            {
                en: 'Understand the community in which they work',
                te: 'వారు పనిచేసే సమాజాన్ని అర్థం చేసుకోవడం',
            },
            {
                en: 'Understand themselves in relation to their community',
                te: 'వారి సమాజానికి సంబంధించి తమను తాము అర్థం చేసుకోవడం',
            },
            {
                en: 'Identify the needs and problems of the community',
                te: 'సమాజం యొక్క అవసరాలు మరియు సమస్యలను గుర్తించడం',
            },
            {
                en: 'Develop competence to solve community problems',
                te: 'సమాజ సమస్యలను పరిష్కరించడానికి సామర్థ్యాన్ని అభివృద్ధి చేయడం',
            },
            {
                en: 'Develop a sense of social and civic responsibility',
                te: 'సామాజిక మరియు పౌర బాధ్యత భావాన్ని అభివృద్ధి చేయడం',
            },
        ],
    },
};

export default function Home() {
    const { language } = useLanguage();
    const [stats, setStats] = useState({
        volunteers: 0,
        events: 0,
        serviceHours: 0,
        beneficiaries: 0
    });

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setStats(data);
            })
            .catch(console.error);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className={styles.home}>
            <div className={styles.ornament1} />
            <div className={styles.ornament2} />
            <div className={styles.ornament3} />

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <motion.div
                        className={styles.heroContent}
                        variants={{
                            initial: { opacity: 0 },
                            animate: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15, delayChildren: 0.3 }
                            }
                        }}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.span
                            className={styles.heroTagline}
                            variants={{
                                initial: { opacity: 0, y: 10 },
                                animate: { opacity: 1, y: 0 }
                            }}
                        >
                            {getText(translations.hero.tagline, language)}
                        </motion.span>
                        <motion.h1
                            className={styles.heroTitle}
                            variants={{
                                initial: { opacity: 0, y: 30, scale: 0.95 },
                                animate: { opacity: 1, y: 0, scale: 1 }
                            }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {getText(translations.hero.title, language)}
                        </motion.h1>
                        <motion.p
                            className={styles.heroDescription}
                            variants={{
                                initial: { opacity: 0, y: 20 },
                                animate: { opacity: 1, y: 0 }
                            }}
                        >
                            {getText(translations.hero.description, language)}
                        </motion.p>
                        <motion.div
                            className={styles.heroActions}
                            variants={{
                                initial: { opacity: 0, y: 20 },
                                animate: { opacity: 1, y: 0 }
                            }}
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href="/volunteer" className="marvelous-btn marvelous-btn-primary marvelous-btn-lg">
                                    {getText(translations.hero.joinBtn, language)}
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href="/about" className="marvelous-btn marvelous-btn-outline marvelous-btn-lg">
                                    {getText(translations.hero.learnMore, language)}
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.stats}>
                <div className="container">
                    <motion.h2
                        className={styles.sectionTitle}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {getText(translations.stats.title, language)}
                    </motion.h2>
                    <motion.div
                        className={styles.statsGrid}
                        variants={stagger}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <StatCard
                            number={stats.volunteers}
                            label={getText(translations.stats.volunteers, language)}
                            suffix={stats.volunteers > 0 ? "+" : ""}
                        />
                        <StatCard
                            number={stats.events}
                            label={getText(translations.stats.events, language)}
                            suffix={stats.events > 0 ? "+" : ""}
                        />
                        <StatCard
                            number={stats.serviceHours}
                            label={getText(translations.stats.hours, language)}
                            suffix="+"
                        />
                        <StatCard
                            number={stats.beneficiaries}
                            label={getText(translations.stats.beneficiaries, language)}
                            suffix="+"
                        />
                    </motion.div>
                </div>
            </section>

            {/* NSS Motto Section */}
            <section className={styles.motto}>
                <div className="container">
                    <motion.div
                        className={styles.mottoCard}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2>{getText(translations.motto.title, language)}</h2>
                        <p className={styles.mottoText}>
                            {getText(translations.motto.text, language)}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* NSS Objectives Section */}
            <section className={styles.objectives}>
                <div className="container">
                    <motion.h2
                        className={styles.sectionTitle}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {getText(translations.objectives.title, language)}
                    </motion.h2>
                    <div className={styles.objectivesList}>
                        {translations.objectives.list.map((objective, index) => (
                            <motion.div
                                key={index}
                                className={styles.objectiveItem}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <div className={styles.objectiveNumber}>{index + 1}</div>
                                <p>{getText(objective, language)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Faculty Advisor Section */}
            <FacultyAdvisor />

            {/* CTA Section */}
            <section className={styles.cta}>
                <div className="container">
                    <motion.div
                        className={styles.ctaContent}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2>
                            {language === 'en'
                                ? 'Ready to Make a Difference?'
                                : 'మార్పు తీసుకురావడానికి సిద్ధంగా ఉన్నారా?'}
                        </h2>
                        <p>
                            {language === 'en'
                                ? 'Join NSS MJCET and be part of a community dedicated to social service and development.'
                                : 'NSS MJCET లో చేరండి మరియు సామాజిక సేవ మరియు అభివృద్ధికి అంకితమైన సమాజంలో భాగం అవ్వండి.'}
                        </p>
                        <Link href="/volunteer" className="marvelous-btn marvelous-btn-primary marvelous-btn-lg">
                            {getText(translations.hero.joinBtn, language)}
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

function StatCard({ number, label, suffix }) {
    return (
        <motion.div
            className={styles.statCard}
            variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
            }}
        >
            <div className={styles.statNumber}>
                <Counter from={0} to={number} />{suffix}
            </div>
            <div className={styles.statLabel}>{label}</div>
        </motion.div>
    );
}

function Counter({ from, to }) {
    const [count, setCount] = useState(from);

    useEffect(() => {
        const controls = { cancelled: false };
        const duration = 2000; // ms
        const startTime = Date.now();

        const animate = () => {
            if (controls.cancelled) return;
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3); // cubic ease out

            setCount(Math.floor(from + (to - from) * easeOut));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
        return () => { controls.cancelled = true; };
    }, [from, to]);

    return <span>{count.toLocaleString()}</span>;
}
