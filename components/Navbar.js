"use client";

import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';
import { canAccessAdminPanel } from '@/lib/rbac';

const translations = {
    en: {
        home: 'Home',
        about: 'About NSS',
        unit: 'Unit Details',
        events: 'Events',
        gallery: 'Gallery',
        team: 'Team',
        announcements: 'Announcements',
        volunteer: 'Join Us',
        contact: 'Contact',
        login: 'Login',
    },
    te: {
        home: 'హోమ్',
        about: 'NSS గురించి',
        unit: 'యూనిట్ వివరాలు',
        events: 'ఈవెంట్స్',
        gallery: 'గ్యాలరీ',
        team: 'టీమ్',
        announcements: 'ప్రకటనలు',
        volunteer: 'మాతో చేరండి',
        contact: 'సంప్రదించండి',
        login: 'లాగిన్',
    },
};

export default function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { language } = useLanguage();
    const pathname = usePathname();
    const t = translations[language];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navItems = [
        { label: t.home, href: '/' },
        { label: t.about, href: '/about' },
        { label: t.unit, href: '/unit' },
        { label: t.events, href: '/events' },
        { label: t.gallery, href: '/gallery' },
        { label: t.team, href: '/team' },
        { label: t.announcements, href: '/announcements' },
        { label: t.contact, href: '/contact' },
    ];

    return (
        <>
            <motion.nav
                className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
                initial={{ y: -100, x: '-50%' }}
                animate={{ y: 0, x: '-50%' }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
                {/* Logo separate from glass bar */}
                <div className={styles.logoWrapper}>
                    <Link href="/" className={styles.logo}>
                        <img src="/nss-logo.png" alt="NSS Logo" className={styles.largeLogo} />
                    </Link>
                </div>

                <div className={`container ${styles.navContainer}`}>
                    {/* Mobile Hamburger Wrapper */}
                    <div
                        className={styles.hamburgerWrapper}
                        onClick={toggleMenu}
                    >
                        <button
                            className={styles.menuToggle}
                            aria-label="Toggle menu"
                        >
                            <span className={styles.hamburger}></span>
                            <span className={styles.hamburger}></span>
                            <span className={styles.hamburger}></span>
                        </button>
                    </div>

                    {/* Desktop Navigation - Hidden on Mobile */}
                    <div className={styles.desktopNav}>
                        {/* Center Section: Navigation Links */}
                        <div className={styles.centerSection}>
                            <div className={styles.navLinks}>
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={pathname === item.href ? styles.active : ''}
                                    >
                                        {item.label}
                                        {pathname === item.href && (
                                            <motion.div
                                                layoutId="activeNav"
                                                className={styles.activeIndicator}
                                            />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Section: Actions & Buttons */}
                        <div className={styles.rightSection}>
                            <div className={styles.navActions}>
                                <LanguageToggle />

                                <div className={styles.authButtons}>
                                    <Link
                                        href="/volunteer"
                                        className={`${styles.volunteerLink} ${pathname === '/volunteer' ? styles.active : ''}`}
                                    >
                                        {t.volunteer}
                                    </Link>

                                    {session && canAccessAdminPanel(session.user) && (
                                        <Link
                                            href="/admin"
                                            className="marvelous-btn marvelous-btn-outline marvelous-btn-sm"
                                            style={{ padding: '8px 16px', fontSize: '12px' }}
                                        >
                                            Admin
                                        </Link>
                                    )}

                                    {session ? (
                                        <button
                                            onClick={() => signOut()}
                                            className="marvelous-btn marvelous-btn-outline marvelous-btn-sm"
                                            style={{ padding: '8px 16px', fontSize: '12px' }}
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="marvelous-btn marvelous-btn-primary marvelous-btn-sm"
                                            style={{ padding: '8px 16px', fontSize: '12px' }}
                                        >
                                            {t.login}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Overlay Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className={styles.mobileOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Close Button */}
                        <button
                            className={styles.mobileCloseBtn}
                            onClick={toggleMenu}
                            aria-label="Close menu"
                        >
                            ×
                        </button>

                        {/* Mobile Menu Content */}
                        <motion.div
                            className={styles.mobileMenuContent}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            {/* Navigation Links */}
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${styles.mobileMenuItem} ${pathname === item.href ? styles.mobileMenuItemActive : ''}`}
                                    onClick={toggleMenu}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <div className={styles.mobileDivider}></div>

                            {/* Join Us CTA */}
                            <Link
                                href="/volunteer"
                                className={`${styles.mobileMenuItem} ${styles.mobileMenuItemCTA}`}
                                onClick={toggleMenu}
                            >
                                {t.volunteer}
                            </Link>

                            <div className={styles.mobileDivider}></div>

                            {/* Admin/Auth Buttons */}
                            {session && canAccessAdminPanel(session.user) && (
                                <Link
                                    href="/admin"
                                    className={styles.mobileMenuItem}
                                    onClick={toggleMenu}
                                >
                                    Admin
                                </Link>
                            )}

                            {session ? (
                                <button
                                    onClick={() => {
                                        toggleMenu();
                                        signOut();
                                    }}
                                    className={styles.mobileMenuItem}
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className={styles.mobileMenuItem}
                                    onClick={toggleMenu}
                                >
                                    {t.login}
                                </Link>
                            )}

                            <div className={styles.mobileDivider}></div>

                            {/* Language Toggle */}
                            <div className={styles.mobileLanguageToggle}>
                                <LanguageToggle />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
