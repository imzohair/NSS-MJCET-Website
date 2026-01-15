'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../admin-content.module.css';

export default function GalleryPage() {
    const { data: session } = useSession();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        image: null,
        caption: { en: '', te: '' },
        category: 'other',
        eventId: ''
    });

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const res = await fetch('/api/admin/gallery');
            const data = await res.json();
            if (data.images) {
                setImages(data.images);
            }
        } catch (error) {
            console.error('Failed to fetch gallery', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('image', formData.image);
            data.append('captionEn', formData.caption.en);
            data.append('captionTe', formData.caption.te);
            data.append('category', formData.category);
            if (formData.eventId) data.append('eventId', formData.eventId);

            const res = await fetch('/api/admin/gallery', {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                closeModal();
                fetchGallery();
            } else {
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image', error);
            alert('Error uploading image');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        try {
            const res = await fetch(`/api/admin/gallery?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchGallery();
            } else {
                alert('Failed to delete image');
            }
        } catch (error) {
            console.error('Error deleting image', error);
        }
    };

    const openModal = () => {
        setFormData({
            image: null,
            caption: { en: '', te: '' },
            category: 'other',
            eventId: ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div>
            <div className={styles.pageHeader}>
                <h2 className={styles.sectionTitle}>Gallery Management</h2>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={openModal}>
                    <span>+</span> Add Image
                </button>
            </div>

            <div className={styles.grid}>
                {images.length === 0 ? (
                    <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>No images in gallery</div>
                ) : (
                    images.map((item) => (
                        <div key={item._id} className={styles.gridItem}>
                            <img src={item.imageUrl} alt={item.caption.en || 'Gallery Image'} className={styles.gridImage} />
                            <div className={styles.gridContent}>
                                <div className={styles.badge} style={{ marginBottom: '0.5rem' }}>{item.category}</div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.caption.en || 'No caption'}</p>
                                <p style={{ fontSize: '0.75rem', color: '#666' }}>{item.caption.te}</p>
                            </div>
                            <div className={styles.gridActions}>
                                <button
                                    className={`${styles.btn} ${styles.btnSm} ${styles.btnDanger}`}
                                    onClick={() => handleDelete(item._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Add Gallery Image</h3>
                            <button className={styles.closeBtn} onClick={closeModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGrid}>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label className={styles.label}>Image File</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className={styles.input}
                                            required
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Category</label>
                                        <select
                                            className={styles.select}
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="events">Events</option>
                                            <option value="team">Team</option>
                                            <option value="awards">Awards</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Caption (English)</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={formData.caption.en}
                                            onChange={(e) => setFormData({ ...formData, caption: { ...formData.caption, en: e.target.value } })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Caption (Telugu)</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={formData.caption.te}
                                            onChange={(e) => setFormData({ ...formData, caption: { ...formData.caption, te: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={closeModal}>Cancel</button>
                                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Upload Image</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
