'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import LanguageToggle from '@/components/LanguageToggle';
import { canAccessAdminPanel } from '@/lib/rbac';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && !canAccessAdminPanel(session?.user)) {
            // Redirect unauthorized users to home page
            router.push('/');
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!session || !canAccessAdminPanel(session.user)) {
        return null;
    }

    return (
        <main className="marvelous-theme">
            <div className={styles.adminLayout}>
                <AdminSidebar />
                <div className={styles.mainContent}>
                    <div className={styles.topBar}>
                        <h1 className={styles.pageTitle}>NSS MJCET Admin</h1>
                        <div className={styles.topBarActions}>
                            <LanguageToggle />
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{session.user.name}</span>
                                <span className={styles.userRole}>
                                    {session.user.role === 'super_admin' ? 'Super Admin' : 'Member'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.contentArea}>
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}
