'use client';

import { useLanguage } from '../../../contexts/LanguageContext';
import styles from './about.module.css';
import { motion } from 'framer-motion';

const translations = {
    en: {
        title: 'About NSS',
        subtitle: 'National Service Scheme',
        intro: 'The National Service Scheme (NSS) is a Central Sector Scheme of Government of India, Ministry of Youth Affairs & Sports. It provides opportunity to the student youth of 11th & 12th Class of schools at +2 Board level and student youth of Technical Institution, Graduate & Post Graduate at colleges and University level of India to take part in various government led community service activities & programmes.',
        motto: {
            title: 'NSS Motto',
            text: 'The motto of NSS "Not Me But You" reflects the essence of democratic living and upholds the need for selfless service and appreciation of the other person\'s point of view and also to show consideration for fellow human beings.',
        },
        symbol: {
            title: 'NSS Symbol',
            text: 'The NSS symbol is based on the \'Rath\' wheel of the Konark Sun Temple situated in Orissa. These giant wheels of the Sun Temple portray the cycle of creation, preservation and release, and signify the movement in life across time and space. The wheel signifies the progressive cycle of life.',
        },
        objectives: {
            title: 'NSS Objectives',
            items: [
                'Understand the community in which they work',
                'Understand themselves in relation to their community',
                'Identify the needs and problems of the community and involve them in problem-solving',
                'Develop among themselves a sense of social and civic responsibility',
                'Utilise their knowledge in finding practical solutions to individual and community problems',
                'Develop competence required for group-living and sharing of responsibilities',
                'Gain skills in mobilising community participation',
                'Acquire leadership qualities and democratic attitudes',
                'Develop capacity to meet emergencies and natural disasters',
                'Practise national integration and social harmony',
            ],
        },
        mjcet: {
            title: 'NSS at MJCET',
            text: 'NSS MJCET has been actively serving the community since its inception. Our volunteers are dedicated to making a positive impact through various social service activities, awareness campaigns, and community development programs. We believe in the power of youth to bring about meaningful change in society.',
        },
    },
    te: {
        title: 'NSS గురించి',
        subtitle: 'నేషనల్ సర్వీస్ స్కీమ్',
        intro: 'నేషనల్ సర్వీస్ స్కీమ్ (NSS) భారత ప్రభుత్వం, యువజన వ్యవహారాలు & క్రీడల మంత్రిత్వ శాఖ యొక్క కేంద్ర రంగ పథకం. ఇది పాఠశాలల్లో 11వ & 12వ తరగతి విద్యార్థులకు +2 బోర్డు స్థాయిలో మరియు టెక్నికల్ సంస్థలు, గ్రాడ్యుయేట్ & పోస్ట్ గ్రాడ్యుయేట్ కాలేజీలు మరియు విశ్వవిద్యాలయ స్థాయిలో భారతదేశంలోని విద్యార్థి యువతకు వివిధ ప్రభుత్వ నేతృత్వంలోని సమాజ సేవా కార్యకలాపాలు & కార్యక్రమాలలో పాల్గొనే అవకాశాన్ని అందిస్తుంది.',
        motto: {
            title: 'NSS నినాదం',
            text: 'NSS యొక్క నినాదం "నేను కాదు మీరు" ప్రజాస్వామ్య జీవన సారాంశాన్ని ప్రతిబింబిస్తుంది మరియు నిస్వార్థ సేవ మరియు ఇతర వ్యక్తి యొక్క దృక్కోణాన్ని అభినందించే అవసరాన్ని సమర్థిస్తుంది మరియు తోటి మానవుల పట్ల శ్రద్ధ చూపించాలని కూడా సూచిస్తుంది.',
        },
        symbol: {
            title: 'NSS చిహ్నం',
            text: 'NSS చిహ్నం ఒడిశాలో ఉన్న కోణార్క సూర్య దేవాలయం యొక్క \'రథ\' చక్రం ఆధారంగా రూపొందించబడింది. సూర్య దేవాలయం యొక్క ఈ భారీ చక్రాలు సృష్టి, సంరక్షణ మరియు విడుదల చక్రాన్ని చిత్రీకరిస్తాయి మరియు సమయం మరియు స్థలం అంతటా జీవితంలో కదలికను సూచిస్తాయి. చక్రం జీవితం యొక్క ప్రగతిశీల చక్రాన్ని సూచిస్తుంది.',
        },
        objectives: {
            title: 'NSS లక్ష్యాలు',
            items: [
                'వారు పనిచేసే సమాజాన్ని అర్థం చేసుకోవడం',
                'వారి సమాజానికి సంబంధించి తమను తాము అర్థం చేసుకోవడం',
                'సమాజం యొక్క అవసరాలు మరియు సమస్యలను గుర్తించడం మరియు సమస్య పరిష్కారంలో వారిని పాల్గొనేలా చేయడం',
                'వారిలో సామాజిక మరియు పౌర బాధ్యత భావాన్ని అభివృద్ధి చేయడం',
                'వ్యక్తిగత మరియు సమాజ సమస్యలకు ఆచరణాత్మక పరిష్కారాలను కనుగొనడంలో వారి జ్ఞానాన్ని ఉపయోగించడం',
                'సమూహ జీవనం మరియు బాధ్యతల భాగస్వామ్యానికి అవసరమైన సామర్థ్యాన్ని అభివృద్ధి చేయడం',
                'సమాజ భాగస్వామ్యాన్ని సమీకరించడంలో నైపుణ్యాలను పొందడం',
                'నాయకత్వ లక్షణాలు మరియు ప్రజాస్వామ్య వైఖరులను పొందడం',
                'అత్యవసర పరిస్థితులు మరియు ప్రకృతి విపత్తులను ఎదుర్కొనే సామర్థ్యాన్ని అభివృద్ధి చేయడం',
                'జాతీయ ఏకీకరణ మరియు సామాజిక సామరస్యాన్ని ఆచరించడం',
            ],
        },
        mjcet: {
            title: 'MJCET లో NSS',
            text: 'NSS MJCET దాని ప్రారంభం నుండి సమాజానికి చురుకుగా సేవ చేస్తోంది. మా వాలంటీర్లు వివిధ సామాజిక సేవా కార్యకలాపాలు, అవగాహన ప్రచారాలు మరియు సమాజ అభివృద్ధి కార్యక్రమాల ద్వారా సానుకూల ప్రభావాన్ని చూపడానికి అంకితభావంతో ఉన్నారు. సమాజంలో అర్థవంతమైన మార్పును తీసుకురావడానికి యువత శక్తిని మేము విశ్వసిస్తాము.',
        },
    },
};

