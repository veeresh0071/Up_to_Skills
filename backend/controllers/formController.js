const nodemailer = require('nodemailer');
const { fetchExternal, fetchInternal } = require('../utils/apiClient');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, 
    port: parseInt(process.env.EMAIL_PORT, 10),
    port: 587,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
    }
});

const sendContactEmail = async (req, res) => {
    const { name, email, inquiryType, message } = req.body;

    if (!name || !email || !inquiryType || !message) {
        return res.status(400).json({ 
            message: "All fields are required to send a message." 
        });
    }
    
    // The Email Content (Recipient is fixed to boobeshkaruna@gmail.com)
    const mailOptions = {
        from: `"${name}" <${email}>`, 
        to: "boobeshkaruna@gmail.com", 
        subject: `New ${inquiryType} Inquiry for Uptoskills`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #FF5733; border-bottom: 2px solid #FF5733; padding-bottom: 10px;">New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 3px solid #FF5733;">${message}</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully. Message ID: %s", info.messageId);

        return res.status(200).json({ 
            message: "Message sent successfully! We will be in touch soon.", 
            responseId: info.messageId 
        });
    } catch (error) {
        console.error("Nodemailer Error:", error);
        return res.status(500).json({ 
            message: "Failed to send message due to a server error. Please try again later.", 
            error: error.message 
        });
    }
};

module.exports = { sendContactEmail };