# NSS MJCET Admin Guide

Complete guide for managing the NSS MJCET website through the admin dashboard.

## 🔐 Logging In

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter your email and password
3. Click "Login"

**First Time Login:**
- Email: admin@nssmjcet.edu
- Password: (from your .env.local file)
- **Change your password immediately!**

## 👥 Managing Users

### Creating a New Member Account

1. Login as Super Admin
2. Go to **Admin Dashboard** → **Users**
3. Click **"Create New User"**
4. Fill in the form:
   - **Name:** Full name of the member
   - **Email:** Their email address (will be their username)
   - **Password:** Create a secure password for them
   - **Role:** Select "Member" (only super admin can create other admins)
   - **Position:** e.g., "Documentation Lead", "Media Team", "Core Member"

5. **Assign Permissions:**
   - **Page Access:** Check which pages they can access
   - **Module Permissions:** Select specific actions they can perform
     - Create Events
     - Edit Events
     - Delete Events
     - Upload to Gallery
     - etc.

6. Click **"Create User"**
7. Share the login credentials with the new member

### Editing User Permissions

1. Go to **Admin Dashboard** → **Users**
2. Find the user you want to edit
3. Click **"Edit"**
4. Update their:
   - Name
   - Position
   - Permissions (check/uncheck boxes)
   - Active status (to temporarily disable an account)
5. Click **"Save Changes"**

### Deleting a User

1. Go to **Admin Dashboard** → **Users**
2. Find the user
3. Click **"Delete"**
4. Confirm the deletion

**⚠️ Warning:** This action cannot be undone!

## 📅 Managing Events

### Creating an Event

1. Go to **Admin Dashboard** → **Events**
2. Click **"Create New Event"**
3. Fill in the bilingual form:

   **English Tab:**
   - Title (English)
   - Description (English)

   **Telugu Tab:**
   - Title (Telugu)
   - Description (Telugu)

4. Add event details:
   - Date and time
   - Location
   - Upload images (optional)

5. Set status:
   - **Draft:** Not visible to public
   - **Published:** Visible on website

6. Click **"Create Event"**

### Editing an Event

1. Go to **Admin Dashboard** → **Events**
2. Find the event
3. Click **"Edit"**
4. Make your changes
5. Click **"Update Event"**

### Deleting an Event

1. Find the event
2. Click **"Delete"**
3. Confirm

## 🎯 Managing Activities

Same process as Events:
1. Go to **Admin Dashboard** → **Activities**
2. Create/Edit/Delete activities
3. Fill in both English and Telugu content
4. Select category (Community Service, Health Camp, etc.)
5. Add participant count
6. Upload images

## 📢 Managing Announcements

### Creating an Announcement

1. Go to **Admin Dashboard** → **Announcements**
2. Click **"Create Announcement"**
3. Fill in:
   - Title (English & Telugu)
   - Content (English & Telugu)
   - Priority: Low, Medium, High, or Urgent
   - Expiry Date (optional - announcement will auto-hide after this date)
4. Click **"Create"**

**Priority Levels:**
- **Low:** Regular updates
- **Medium:** Important notices
- **High:** Very important (highlighted)
- **Urgent:** Critical announcements (top of page)

## 🖼️ Managing Gallery

### Uploading Images

1. Go to **Admin Dashboard** → **Gallery**
2. Click **"Upload Images"**
3. Select images from your computer
4. For each image:
   - Add caption (English & Telugu)
   - Select category (Events, Activities, Team, Awards, Other)
   - Link to event/activity (optional)
5. Click **"Upload"**

### Organizing Gallery

- Filter by category
- Search by caption
- Delete unwanted images
- Edit captions

## 📝 Editing Page Content

### Editing Static Pages (About, Unit Details, etc.)

1. Go to **Admin Dashboard** → **Content**
2. Select the page you want to edit
3. Switch between English and Telugu tabs
4. Edit the content:
   - Main title
   - Main content
   - Sections (if applicable)
5. Click **"Save Changes"**

**Pages you can edit:**
- About NSS
- Unit Details
- NSS Motto
- NSS Objectives

## 🌐 Bilingual Content Management

### How It Works

- All content has **two versions**: English and Telugu
- Users can switch language using the toggle in the navbar
- When you create/edit content, you must fill in BOTH languages

### Best Practices

1. **Always fill both languages** - Don't leave Telugu or English empty
2. **Keep translations accurate** - Use proper Telugu script
3. **Test both versions** - Switch language and verify content looks good
4. **Maintain consistency** - Same meaning in both languages

### Language Toggle

Users see a toggle button: **EN | తె**
- Clicking switches all content on the website
- Their preference is saved in browser

## 👤 Managing Your Profile

### As a Member

1. Login to your account
2. Go to **Member Dashboard** → **Profile**
3. You can only:
   - Update your profile picture
   - View your information
4. You **cannot** change:
   - Your name
   - Your email
   - Your permissions

**Note:** Only super admin can modify user details and permissions.

## 📊 Viewing Volunteer Registrations

1. Go to **Admin Dashboard** → **Volunteers**
2. View all registration submissions
3. Filter by:
   - Status (Pending, Approved, Rejected)
   - Department
   - Year
4. Actions:
   - Approve registration
   - Reject registration
   - Export to CSV

## 💬 Managing Contact Form Submissions

1. Go to **Admin Dashboard** → **Contact**
2. View all messages
3. Mark as:
   - New (unread)
   - Read
   - Responded
4. Reply to messages (opens email client)

## 🔒 Security Best Practices

### For Super Admin

1. **Use a strong password** - At least 12 characters, mix of letters, numbers, symbols
2. **Change default password** - Never use the initial password
3. **Don't share admin credentials** - Create separate accounts for team members
4. **Review permissions regularly** - Remove access when members leave
5. **Keep member accounts minimal** - Only give permissions they need

### For Members

1. **Don't share your password** - Keep it private
2. **Logout when done** - Especially on shared computers
3. **Report issues** - Contact admin if you see something wrong

## 🆘 Common Issues

### I forgot my password
- Contact the super admin to reset it
- They can update your password from the Users page

### I can't see a menu option
- You don't have permission for that module
- Contact super admin to request access

### My changes aren't showing on the website
- Check if you saved the changes
- For events/activities, check if status is "Published"
- Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)

### Images aren't uploading
- Check file size (max 5MB recommended)
- Use JPG, PNG, or WebP format
- Check your internet connection

### Bilingual content is mixed up
- Make sure you're editing the correct language tab
- English content goes in "English" tab
- Telugu content goes in "Telugu" (తెలుగు) tab

## 📞 Getting Help

If you encounter issues:

1. **Check this guide first**
2. **Try logging out and back in**
3. **Clear your browser cache**
4. **Contact the super admin**
5. **Email:** nss@mjcet.ac.in

## 🎯 Quick Reference

### Super Admin Can:
✅ Create/edit/delete users
✅ Manage all content
✅ Assign permissions
✅ Access all pages
✅ View all submissions

### Members Can:
✅ Edit assigned modules only
✅ Update own profile picture
✅ View their own content
❌ Cannot create users
❌ Cannot change permissions
❌ Cannot access admin-only pages

---

**Need more help?** Contact your NSS unit coordinator or the website administrator.