export default function AboutPage() {
    const context = useLanguage();
    const language = context?.language || 'en';
    const t = translations[language];

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    return (
        <div className={styles.aboutPage}>
            <section className={styles.hero}>
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {t.title}
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {t.subtitle}
                    </motion.p>
                </div>
            </section>

            <div className="container">
                <motion.section
                    className={styles.section}
                    {...fadeInUp}
                >
                    <p className={styles.intro}>{t.intro}</p>
                </motion.section>

                <motion.section
                    className={styles.section}
                    {...fadeInUp}
                >
                    <div className={styles.card}>
                        <h2>{t.motto.title}</h2>
                        <p>{t.motto.text}</p>
                    </div>
                </motion.section>

                <motion.section
                    className={styles.section}
                    {...fadeInUp}
                >
                    <div className={styles.card}>
                        <h2>{t.symbol.title}</h2>
                        <p>{t.symbol.text}</p>
                    </div>
                </motion.section>

                <section className={styles.section}>
                    <motion.h2
                        className={styles.sectionTitle}
                        {...fadeInUp}
                    >
                        {t.objectives.title}
                    </motion.h2>
                    <div className={styles.objectivesList}>
                        {t.objectives.items.map((item, index) => (
                            <motion.div
                                key={index}
                                className={styles.objectiveItem}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.5 }}
                            >
                                <div className={styles.objectiveNumber}>{index + 1}</div>
                                <p>{item}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <motion.section
                    className={styles.section}
                    {...fadeInUp}
                >
                    <div className={`${styles.card} ${styles.mjcetCard}`}>
                        <h2>{t.mjcet.title}</h2>
                        <p>{t.mjcet.text}</p>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
