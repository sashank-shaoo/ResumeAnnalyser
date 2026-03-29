export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          name: process.env.EMAIL_FROM_NAME || 'ResumeHub',
          email: process.env.FROM_EMAIL
        },
        to: [
          { email: to }
        ],
        subject: subject,
        htmlContent: html
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Brevo API Error:', errData);
      throw new Error('Could not send email via Brevo API');
    }

    const data = await response.json();
    console.log('Email sent via API:', data.messageId);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Could not send email');
  }
};
