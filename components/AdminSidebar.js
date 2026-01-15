'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './AdminSidebar.module.css';
import { Icons } from '@/components/Icons';
import { canAccessPage } from '@/lib/rbac';

const translations = {
    en: {
        dashboard: 'Dashboard',
        users: 'Users',
        events: 'Events',
        announcements: 'Announcements',
        gallery: 'Gallery',
        content: 'Content',
        team: 'Team',
        volunteers: 'Volunteers',
        contact: 'Contact',
        logout: 'Logout',
    },
    te: {
        dashboard: 'డాష్‌బోర్డ్',
        users: 'వినియోగదారులు',
        events: 'ఈవెంట్స్',
        announcements: 'ప్రకటనలు',
        gallery: 'గ్యాలరీ',
        content: 'కంటెంట్',
        team: 'టీమ్',
        volunteers: 'వాలంటీర్లు',
        contact: 'సంప్రదింపు',
        logout: 'లాగ్అవుట్',
    },
};

export default function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { language } = useLanguage();
    const t = translations[language];
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isSuperAdmin = session?.user?.role === 'super_admin';

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const menuItems = [
        { href: '/admin', label: t.dashboard, icon: Icons.Dashboard, show: true },
        { href: '/admin/users', label: t.users, icon: Icons.Users, show: isSuperAdmin },
        { href: '/admin/events', label: t.events, icon: Icons.Events, show: canAccessPage(session?.user, 'events') },
        { href: '/admin/announcements', label: t.announcements, icon: Icons.Announcements, show: canAccessPage(session?.user, 'announcements') },
        { href: '/admin/gallery', label: t.gallery, icon: Icons.Gallery, show: canAccessPage(session?.user, 'gallery') },
        { href: '/admin/content', label: t.content, icon: Icons.Content, show: canAccessPage(session?.user, 'content') },
        { href: '/admin/team', label: t.team, icon: Icons.Team, show: canAccessPage(session?.user, 'team') },
        { href: '/admin/volunteers', label: t.volunteers, icon: Icons.Volunteers, show: canAccessPage(session?.user, 'volunteers') || canAccessPage(session?.user, 'events') },
        { href: '/admin/contact', label: t.contact, icon: Icons.Contact, show: canAccessPage(session?.user, 'contact') },
    ];

    const handleLogout = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                className={styles.mobileMenuToggle}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle admin menu"
            >
                <span className={styles.hamburger}></span>
                <span className={styles.hamburger}></span>
                <span className={styles.hamburger}></span>
            </button>

            {/* Desktop Sidebar */}
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link href="/admin" className={styles.logo}>
                        <div className={styles.logoContainer}>
                            <h2 className={styles.logoTitle}>NSS Admin</h2>
                        </div>
                    </Link>
                </div>

                <nav className={styles.sidebarNav}>
                    {menuItems.filter(item => item.show).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
                        >
                            <span className={styles.navIcon}><item.icon /></span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.backBtn} style={{ textDecoration: 'none' }}>
                        <span className={styles.navIcon}><Icons.Home /></span>
                        <span>Back to Home</span>
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <span className={styles.navIcon}><Icons.Logout /></span>
                        <span>{t.logout}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Overlay Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className={styles.mobileOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            className={styles.mobileMenuContent}
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Mobile Header */}
                            <div className={styles.mobileHeader}>
                                <h2 className={styles.mobileLogoTitle}>NSS Admin</h2>
                                <button
                                    className={styles.mobileCloseBtn}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    aria-label="Close menu"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Mobile Nav Items */}
                            <nav className={styles.mobileNav}>
                                {menuItems.filter(item => item.show).map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`${styles.mobileNavItem} ${pathname === item.href ? styles.mobileNavItemActive : ''}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className={styles.navIcon}><item.icon /></span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>

                            {/* Mobile Footer Actions */}
                            <div className={styles.mobileFooter}>
                                <Link
                                    href="/"
                                    className={styles.mobileNavItem}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className={styles.navIcon}><Icons.Home /></span>
                                    <span>Back to Home</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className={styles.mobileNavItem}
                                >
                                    <span className={styles.navIcon}><Icons.Logout /></span>
                                    <span>{t.logout}</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
