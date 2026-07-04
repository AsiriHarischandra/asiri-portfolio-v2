import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Escape HTML to prevent injection in email body
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br/>');
}

/**
 * Send a contact form email to the site owner.
 * All user-supplied strings are HTML-escaped before embedding.
 */
export async function sendContactEmail({ name, email, subject, message }) {
  const safeName    = escapeHtml(name);
  const safeEmail   = escapeHtml(email);
  const safeSubject = escapeHtml(subject || 'No subject');
  const safeMessage = escapeHtml(message);

  const { data, error } = await resend.emails.send({
    from: 'Portfolio <onboarding@resend.dev>',
    to: process.env.CONTACT_TO_EMAIL,
    subject: `Portfolio contact: ${safeSubject}`,
    html: `
      <div style="font-family:sans-serif; max-width:520px;">
        <h2 style="color:#10B981; margin-bottom:4px;">New message from ${safeName}</h2>
        <p style="color:#666; margin:0 0 16px;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="color:#666; margin:0 0 16px;"><strong>Subject:</strong> ${safeSubject}</p>
        <hr style="border:none; border-top:1px solid #eee;"/>
        <p style="line-height:1.7; color:#333;">${safeMessage}</p>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
  return data;
}
