const nodemailer = require('nodemailer');

// ── Create reusable transporter ───────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

// ── Send email (skipped in dev if EMAIL_ENABLED=false) ────────────────────────
const sendEmail = async (options) => {
  if (process.env.EMAIL_ENABLED === 'false') {
    console.log(`[Email] ⚠️  Email disabled. Would send to: ${options.email} | Subject: ${options.subject}`);
    return { messageId: 'dev-mode' };
  }

  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from:    `eQuization <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
    to:      options.email,
    subject: options.subject,
    html:    options.html || options.message
  });

  console.log(`[Email] ✅ Sent: ${info.messageId}`);
  return info;
};

// ── HTML Email Templates ──────────────────────────────────────────────────────
const emailTemplates = {

  verification: (token, username) => `
    <!DOCTYPE html><html dir="rtl" lang="ar">
    <head><meta charset="UTF-8">
    <style>
      body{font-family:Cairo,Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px}
      .wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden}
      .header{background:linear-gradient(135deg,#363999,#4d2f91);color:#fff;padding:40px;text-align:center}
      .header h1{margin:0;font-size:28px}
      .body{padding:30px;color:#333}
      .code{background:#363999;color:#fff;font-size:36px;font-weight:700;padding:20px;text-align:center;border-radius:10px;letter-spacing:8px;margin:25px 0}
      .footer{background:#f9f9f9;padding:20px;text-align:center;font-size:12px;color:#888}
    </style></head>
    <body>
    <div class="wrap">
      <div class="header"><h1>🎓 eQuization</h1><p>أول منصة عربية لإنشاء الاختبارات التفاعلية</p></div>
      <div class="body">
        <h2>مرحباً ${username}!</h2>
        <p>شكراً لتسجيلك في eQuization. يرجى تأكيد بريدك الإلكتروني باستخدام الكود التالي:</p>
        <div class="code">${token}</div>
        <p>هذا الكود صالح لمدة <strong>24 ساعة</strong>.</p>
        <p>إذا لم تقم بإنشاء هذا الحساب فتجاهل هذا البريد.</p>
      </div>
      <div class="footer">© 2024 eQuization – جميع الحقوق محفوظة</div>
    </div>
    </body></html>
  `,

  resetPassword: (token, username) => `
    <!DOCTYPE html><html dir="rtl" lang="ar">
    <head><meta charset="UTF-8">
    <style>
      body{font-family:Cairo,Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px}
      .wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden}
      .header{background:linear-gradient(135deg,#d24747,#a03030);color:#fff;padding:40px;text-align:center}
      .header h1{margin:0;font-size:28px}
      .body{padding:30px;color:#333}
      .code{background:#d24747;color:#fff;font-size:36px;font-weight:700;padding:20px;text-align:center;border-radius:10px;letter-spacing:8px;margin:25px 0}
      .warning{background:#fff3cd;border-right:4px solid #ffc107;padding:15px;border-radius:5px;margin:20px 0}
      .footer{background:#f9f9f9;padding:20px;text-align:center;font-size:12px;color:#888}
    </style></head>
    <body>
    <div class="wrap">
      <div class="header"><h1>🔑 eQuization</h1><p>إعادة تعيين كلمة المرور</p></div>
      <div class="body">
        <h2>مرحباً ${username}</h2>
        <p>تلقينا طلباً لإعادة تعيين كلمة مرورك. استخدم الكود التالي:</p>
        <div class="code">${token}</div>
        <div class="warning">⚠️ هذا الكود صالح لمدة <strong>30 دقيقة</strong> فقط.</div>
        <p>إذا لم تطلب إعادة تعيين كلمة المرور فتجاهل هذا البريد.</p>
      </div>
      <div class="footer">© 2024 eQuization – جميع الحقوق محفوظة</div>
    </div>
    </body></html>
  `,

  welcomeEmail: (username) => `
    <!DOCTYPE html><html dir="rtl" lang="ar">
    <head><meta charset="UTF-8">
    <style>
      body{font-family:Cairo,Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px}
      .wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden}
      .header{background:linear-gradient(135deg,#363999,#ff5e94);color:#fff;padding:40px;text-align:center}
      .header h1{margin:0;font-size:28px}
      .body{padding:30px;color:#333}
      .btn{display:inline-block;background:#ff5e94;color:#fff;padding:14px 35px;text-decoration:none;border-radius:25px;font-size:18px;margin:20px 0}
      .footer{background:#f9f9f9;padding:20px;text-align:center;font-size:12px;color:#888}
    </style></head>
    <body>
    <div class="wrap">
      <div class="header"><h1>🎉 أهلاً بك في eQuization!</h1></div>
      <div class="body">
        <h2>مرحباً ${username}!</h2>
        <p>تم التحقق من بريدك الإلكتروني بنجاح. يمكنك الآن الاستمتاع بكل مميزات المنصة.</p>
        <ul>
          <li>إنشاء اختبارات تفاعلية في دقائق</li>
          <li>استضافة جلسات تنافسية لحتى 250 لاعباً</li>
          <li>متابعة إحصائياتك وتقدمك</li>
        </ul>
        <center><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="btn">ابدأ الآن</a></center>
      </div>
      <div class="footer">© 2024 eQuization – جميع الحقوق محفوظة</div>
    </div>
    </body></html>
  `
};

module.exports = { sendEmail, emailTemplates };
