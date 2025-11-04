const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Email options
  const mailOptions = {
    from: `eQuization <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    html: options.html || options.message
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  verification: (token, username) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(67deg, #36399a, #4d2f91); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .code { background: #363999; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 10px; letter-spacing: 5px; margin: 20px 0; }
        .button { display: inline-block; background: #ff5e94; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Welcome to eQuization!</h1>
        </div>
        <div class="content">
          <h2>Hello ${username}!</h2>
          <p>Thank you for registering with eQuization. To complete your registration, please verify your email address using the code below:</p>
          <div class="code">${token}</div>
          <p>This code will expire in 24 hours.</p>
          <p>If you didn't create an account with eQuization, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2024 eQuization. All rights reserved.</p>
          <p>The first Arab platform to create interactive quizzes through playing.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  resetPassword: (token, username) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(67deg, #36399a, #4d2f91); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .code { background: #d24747; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 10px; letter-spacing: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${username}!</h2>
          <p>We received a request to reset your password. Use the code below to reset your password:</p>
          <div class="code">${token}</div>
          <div class="warning">
            <strong>⚠️ Important:</strong> This code will expire in 30 minutes.
          </div>
          <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div class="footer">
          <p>© 2024 eQuization. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  welcomeEmail: (username) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(67deg, #36399a, #4d2f91); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ff5e94; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to eQuization!</h1>
        </div>
        <div class="content">
          <h2>Hello ${username}!</h2>
          <p>Your email has been verified successfully! You're now part of the eQuization community.</p>
          <h3>Get started with these features:</h3>
          <div class="feature">📝 Create interactive quizzes in minutes</div>
          <div class="feature">🎮 Host live quiz competitions</div>
          <div class="feature">📊 Track scores and performance</div>
          <div class="feature">🌍 Share quizzes with your community</div>
          <p>Start creating your first quiz now and experience the power of gamified learning!</p>
        </div>
        <div class="footer">
          <p>© 2024 eQuization. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

module.exports = { sendEmail, emailTemplates };
