// utils/emailTemplates.ts
export const verificationEmailTemplate = (
  email: string,
  verificationToken: string,
): { subject: string; html: string; text: string } => {
  const verificationUrl = `${process.env.BACKEND_URL}/verify-email?token=${verificationToken}`;

  return {
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This link will expire in 24 hours. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
    text: `
      Thank you for registering! 
      
      Please verify your email by visiting: ${verificationUrl}
      
      This link will expire in 24 hours.
      If you didn't create an account, please ignore this email.
    `,
  };
};
