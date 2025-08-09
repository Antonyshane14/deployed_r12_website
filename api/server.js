// Backend API for Rapture Twelve Contact Form
// Node.js/Express endpoint with email functionality

const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
}));

// Rate limiting
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many contact form submissions, please try again later.'
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow only specific file types
        const allowedTypes = /pdf|doc|docx|txt|jpg|jpeg|png/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, DOCX, TXT, and image files are allowed'));
        }
    }
});

// Email transporter configuration
const createTransporter = () => {
    // Configure based on your email service
    // Example configurations for different services:

    // For SendGrid
    if (process.env.SENDGRID_API_KEY) {
        return nodemailer.createTransporter({
            service: 'SendGrid',
            auth: {
                user: 'apikey',
                pass: process.env.SENDGRID_API_KEY
            }
        });
    }

    // For Gmail (requires app password)
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
        return nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
    }

    // For AWS SES
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        return nodemailer.createTransporter({
            SES: new AWS.SES({
                apiVersion: '2010-12-01',
                region: process.env.AWS_REGION || 'us-east-1'
            })
        });
    }

    // For Postmark
    if (process.env.POSTMARK_API_KEY) {
        return nodemailer.createTransporter({
            service: 'Postmark',
            auth: {
                user: process.env.POSTMARK_API_KEY,
                pass: process.env.POSTMARK_API_KEY
            }
        });
    }

    // Default SMTP configuration
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'localhost',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// Validation rules
const contactValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .escape(),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('organization')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Organization must be between 2 and 100 characters')
        .escape(),
    body('role')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Role must be less than 100 characters')
        .escape(),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message must be between 10 and 2000 characters')
        .escape()
];

// Contact form endpoint
app.post('/api/contact', contactLimiter, upload.single('attachment'), contactValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, organization, role, phone, message } = req.body;
        const attachment = req.file;

        // Create email transporter
        const transporter = createTransporter();

        // Verify transporter configuration
        await transporter.verify();

        // Email content for Rapture Twelve team
        const teamEmailContent = {
            from: process.env.FROM_EMAIL || 'noreply@rapturetwelve.com',
            to: ['antonyshane@rapturetwelve.com', 'kruthinvinay@rapturetwelve.com'],
            subject: `New Cybersecurity Inquiry - ${organization}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                    <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
                        <h2 style="margin: 0; font-family: 'Orbitron', monospace;">RAPTURE TWELVE</h2>
                        <p style="margin: 5px 0 0 0; letter-spacing: 2px; font-size: 12px;">INFILTRATE • EXPLOIT • SECURE</p>
                    </div>
                    
                    <div style="background: #fff; padding: 30px; border: 1px solid #ddd;">
                        <h3 style="color: #333; margin-top: 0;">New Contact Form Submission</h3>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Organization:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${organization}</td>
                            </tr>
                            ${role ? `
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Role:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${role}</td>
                            </tr>
                            ` : ''}
                            ${phone ? `
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Message:</td>
                                <td style="padding: 10px 0;">${message.replace(/\n/g, '<br>')}</td>
                            </tr>
                        </table>
                        
                        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid #000;">
                            <p style="margin: 0; font-size: 14px; color: #666;">
                                Submitted on ${new Date().toLocaleString()} from IP: ${req.ip}
                            </p>
                        </div>
                    </div>
                </div>
            `,
            attachments: attachment ? [{
                filename: attachment.originalname,
                content: attachment.buffer
            }] : []
        };

        // Auto-reply email for the sender
        const autoReplyContent = {
            from: process.env.FROM_EMAIL || 'noreply@rapturetwelve.com',
            to: email,
            subject: 'Thank you for contacting Rapture Twelve',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                    <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
                        <h2 style="margin: 0; font-family: 'Orbitron', monospace;">RAPTURE TWELVE</h2>
                        <p style="margin: 5px 0 0 0; letter-spacing: 2px; font-size: 12px;">INFILTRATE • EXPLOIT • SECURE</p>
                    </div>
                    
                    <div style="background: #fff; padding: 30px; border: 1px solid #ddd;">
                        <h3 style="color: #333; margin-top: 0;">Thank you for your inquiry, ${name}</h3>
                        
                        <p>We have received your message regarding cybersecurity and AI solutions for ${organization}. Our team will review your requirements and respond within 24 hours.</p>
                        
                        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-left: 4px solid #000;">
                            <h4 style="margin: 0 0 10px 0; color: #333;">Your Message:</h4>
                            <p style="margin: 0; color: #666;">${message.replace(/\n/g, '<br>')}</p>
                        </div>
                        
                        <p>For urgent matters, please contact our leadership team directly:</p>
                        
                        <div style="display: flex; gap: 20px; margin: 20px 0;">
                            <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 5px;">
                                <h4 style="margin: 0 0 10px 0; color: #333;">Antony Shane</h4>
                                <p style="margin: 0; color: #666; font-size: 14px;">Founder & CEO</p>
                                <p style="margin: 5px 0 0 0;">
                                    <a href="tel:+919790791723" style="color: #000; text-decoration: none;">+91 97907 91723</a><br>
                                    <a href="mailto:antonyshane@rapturetwelve.com" style="color: #000; text-decoration: none;">antonyshane@rapturetwelve.com</a>
                                </p>
                            </div>
                            
                            <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 5px;">
                                <h4 style="margin: 0 0 10px 0; color: #333;">Vinay Venkat Kruthin</h4>
                                <p style="margin: 0; color: #666; font-size: 14px;">Co-Founder & COO</p>
                                <p style="margin: 5px 0 0 0;">
                                    <a href="tel:+918925126949" style="color: #000; text-decoration: none;">+91 89251 26949</a><br>
                                    <a href="mailto:kruthinvinay@rapturetwelve.com" style="color: #000; text-decoration: none;">kruthinvinay@rapturetwelve.com</a>
                                </p>
                            </div>
                        </div>
                        
                        <p style="margin-top: 30px; font-size: 14px; color: #666;">
                            Best regards,<br>
                            The Rapture Twelve Team<br>
                            Defense-grade cybersecurity and AI solutions
                        </p>
                    </div>
                </div>
            `
        };

        // Send emails
        await Promise.all([
            transporter.sendMail(teamEmailContent),
            transporter.sendMail(autoReplyContent)
        ]);

        // Log successful submission (replace with your logging system)
        console.log(`Contact form submission from ${name} (${email}) at ${organization}`);

        res.json({
            success: true,
            message: 'Message sent successfully! We will contact you within 24 hours.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again or contact us directly.'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Rapture Twelve Contact API'
    });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('API Error:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 10MB.'
            });
        }
    }
    
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Rapture Twelve API server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
