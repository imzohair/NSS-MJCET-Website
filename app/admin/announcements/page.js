'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from '../admin-content.module.css';

export default function AnnouncementsPage() {
    const { data: session } = useSession();
    const { language } = useLanguage();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: { en: '', te: '' },
        content: { en: '', te: '' },
        priority: 'medium',
        expiryDate: '',
        isActive: true
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch('/api/admin/announcements');
            const data = await res.json();
            if (data.announcements) {
                setAnnouncements(data.announcements);
            }
        } catch (error) {
            console.error('Failed to fetch announcements', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingItem ? 'PUT' : 'POST';
            const body = { ...formData };
            if (editingItem) body.id = editingItem._id;

            const res = await fetch('/api/admin/announcements', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                closeModal();
                fetchAnnouncements();
            } else {
                alert('Failed to save announcement');
            }
        } catch (error) {
            console.error('Error saving announcement', error);
            alert('Error saving announcement');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;
        try {
            const res = await fetch(`/api/admin/announcements?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchAnnouncements();
            } else {
                alert('Failed to delete announcement');
            }
        } catch (error) {
            console.error('Error deleting announcement', error);
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: { en: item.title.en, te: item.title.te },
                content: { en: item.content.en, te: item.content.te },
                priority: item.priority,
                expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
                isActive: item.isActive
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: { en: '', te: '' },
                content: { en: '', te: '' },
                priority: 'medium',
                expiryDate: '',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 'urgent': return styles.badgeError;
            case 'high': return styles.badgeWarning;
            case 'medium': return styles.badgeInfo;
            default: return styles.badgeSuccess;
        }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div>
            <div className={styles.pageHeader}>
                <h2 className={styles.sectionTitle}>Announcements</h2>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => openModal()}>
                    <span>+</span> Add Announcement
                </button>
            </div>

            <div className={styles.card}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Title (EN)</th>
                                <th className={styles.th}>Title (TE)</th>
                                <th className={styles.th}>Priority</th>
                                <th className={styles.th}>Expiry</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className={styles.emptyState}>No announcements found</td>
                                </tr>
                            ) : (
                                announcements.map((item) => (
                                    <tr key={item._id} className={styles.tr}>
                                        <td className={styles.td}>{item.title.en}</td>
                                        <td className={styles.td}>{item.title.te}</td>
                                        <td className={styles.td}>
                                            <span className={`${styles.badge} ${getPriorityBadgeClass(item.priority)}`}>
                                                {item.priority}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className={styles.td}>
                                            <span className={`${styles.badge} ${item.isActive ? styles.badgeSuccess : styles.badgeError}`}>
                                                {item.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <div className={styles.btnGroup}>
                                                <button
                                                    className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`}
                                                    onClick={() => openModal(item)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className={`${styles.btn} ${styles.btnSm} ${styles.btnDanger}`}
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{editingItem ? 'Edit Announcement' : 'New Announcement'}</h3>
                            <button className={styles.closeBtn} onClick={closeModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Title (English)</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            required
                                            value={formData.title.en}
                                            onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Title (Telugu)</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            required
                                            value={formData.title.te}
                                            onChange={(e) => setFormData({ ...formData, title: { ...formData.title, te: e.target.value } })}
                                        />
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label className={styles.label}>Content (English)</label>
                                        <textarea
                                            className={styles.textarea}
                                            required
                                            value={formData.content.en}
                                            onChange={(e) => setFormData({ ...formData, content: { ...formData.content, en: e.target.value } })}
                                        />
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label className={styles.label}>Content (Telugu)</label>
                                        <textarea
                                            className={styles.textarea}
                                            required
                                            value={formData.content.te}
                                            onChange={(e) => setFormData({ ...formData, content: { ...formData.content, te: e.target.value } })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Priority</label>
                                        <select
                                            className={styles.select}
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Expiry Date</label>
                                        <input
                                            type="date"
                                            className={styles.input}
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Status</label>
                                        <select
                                            className={styles.select}
                                            value={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={closeModal}>Cancel</button>
                                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Save Announcement</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
