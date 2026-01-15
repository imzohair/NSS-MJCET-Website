'use client';

import { useSession } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { checkPermission } from '@/lib/rbac';
import { formatDate } from '@/utils/formatters';
import styles from './events.module.css';

const translations = {
    en: {
        title: 'Events Management',
        createEvent: 'Create New Event',
        allEvents: 'All Events',
        published: 'Published',
        draft: 'Draft',
        loading: 'Loading events...',
        noEvents: 'No events found',
        edit: 'Edit',
        delete: 'Delete',
        confirmDelete: 'Are you sure you want to delete this event?',
        date: 'Date',
        location: 'Location',
        status: 'Status',
        actions: 'Actions',
    },
    te: {
        title: 'ఈవెంట్స్ నిర్వహణ',
        createEvent: 'కొత్త ఈవెంట్ సృష్టించండి',
        allEvents: 'అన్ని ఈవెంట్స్',
        published: 'ప్రచురించబడింది',
        draft: 'డ్రాఫ్ట్',
        loading: 'ఈవెంట్స్ లోడ్ చేస్తోంది...',
        noEvents: 'ఈవెంట్స్ కనుగొనబడలేదు',
        edit: 'సవరించు',
        delete: 'తొలగించు',
        confirmDelete: 'మీరు ఖచ్చితంగా ఈ ఈవెంట్‌ను తొలగించాలనుకుంటున్నారా?',
        date: 'తేదీ',
        location: 'స్థలం',
        status: 'స్థితి',
        actions: 'చర్యలు',
    },
};

export default function EventsPage() {
    const { data: session } = useSession();
    const { language } = useLanguage();
    const t = translations[language];

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [filter, setFilter] = useState('all');

    const canCreate = checkPermission(session?.user, 'events', 'create');
    const canEdit = checkPermission(session?.user, 'events', 'edit');
    const canDelete = checkPermission(session?.user, 'events', 'delete');

    useEffect(() => {
        fetchEvents();
    }, [filter]);

    const fetchEvents = async () => {
        try {
            const url = filter === 'all'
                ? '/api/admin/events'
                : `/api/admin/events?status=${filter}`;

            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setEvents(data.events);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (!confirm(t.confirmDelete)) return;

        try {
            const response = await fetch(`/api/admin/events?eventId=${eventId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchEvents();
            } else {
                alert('Failed to delete event');
            }
        } catch (error) {
            console.error('Failed to delete event:', error);
            alert('Failed to delete event');
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>{t.loading}</p>
            </div>
        );
    }

    return (
        <div className={styles.eventsPage}>
            <div className={styles.header}>
                <h2>{t.title}</h2>
                {canCreate && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        + {t.createEvent}
                    </button>
                )}
            </div>

            <div className={styles.filters}>
                <button
                    className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnActive : ''}`}
                    onClick={() => setFilter('all')}
                >
                    {t.allEvents}
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'published' ? styles.filterBtnActive : ''}`}
                    onClick={() => setFilter('published')}
                >
                    {t.published}
                </button>
                <button
                    className={`${styles.filterBtn} ${filter === 'draft' ? styles.filterBtnActive : ''}`}
                    onClick={() => setFilter('draft')}
                >
                    {t.draft}
                </button>
            </div>

            {events.length === 0 ? (
                <div className={styles.noData}>
                    <p>{t.noEvents}</p>
                </div>
            ) : (
                <div className={styles.eventsGrid}>
                    {events.map((event) => (
                        <div key={event._id} className={styles.eventCard}>
                            <div className={styles.eventHeader}>
                                <h3>{event.title[language] || event.title.en}</h3>
                                <span className={`${styles.badge} ${event.status === 'published' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                    {event.status === 'published' ? t.published : t.draft}
                                </span>
                            </div>
                            <p className={styles.eventDescription}>
                                {(event.description[language] || event.description.en).substring(0, 150)}...
                            </p>
                            <div className={styles.eventMeta}>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaIcon}>📅</span>
                                    <span>{formatDate(event.date)}</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaIcon}>📍</span>
                                    <span>{event.location}</span>
                                </div>
                            </div>
                            <div className={styles.eventActions}>
                                {canEdit && (
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={() => setEditingEvent(event)}
                                    >
                                        {t.edit}
                                    </button>
                                )}
                                {canDelete && (
                                    <button
                                        className="btn btn-sm"
                                        style={{ backgroundColor: 'var(--color-error)', color: 'white' }}
                                        onClick={() => handleDelete(event._id)}
                                    >
                                        {t.delete}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <EventFormModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchEvents();
                    }}
                />
            )}

            {editingEvent && (
                <EventFormModal
                    event={editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onSuccess={() => {
                        setEditingEvent(null);
                        fetchEvents();
                    }}
                />
            )}
        </div>
    );
}

// Event Form Modal
function EventFormModal({ event, onClose, onSuccess }) {
    const { language } = useLanguage();
    const isEdit = !!event;

    const [activeTab, setActiveTab] = useState('en');
    const [formData, setFormData] = useState({
        title: {
            en: event?.title?.en || '',
            te: event?.title?.te || '',
        },
        description: {
            en: event?.description?.en || '',
            te: event?.description?.te || '',
        },
        date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
        location: event?.location || '',
        status: event?.status || 'draft',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = '/api/admin/events';
            const method = isEdit ? 'PUT' : 'POST';
            const body = isEdit
                ? { eventId: event._id, ...formData }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                onSuccess();
            } else {
                setError(data.error || 'Failed to save event');
            }
        } catch (err) {
            setError('Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>{isEdit ? 'Edit Event' : 'Create New Event'}</h3>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.tabs}>
                        <button
                            type="button"
                            className={`${styles.tab} ${activeTab === 'en' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('en')}
                        >
                            English
                        </button>
                        <button
                            type="button"
                            className={`${styles.tab} ${activeTab === 'te' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('te')}
                        >
                            తెలుగు (Telugu)
                        </button>
                    </div>

                    {activeTab === 'en' && (
                        <>
                            <div className="form-group">
                                <label className="label">Title (English) *</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.title.en}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        title: { ...formData.title, en: e.target.value }
                                    })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Description (English) *</label>
                                <textarea
                                    className="input textarea"
                                    value={formData.description.en}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        description: { ...formData.description, en: e.target.value }
                                    })}
                                    required
                                    rows="5"
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'te' && (
                        <>
                            <div className="form-group">
                                <label className="label">Title (Telugu) *</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.title.te}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        title: { ...formData.title, te: e.target.value }
                                    })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Description (Telugu) *</label>
                                <textarea
                                    className="input textarea"
                                    value={formData.description.te}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        description: { ...formData.description, te: e.target.value }
                                    })}
                                    required
                                    rows="5"
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label className="label">Date *</label>
                        <input
                            type="date"
                            className="input"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Location *</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Status *</label>
                        <select
                            className="input"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : (isEdit ? 'Update Event' : 'Create Event')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
