'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../admin-content.module.css';

export default function TeamPage() {
    const { data: session } = useSession();
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: 'Core',
        position: '',
        email: '',
        linkedin: '',
        github: '',
        image: null
    });

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await fetch('/api/admin/team');
            const data = await res.json();
            if (data.team) {
                setTeam(data.team);
            }
        } catch (error) {
            console.error('Failed to fetch team', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            if (editingMember) data.append('id', editingMember._id);
            data.append('name', formData.name);
            data.append('role', formData.role);
            data.append('position', formData.position);
            data.append('email', formData.email);
            data.append('linkedin', formData.linkedin || '');
            data.append('github', formData.github || '');
            if (formData.image) data.append('image', formData.image);

            const method = editingMember ? 'PUT' : 'POST';
            const res = await fetch('/api/admin/team', {
                method: method,
                body: data,
            });

            if (res.ok) {
                closeModal();
                fetchTeam();
            } else {
                alert('Failed to save team member');
            }
        } catch (error) {
            console.error('Error saving team member', error);
            alert('Error saving team member');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this member?")) return;
        try {
            const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchTeam();
            else alert("Failed to delete");
        } catch (e) {
            alert("Error deleting");
        }
    }

    const openModal = (member = null) => {
        setEditingMember(member);
        setFormData({
            name: member?.name || '',
            role: member?.role || 'Core',
            position: member?.position || '',
            email: member?.email || '',
            linkedin: member?.linkedin || '',
            github: member?.github || '',
            image: null
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div>
            <div className={styles.pageHeader}>
                <h2 className={styles.sectionTitle}>Team Management</h2>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => openModal()}>+ Add Member</button>
            </div>

            <div className={styles.card}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Image</th>
                                <th className={styles.th}>Name</th>
                                <th className={styles.th}>Category</th>
                                <th className={styles.th}>Position</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className={styles.emptyState}>No team members found</td>
                                </tr>
                            ) : (
                                team.map((member) => (
                                    <tr key={member._id} className={styles.tr}>
                                        <td className={styles.td}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: '#eee' }}>
                                                {member.image ? (
                                                    <img src={member.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '12px' }}>{member.name.charAt(0)}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className={styles.td}>{member.name}</td>
                                        <td className={styles.td}>
                                            <span className={`${styles.badge} ${styles.badgeInfo}`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className={styles.td}>{member.position || '-'}</td>
                                        <td className={styles.td}>
                                            <button
                                                className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`}
                                                style={{ marginRight: '8px' }}
                                                onClick={() => openModal(member)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={`${styles.btn} ${styles.btnSm} ${styles.btnDanger}`}
                                                style={{ backgroundColor: '#ff4d4f', color: 'white', borderColor: 'transparent' }}
                                                onClick={() => handleDelete(member._id)}
                                            >
                                                Delete
                                            </button>
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
                            <h3 className={styles.modalTitle}>{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
                            <button className={styles.closeBtn} onClick={closeModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Name *</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Email</label>
                                        <input
                                            type="email"
                                            className={styles.input}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Category *</label>
                                        <select
                                            className={styles.select}
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                                        >
                                            <option value="GBS">General Body Secretary (GBS)</option>
                                            <option value="Execom">Executive Committee (Execom)</option>
                                            <option value="Core">Core Member</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Position</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="e.g. Activity Lead"
                                            value={formData.position}
                                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>LinkedIn URL</label>
                                        <input
                                            type="url"
                                            className={styles.input}
                                            placeholder="https://linkedin.com/in/username"
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>GitHub URL</label>
                                        <input
                                            type="url"
                                            className={styles.input}
                                            placeholder="https://github.com/username"
                                            value={formData.github}
                                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Photo</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className={styles.input}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                                        />
                                        {editingMember && editingMember.image && (
                                            <div style={{ marginTop: '5px', fontSize: '12px', color: '#aaa' }}>Current: Has image</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={closeModal}>Cancel</button>
                                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
