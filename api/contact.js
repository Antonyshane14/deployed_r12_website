const nodemailer = require('nodemailer');
const { kv } = require('@vercel/kv');

const RATE_LIMIT = 5;        // max submissions per window
const RATE_WINDOW_SEC = 3600; // 1 hour

async function checkRateLimit(ip) {
    try {
        const key = `rl:contact:${ip}`;
        const count = await kv.incr(key);
        if (count === 1) await kv.expire(key, RATE_WINDOW_SEC);
        return count <= RATE_LIMIT;
    } catch {
        // Fail open — if KV is unavailable, don't block legitimate users
        return true;
    }
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function stripNewlines(str) {
    return String(str).replace(/[\r\n]/g, ' ');
}

function validateContactForm(body) {
    const errors = [];

    if (!body.name || body.name.length < 2 || body.name.length > 100) {
        errors.push('Name must be between 2 and 100 characters');
    }
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        errors.push('Please provide a valid email address');
    }
    if (!body.organization || body.organization.length < 2 || body.organization.length > 100) {
        errors.push('Organization must be between 2 and 100 characters');
    }
    if (!body.message || body.message.length < 10 || body.message.length > 2000) {
        errors.push('Message must be between 10 and 2000 characters');
    }
    if (body.phone && !/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(body.phone)) {
        errors.push('Please provide a valid phone number');
    }

    return errors;
}

const ALLOWED_ORIGIN = 'https://rapturetwelve.com';

module.exports = async (req, res) => {
    const origin = req.headers.origin;
    if (origin === ALLOWED_ORIGIN) {
        res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    }
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Vary', 'Origin');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
        return res.status(429).json({ success: false, message: 'Too many requests. Please wait before trying again.' });
    }

    try {
        const body = req.body;

        // Guard against missing or non-object body
        if (!body || typeof body !== 'object') {
            return res.status(400).json({ success: false, message: 'Invalid request body' });
        }

        const errors = validateContactForm(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Validation failed', errors });
        }

        const { name, email, organization, role, phone, message } = body;

        // Sanitize values used in email headers to prevent header injection
        const safeEmail = stripNewlines(email);
        const safeSubjectOrg = stripNewlines(organization);

        // Sanitize values interpolated into HTML to prevent HTML injection
        const eName = escHtml(name);
        const eEmail = escHtml(email);
        const eOrg = escHtml(organization);
        const eRole = role ? escHtml(role) : '';
        const ePhone = phone ? escHtml(phone) : '';
        const eMessage = escHtml(message).replace(/\n/g, '<br>');

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        const teamEmail = {
            from: process.env.GMAIL_USER,
            to: ['antonyshane@rapturetwelve.com', 'kruthinvinay@rapturetwelve.com'],
            replyTo: safeEmail,
            subject: `New Cybersecurity Inquiry - ${safeSubjectOrg}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
                        <h2 style="margin: 0;">RAPTURE TWELVE</h2>
                        <p style="margin: 5px 0 0 0; letter-spacing: 2px; font-size: 12px;">INFILTRATE • EXPLOIT • SECURE</p>
                    </div>
                    <div style="background: #fff; padding: 30px; border: 1px solid #ddd;">
                        <h3>New Contact Form Submission</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px 0;">${eName}</td></tr>
                            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${eEmail}">${eEmail}</a></td></tr>
                            <tr><td style="padding: 8px 0; font-weight: bold;">Organization:</td><td style="padding: 8px 0;">${eOrg}</td></tr>
                            ${eRole ? `<tr><td style="padding: 8px 0; font-weight: bold;">Role:</td><td style="padding: 8px 0;">${eRole}</td></tr>` : ''}
                            ${ePhone ? `<tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td style="padding: 8px 0;">${ePhone}</td></tr>` : ''}
                            <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message:</td><td style="padding: 8px 0;">${eMessage}</td></tr>
                        </table>
                        <p style="margin-top: 20px; font-size: 12px; color: #999;">Submitted on ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            `
        };

        const autoReply = {
            from: process.env.GMAIL_USER,
            to: safeEmail,
            subject: 'Thank you for contacting Rapture Twelve',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
                        <h2 style="margin: 0;">RAPTURE TWELVE</h2>
                        <p style="margin: 5px 0 0 0; letter-spacing: 2px; font-size: 12px;">INFILTRATE • EXPLOIT • SECURE</p>
                    </div>
                    <div style="background: #fff; padding: 30px; border: 1px solid #ddd;">
                        <h3>Thank you for your inquiry, ${eName}</h3>
                        <p>We have received your message regarding cybersecurity and AI solutions for ${eOrg}. Our team will review your requirements and respond within 24 hours.</p>
                        <div style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #000;">
                            <h4 style="margin: 0 0 8px 0;">Your Message:</h4>
                            <p style="margin: 0; color: #666;">${eMessage}</p>
                        </div>
                        <p>For urgent matters, contact our team directly:</p>
                        <p><strong>Antony Shane</strong> — <a href="mailto:antonyshane@rapturetwelve.com">antonyshane@rapturetwelve.com</a> | +91 97907 91723</p>
                        <p><strong>Vinay Venkat Kruthin</strong> — <a href="mailto:kruthinvinay@rapturetwelve.com">kruthinvinay@rapturetwelve.com</a> | +91 89251 26949</p>
                        <p style="margin-top: 30px; font-size: 14px; color: #666;">Best regards,<br>The Rapture Twelve Team</p>
                    </div>
                </div>
            `
        };

        await Promise.all([
            transporter.sendMail(teamEmail),
            transporter.sendMail(autoReply)
        ]);

        return res.status(200).json({ success: true, message: 'Message sent successfully! We will contact you within 24 hours.' });

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({ success: false, message: 'Failed to send message. Please try again or contact us directly.' });
    }
};
