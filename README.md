# The Alabaster Jar - Website

A professional website for The Alabaster Jar, a 501(c)(3) international nonprofit organization working to end human trafficking and restore survivors through the healing love of Christ.

## 📁 Project Structure

```
alabaster-jar-website/
├── index.html              # Homepage
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── main.js             # JavaScript functionality
├── pages/
│   ├── about.html          # About page with mission, vision, values
│   ├── programs.html       # Programs overview
│   ├── cyber-intelligence.html  # Cyber Intelligence operations
│   ├── storefront.html     # Book House & Coffee Place
│   ├── get-involved.html   # Volunteer, pray, partner, advocate
│   ├── donate.html         # Donation page
│   └── contact.html        # Contact form and information
├── images/                 # Image assets (add your images here)
└── README.md               # This file
```

## 🖥️ Local Development

### Option 1: Simple Method (No Installation Required)

1. **Download/Extract** the website folder to your computer
2. **Open** `index.html` directly in your web browser (double-click)
3. **Edit** any HTML, CSS, or JS file with a text editor:
   - **Recommended editors:** Visual Studio Code, Sublime Text, Atom, or even Notepad++
   - Changes are visible immediately when you refresh your browser

### Option 2: Local Development Server (Recommended)

Using a local server provides better functionality (some features require a server):

**Using Python (built into Mac/Linux):**
```bash
# Navigate to the website folder
cd alabaster-jar-website

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then open http://localhost:8000 in your browser.

**Using Node.js:**
```bash
# Install a simple server globally
npm install -g serve

# Navigate to folder and run
cd alabaster-jar-website
serve
```

**Using Visual Studio Code:**
1. Install the "Live Server" extension
2. Right-click on `index.html` → "Open with Live Server"
3. Auto-refreshes when you save changes!

## ✏️ How to Edit Content

### Editing Text Content

1. Open the relevant HTML file in your text editor
2. Find the section you want to edit
3. Modify the text between HTML tags
4. Save the file and refresh your browser

**Example:** To change the homepage hero text, open `index.html` and find:
```html
<h1>The <span class="highlight">Alabaster</span> Jar</h1>
```

### Editing Styles

1. Open `css/styles.css`
2. Find the relevant section (use Ctrl+F/Cmd+F to search)
3. Modify colors, fonts, spacing, etc.
4. Save and refresh

**Key CSS Variables (at the top of styles.css):**
```css
:root {
  --color-rose: #C41E3A;        /* Primary brand color */
  --color-gold: #D4A574;         /* Secondary accent */
  --color-cream: #FDF8F3;        /* Light background */
  --color-charcoal: #2C2C2C;     /* Dark text */
}
```

### Adding Images

1. Place your images in the `images/` folder
2. Reference them in HTML:
```html
<img src="images/your-image.jpg" alt="Description of image">
```
3. For pages in the `pages/` folder, use:
```html
<img src="../images/your-image.jpg" alt="Description of image">
```

### Adding New Pages

1. Copy an existing page as a template
2. Update the navigation links in ALL pages to include the new page
3. Update the page content

---

## ☁️ Deploying to Google Cloud

### Option 1: Google Cloud Storage (Static Website Hosting) - Recommended

This is the simplest and most cost-effective option for a static website.

#### Prerequisites
- Google Cloud account (create at https://cloud.google.com)
- Google Cloud SDK installed (https://cloud.google.com/sdk/docs/install)

#### Step-by-Step Deployment

**1. Create a Google Cloud Project**
```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (replace YOUR_PROJECT_ID)
gcloud projects create YOUR_PROJECT_ID --name="Alabaster Jar Website"

# Set as active project
gcloud config set project YOUR_PROJECT_ID

# Enable billing (required for hosting)
# Do this in the Cloud Console: https://console.cloud.google.com/billing
```

**2. Create a Cloud Storage Bucket**
```bash
# Create bucket (name must be globally unique)
# For a custom domain, bucket name must match your domain
gsutil mb -l US gs://www.thealabasterjar.org

# Or for testing with a unique name:
gsutil mb -l US gs://alabaster-jar-website-$(date +%s)
```

**3. Configure for Website Hosting**
```bash
# Set the main page and error page
gsutil web set -m index.html -e pages/404.html gs://YOUR_BUCKET_NAME

# Make the bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://YOUR_BUCKET_NAME
```

**4. Upload Your Website**
```bash
# Navigate to your website folder
cd alabaster-jar-website

