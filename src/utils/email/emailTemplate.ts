// utils/emailTemplates.ts

// 1. Initial verification email (on register)
export const verificationEmailTemplate = (
  verificationToken: string,
  userName?: string,
): { subject: string; html: string; text: string } => {
  const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}`;

  return {
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome${userName ? `, ${userName}` : ""}! 👋</h2>
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
      Welcome${userName ? `, ${userName}` : ""}!
      
      Thank you for registering! Please verify your email by visiting: ${verificationUrl}
      
      This link will expire in 24 hours.
      If you didn't create an account, please ignore this email.
    `,
  };
};

// 2. Resend verification email (when user requests new one)
export const resendVerificationEmailTemplate = (
  verificationToken: string,
  userName?: string,
): { subject: string; html: string; text: string } => {
  const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}`;

  return {
    subject: "Verify Your Email - New Link",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification${userName ? ` for ${userName}` : ""}</h2>
        <p>You requested a new verification link. Click the button below to verify your email:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This link will expire in 24 hours. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
    text: `
      You requested a new verification link.
      
      Please verify your email by visiting: ${verificationUrl}
      
      This link will expire in 24 hours.
      If you didn't request this, please ignore this email.
    `,
  };
};

// 3. Password reset email
export const passwordResetEmailTemplate = (
  resetToken: string,
  userName?: string,
): { subject: string; html: string; text: string } => {
  const resetUrl = `${process.env.BACKEND_URL}/api/auth/reset-password?token=${resetToken}`;

  return {
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi${userName ? ` ${userName}` : ""},</p>
        <p>You requested to reset your password. Click the button below:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #DC2626; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
    text: `
      You requested to reset your password.
      
      Reset your password by visiting: ${resetUrl}
      
      This link will expire in 1 hour.
      If you didn't request this, please ignore this email.
    `,
  };
};
