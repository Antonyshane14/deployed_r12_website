# Rapture Twelve - Premium Cybersecurity Website

A premium, defense-grade website for Rapture Twelve (R12) - Infiltrate Exploit Secure. Built with modern web technologies and optimized for enterprise and defense contractor audiences.

## 🚀 Features

- **Premium Design**: Sleek black & gray aesthetic matching R12 logo
- **Responsive**: Optimized for desktop, tablet, and mobile devices
- **Performance**: Optimized with lazy loading, compression, and caching
- **Animations**: Premium GSAP-powered animations and micro-interactions
- **Security**: Rate limiting, input validation, and secure form handling
- **Contact System**: Production-ready email integration with multiple providers
- **SEO Optimized**: Semantic HTML, meta tags, and structured data

## 🛠 Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)**: Premium interactions and animations
- **GSAP**: Professional-grade animations and scroll triggers
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **Nodemailer**: Email handling with multiple provider support
- **Multer**: File upload handling
- **Security**: Helmet, CORS, rate limiting, input validation

## 📁 Project Structure

```
ANTONY_WEBSITE/
├── index.html              # Main website file
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── app.js              # Main JavaScript file
├── assets/                 # Images, videos, and media
│   ├── r12-logo.svg        # Main logo (placeholder)
│   ├── r12-logo-large.svg  # Large hero logo (placeholder)
│   ├── hero-background.webm # Hero video background
│   ├── antony-shane.jpg    # CEO photo
│   ├── vinay-kruthin.jpg   # COO photo
│   ├── partners/           # Partner logo directory
│   └── certifications/     # Certification badges
├── api/                    # Backend API
│   ├── server.js           # Express server
│   ├── package.json        # Node.js dependencies
│   └── .env.example        # Environment configuration template
└── README.md               # This file
```

## 🚀 Quick Start

### Frontend Setup

1. **Serve the website** using any static file server:

```bash
# Using Python 3
python -m http.server 3000

# Using Node.js (install http-server globally)
npm install -g http-server
http-server -p 3000

# Using PHP
php -S localhost:3000
```

2. **Open your browser** and navigate to `http://localhost:3000`

### Backend Setup (Optional - for contact form)

1. **Navigate to the API directory**:
```bash
cd api
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment**:
```bash
cp .env.example .env
```

4. **Edit `.env` file** with your email service configuration:

**For SendGrid (Recommended)**:
```env
NODE_ENV=production
FROM_EMAIL=noreply@rapturetwelve.com
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

**For Gmail**:
```env
NODE_ENV=production
FROM_EMAIL=noreply@gmail.com
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_specific_password
```

**For Custom SMTP**:
```env
NODE_ENV=production
FROM_EMAIL=noreply@rapturetwelve.com
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASS=your_password
```

5. **Start the server**:
```bash
npm start
```

6. **Update contact form URL** in `js/app.js`:
```javascript
// Change this line in the contact form submission
const response = await fetch('http://localhost:3000/api/contact', {
```

## 📧 Email Service Configuration

### SendGrid (Recommended for Production)

