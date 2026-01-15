'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../admin-content.module.css';

const PAGES = [
    { id: 'settings', label: 'Site Stats (Impact)' },
    { id: 'about', label: 'About NSS' },
    { id: 'unit', label: 'Unit Details' },
    { id: 'nss-song', label: 'NSS Song' },
    { id: 'nss-logo', label: 'NSS Logo' },
    { id: 'nss-motto', label: 'NSS Motto' },
];

export default function ContentPage() {
    const { data: session } = useSession();
    const [selectedPage, setSelectedPage] = useState('settings');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Content Data
    const [formData, setFormData] = useState({
        pageId: 'about',
        title: { en: '', te: '' },
        content: { en: '', te: '' },
        sections: []
    });

    // Settings Data
    const [settingsData, setSettingsData] = useState({
        serviceHours: 5000,
        peopleBenefited: 10000
    });

    useEffect(() => {
        if (selectedPage) {
            fetchContent(selectedPage);
        }
    }, [selectedPage]);

    const fetchContent = async (pageId) => {
        setLoading(true);
        try {
            if (pageId === 'settings') {
                const res = await fetch('/api/admin/content?type=settings');
                const data = await res.json();
                if (data.settings) {
                    setSettingsData({
                        serviceHours: data.settings.serviceHours || 5000,
                        peopleBenefited: data.settings.peopleBenefited || 10000
                    });
                }
            } else {
                const res = await fetch(`/api/admin/content?pageId=${pageId}`);
                const data = await res.json();
                if (data.content) {
                    setFormData(data.content);
                } else {
                    setFormData({
                        pageId: pageId,
                        title: { en: '', te: '' },
                        content: { en: '', te: '' },
                        sections: []
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch content', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const body = selectedPage === 'settings'
                ? { type: 'settings', ...settingsData }
                : { type: 'content', ...formData };

            const res = await fetch('/api/admin/content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                alert('Saved successfully');
            } else {
                alert('Failed to save');
            }
        } catch (error) {
            console.error('Error saving', error);
            alert('Error saving');
        } finally {
            setSaving(false);
        }
    };

    // Helper functions for dynamic sections
    const addSection = () => {
        setFormData({
            ...formData,
            sections: [...formData.sections, { heading: { en: '', te: '' }, content: { en: '', te: '' } }]
        });
    };

    const removeSection = (index) => {
        const newSections = [...formData.sections];
        newSections.splice(index, 1);
        setFormData({ ...formData, sections: newSections });
    };

    const updateSection = (index, field, lang, value) => {
        const newSections = [...formData.sections];
        newSections[index][field][lang] = value;
        setFormData({ ...formData, sections: newSections });
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h2 className={styles.sectionTitle}>Content Management</h2>
            </div>

            <div className={styles.card}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Select Page to Edit</label>
                    <select
                        className={styles.select}
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                    >
                        {PAGES.map(page => (
                            <option key={page.id} value={page.id}>{page.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.card}>
                    {selectedPage === 'settings' ? (
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Service Hours (Total Impact)</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={settingsData.serviceHours}
                                    onChange={(e) => setSettingsData({ ...settingsData, serviceHours: Number(e.target.value) })}
                                />
                                <small style={{ color: '#666' }}>Auto-calculated from events or manually set here.</small>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>People Benefited</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={settingsData.peopleBenefited}
                                    onChange={(e) => setSettingsData({ ...settingsData, peopleBenefited: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Page Title (English)</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        required
                                        value={formData.title.en}
                                        onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Page Title (Telugu)</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        required
                                        value={formData.title.te}
                                        onChange={(e) => setFormData({ ...formData, title: { ...formData.title, te: e.target.value } })}
                                    />
                                </div>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Main Content (English)</label>
                                    <textarea
                                        className={styles.textarea}
                                        required
                                        style={{ minHeight: '200px' }}
                                        value={formData.content.en}
                                        onChange={(e) => setFormData({ ...formData, content: { ...formData.content, en: e.target.value } })}
                                    />
                                </div>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Main Content (Telugu)</label>
                                    <textarea
                                        className={styles.textarea}
                                        required
                                        style={{ minHeight: '200px' }}
                                        value={formData.content.te}
                                        onChange={(e) => setFormData({ ...formData, content: { ...formData.content, te: e.target.value } })}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', marginBottom: '1rem', borderTop: '1px solid var(--color-gray-200)', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Sections</h3>
                                    <button type="button" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={addSection}>
                                        + Add Section
                                    </button>
                                </div>

                                {formData.sections.map((section, index) => (
                                    <div key={index} style={{ background: 'var(--color-gray-50)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                                            <button type="button" className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`} onClick={() => removeSection(index)}>Remove</button>
                                        </div>
                                        <div className={styles.formGrid}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Heading (EN)</label>
                                                <input
                                                    type="text"
                                                    className={styles.input}
                                                    value={section.heading.en}
                                                    onChange={(e) => updateSection(index, 'heading', 'en', e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>Heading (TE)</label>
                                                <input
                                                    type="text"
                                                    className={styles.input}
                                                    value={section.heading.te}
                                                    onChange={(e) => updateSection(index, 'heading', 'te', e.target.value)}
                                                />
                                            </div>
                                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                                <label className={styles.label}>Content (EN)</label>
                                                <textarea
                                                    className={styles.textarea}
                                                    value={section.content.en}
                                                    onChange={(e) => updateSection(index, 'content', 'en', e.target.value)}
                                                />
                                            </div>
                                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                                <label className={styles.label}>Content (TE)</label>
                                                <textarea
                                                    className={styles.textarea}
                                                    value={section.content.te}
                                                    onChange={(e) => updateSection(index, 'content', 'te', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <div style={{ display: 'flex', justifySelf: 'end', marginTop: '1rem' }}>
                        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