# Upload all files
gsutil -m cp -r . gs://YOUR_BUCKET_NAME

# Set correct content types
gsutil -m setmeta -h "Content-Type:text/html" gs://YOUR_BUCKET_NAME/*.html
gsutil -m setmeta -h "Content-Type:text/html" gs://YOUR_BUCKET_NAME/pages/*.html
gsutil -m setmeta -h "Content-Type:text/css" gs://YOUR_BUCKET_NAME/css/*.css
gsutil -m setmeta -h "Content-Type:application/javascript" gs://YOUR_BUCKET_NAME/js/*.js
```

**5. Access Your Website**
- Default URL: `https://storage.googleapis.com/YOUR_BUCKET_NAME/index.html`
- Or configure a custom domain (see below)

#### Updating the Website
```bash
# Upload changed files only
gsutil -m rsync -r . gs://YOUR_BUCKET_NAME

# Or upload everything fresh
gsutil -m cp -r . gs://YOUR_BUCKET_NAME
```

---

### Option 2: Firebase Hosting (Google's CDN)

Firebase offers faster global delivery and HTTPS by default.

**1. Install Firebase CLI**
```bash
npm install -g firebase-tools
```

**2. Initialize Firebase**
```bash
# Login
firebase login

# Initialize in your website folder
cd alabaster-jar-website
firebase init hosting
```
- Select "Create a new project" or use existing
- Set public directory to `.` (current directory)
- Configure as single-page app: **No**
- Don't overwrite index.html

**3. Deploy**
```bash
firebase deploy
```

**4. Your site is live!**
- Firebase provides a URL like: `https://your-project.web.app`

---

### Option 3: Google Cloud Run (For Dynamic Features)

Use this if you later add server-side features.

**1. Create a Dockerfile**
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**2. Build and Deploy**
```bash
# Build container
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/alabaster-jar-website

# Deploy to Cloud Run
gcloud run deploy alabaster-jar-website \
  --image gcr.io/YOUR_PROJECT_ID/alabaster-jar-website \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🌐 Custom Domain Setup

### For Cloud Storage:

1. Verify domain ownership in Google Search Console
2. Create a CNAME record pointing to `c.storage.googleapis.com`
3. Bucket name must match your domain exactly (e.g., `www.thealabasterjar.org`)

### For Firebase:

1. In Firebase Console → Hosting → Add custom domain
2. Follow the verification steps
3. Add the provided DNS records to your domain registrar

---

## 🔧 Customization Checklist

Before going live, update these items:

- [ ] **Logo:** Add your logo image to `images/` and update references
- [ ] **Contact Info:** Update email addresses, phone, address in `contact.html`
- [ ] **Social Links:** Update social media URLs in all page footers
- [ ] **Donation Form:** Integrate with your payment processor (Stripe, PayPal, etc.)
- [ ] **Analytics:** Add Google Analytics tracking code
- [ ] **EIN Number:** Update the tax ID on the donate page
- [ ] **Images:** Add real photos to replace placeholder content
- [ ] **Favicon:** Replace the emoji favicon with your logo

### Adding Google Analytics

Add this before `</head>` in all HTML files:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Integrating a Donation Processor

For the donation form, you can integrate:
- **Stripe:** https://stripe.com/docs/payments/checkout
- **PayPal:** https://developer.paypal.com/docs/checkout/
- **Square:** https://developer.squareup.com/
- **Donorbox:** https://donorbox.org (nonprofit-focused, easy embed)

---

## 📱 Mobile Responsiveness

The website is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

Test on multiple devices before going live!

---

## 🆘 Troubleshooting

**Images not loading?**
- Check file paths (case-sensitive on servers!)
- Use relative paths: `../images/photo.jpg` from pages folder

**Styles not updating?**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check for CSS syntax errors

**JavaScript not working?**
- Open browser developer tools (F12) → Console tab
- Look for error messages

**Deployment issues?**
- Verify you're authenticated: `gcloud auth list`
- Check project is set: `gcloud config get-value project`
- Ensure billing is enabled for the project

---

## 📞 Support

For technical questions about this website template, please refer to the documentation above.

For questions about The Alabaster Jar organization, visit the contact page or email info@thealabasterjar.org.

---

## 📄 License

This website template was created for The Alabaster Jar nonprofit organization. 

© 2025 The Alabaster Jar. All rights reserved.