1. Create a [SendGrid account](https://sendgrid.com/)
2. Generate an API key
3. Add to `.env`: `SENDGRID_API_KEY=your_api_key`

### Gmail Configuration

1. Enable 2-factor authentication
2. Generate an app-specific password
3. Add credentials to `.env`

### AWS SES

1. Set up AWS SES in your region
2. Verify your domain/email addresses
3. Add AWS credentials to `.env`

### Custom SMTP

Configure with your email provider's SMTP settings.

## 🎨 Asset Replacement

### Required Assets

Replace these placeholder files with actual assets:

1. **Logo Files**:
   - `assets/r12-logo.jpg` - Navigation logo (40px height) ✅ UPDATED
   - `assets/r12-logo-large.jpg` - Hero logo (120px height) ✅ UPDATED

2. **Photos**:
   - `assets/antony-shane.jpg` - CEO photo (400x400px recommended)
   - `assets/vinay-kruthin.jpg` - COO photo (400x400px recommended)

3. **Videos**:
   - `assets/hero-background.webm` - Hero background video (WebM format) ✅ UPDATED
   - `assets/hero-background.mp4` - Hero background video (MP4 fallback) ✅ UPDATED
   - `assets/ai-soc-demo.webm` - Innovation showcase video

4. **Case Study Images**:
   - `assets/case-study-1.jpg` - Defense infrastructure (600x400px)
   - `assets/case-study-2.jpg` - AI-powered SOC (600x400px)
   - `assets/case-study-3.jpg` - Government security (600x400px)

5. **Partner Logos** (in `assets/partners/`):
   - partner-1.png through partner-6.png

6. **Certifications** (in `assets/certifications/`):
   - iso-27001.png
   - soc2.png
   - nist.png
   - fedramp.png

### Image Specifications

- **Format**: WebP for best performance, PNG/JPG as fallback
- **Resolution**: High-DPI ready (2x resolution recommended)
- **Optimization**: Compress images for web delivery
- **Naming**: Use descriptive, lowercase names with hyphens

## 🎬 Animation Configuration

### GSAP Timeline Customization

Modify animation timings in `js/app.js`:

```javascript
// Hero animation timing
const heroTl = gsap.timeline({ delay: 0.5 });
heroTl
    .to("#hero-logo", { duration: 1.2, ... })  // Logo reveal
    .to("#hero-headline .headline-line", { duration: 0.8, stagger: 0.2, ... })  // Headline
    // ... customize timings as needed
```

### Scroll Trigger Adjustments

```javascript
ScrollTrigger.create({
    trigger: element,
    start: "top 80%",  // Adjust trigger point
    end: "bottom 20%",
    // ... configuration
});
```

## 🔧 Customization

### Color Scheme

Update CSS variables in `css/styles.css`:

```css
:root {
    --primary-black: #000000;
    --primary-white: #FFFFFF;
    --primary-gray: #B0B0B0;
    --silver: #C0C0C0;
    --steel: #8A8A8A;
    /* Modify colors as needed */
}
```

### Typography

Change fonts by updating Google Fonts import:

```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Content Updates

1. **Company Information**: Update contact details in HTML
2. **Services**: Modify service descriptions and icons
3. **Case Studies**: Replace with actual project results
4. **Team Bios**: Update leadership information

## 🚀 Deployment

### Frontend Deployment

**Netlify**:
1. Connect your repository
2. Build command: (none needed)
3. Publish directory: `/`

**Vercel**:
1. Import project
2. Framework preset: Other
3. Output directory: `./`

**AWS S3 + CloudFront**:
1. Upload files to S3 bucket
2. Configure CloudFront distribution
3. Set up custom domain

### Backend Deployment

**Heroku**:
```bash
# In api/ directory
heroku create rapture-twelve-api
git subtree push --prefix api heroku main
```

**AWS Lambda** (Serverless):
1. Use Serverless Framework
2. Configure serverless.yml
3. Deploy with `serverless deploy`

**DigitalOcean App Platform**:
1. Connect repository
2. Configure build settings
3. Set environment variables

## 🔒 Security Considerations

### Production Security

1. **Environment Variables**: Never commit `.env` files
2. **HTTPS**: Always use SSL certificates in production
3. **Rate Limiting**: Configure appropriate limits for your traffic
4. **Input Validation**: Enabled by default, review rules in server.js
5. **File Uploads**: Limited to 10MB with type validation
6. **CORS**: Configure allowed origins for your domain

### Contact Form Security

- Rate limiting: 5 submissions per 15 minutes per IP
- File type validation: PDF, DOC, DOCX, TXT, images only
- Input sanitization: All form inputs are validated and escaped
- Email validation: Proper email format checking

## 📊 Performance Optimization

### Implemented Optimizations

1. **Image Lazy Loading**: Images load as they enter viewport
2. **Video Optimization**: WebM format with MP4 fallback
3. **CSS Critical Path**: Inline critical styles
4. **JavaScript**: Throttled scroll events, debounced resize
5. **Caching**: Service worker ready for implementation

### Further Optimizations

1. **CDN**: Serve assets from CDN
2. **Image Optimization**: Use WebP format with fallbacks
3. **Minification**: Minify CSS/JS for production
4. **Compression**: Enable gzip/brotli compression

## 🧪 Testing

### Frontend Testing

```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# Accessibility testing
npm install -g axe-cli
axe http://localhost:3000
```

### Backend Testing

```bash
cd api
npm test
```

## 📞 Support

For technical support or questions:

- **Email**: antonyshane@rapturetwelve.com
- **Phone**: +91 97907 91723

## 📄 License

Copyright © 2025 Rapture Twelve. All rights reserved.

---

## 🎯 Post-Launch Checklist

- [ ] Replace all placeholder assets with actual files
- [ ] Configure email service (SendGrid/Gmail/AWS SES)
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Configure domain and SSL certificate
- [ ] Test contact form functionality
- [ ] Perform security audit
- [ ] Run performance tests
- [ ] Set up monitoring and error tracking
- [ ] Configure backup systems
- [ ] Document maintenance procedures

---

**Built with precision for Rapture Twelve - Infiltrate Exploit Secure**
