import dbConnect from '@/lib/db';
import User from '@/models/User';
import Volunteer from '@/models/Volunteer';
import TeamMember from '@/models/TeamMember';
import Event from '@/models/Event';
import SiteSettings from '@/models/SiteSettings';
import styles from './unit.module.css';
import FacultyAdvisor from '@/components/FacultyAdvisor';

export const metadata = {
    title: 'Unit Details - NSS MJCET',
    description: 'Information about NSS Unit at MJCET',
};

export default async function UnitPage() {
    await dbConnect();

    // 1. Active Volunteers: Unique count of (Approved Volunteers + Team Members)
    const volunteerEmails = await Volunteer.find({ status: 'approved' }).distinct('email');
    const teamEmails = await TeamMember.find({}).distinct('email');
    const uniqueVolunteers = new Set([...volunteerEmails, ...teamEmails]);
    const totalVolunteers = uniqueVolunteers.size;

    // 2. Events Conducted
    const totalEvents = await Event.countDocuments({ status: 'published' });

    // 3. Service Hours (from settings)
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    const serviceHours = settings.serviceHours;

    const focusAreas = [
        "Community Service and Development",
        "Health and Hygiene Awareness",
        "Environmental Conservation",
        "Education and Literacy Programs",
        "Blood Donation Camps",
        "Disaster Management and Relief"
    ];

    return (
        <div className={styles.unitPage}>
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.heroTitle}>NSS Unit - MJCET</h1>
                    <p className={styles.heroSubtitle}>Muffakham Jah College of Engineering & Technology</p>
                </div>
            </section>

            {/* Faculty Advisor Section */}
            <FacultyAdvisor />

            <div className="container">
                <main className={styles.contentContainer}>
                    <div className={styles.mainCard}>
                        <h2 className={styles.cardTitle}>About Our Unit</h2>

                        <p className={styles.cardDescription}>
                            The NSS Unit at Muffakham Jah College of Engineering & Technology has been actively serving the community
                            since its establishment. Our unit is dedicated to fostering social responsibility and community engagement
                            among students through various service activities and programs.
                        </p>

                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>
                                    {totalVolunteers > 0 ? totalVolunteers + '+' : '0'}
                                </span>
                                <span className={styles.statLabel}>Active Volunteers</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>
                                    {totalEvents > 0 ? totalEvents + '+' : '0'}
                                </span>
                                <span className={styles.statLabel}>Events Conducted</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>
                                    {serviceHours > 0 ? serviceHours + '+' : '0'}
                                </span>
                                <span className={styles.statLabel}>Service Hours</span>
                            </div>
                        </div>

                        <h3 className={styles.sectionTitle}>Our Focus Areas</h3>
                        <div className={styles.focusList}>
                            {focusAreas.map((area, index) => (
                                <div key={index} className={styles.focusItem}>
                                    <span className={styles.focusIcon}>✦</span>
                                    {area}
                                </div>
                            ))}
                        </div>

                        <div className={styles.contactBox}>
                            <h4>Contact Information</h4>
                            <div className={styles.contactList}>
                                <div className={styles.contactItem}>
                                    <strong>Email:</strong>
                                    <span>nss@mjcet.ac.in</span>
                                </div>
                                <div className={styles.contactItem}>
                                    <strong>Phone:</strong>
                                    <span>+91 40 2354 2020</span>
                                </div>
                                <div className={styles.contactItem}>
                                    <strong>Address:</strong>
                                    <span>MJCET, Road No. 3, Banjara Hills, Hyderabad - 500034</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
