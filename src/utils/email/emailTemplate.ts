// utils/email/emailTemplates.ts

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
        <div style="background-color: #FFF; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">👋 Welcome${userName ? `, ${userName}` : ""}!</h2>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #374151;">
            Thank you for registering! Please verify your email address to get started.
          </p>
          
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600;">
            Verify Email Address
          </a>
          
          <p style="font-size: 14px; color: #6B7280; margin-top: 20px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #4F46E5; word-break: break-all; font-size: 14px; background-color: #EEF2FF; padding: 10px; border-radius: 4px;">
            ${verificationUrl}
          </p>
          
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
          
          <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
            This link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
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
        <div style="background-color: #4F46E5; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">📧 Email Verification</h2>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #374151;">Hi${userName ? ` ${userName}` : ""},</p>
          
          <p style="font-size: 16px; color: #374151;">
            You requested a new verification link. Click the button below to verify your email address.
          </p>
          
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600;">
            Verify Email Address
          </a>
          
          <p style="font-size: 14px; color: #6B7280; margin-top: 20px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #4F46E5; word-break: break-all; font-size: 14px; background-color: #EEF2FF; padding: 10px; border-radius: 4px;">
            ${verificationUrl}
          </p>
          
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
          
          <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
            This link will expire in 24 hours. If you didn't request this, please ignore this email.
          </p>
        </div>
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
        <div style="background-color: #DC2626; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">🔐 Password Reset Request</h2>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #374151;">Hi${userName ? ` ${userName}` : ""},</p>
          
          <p style="font-size: 16px; color: #374151;">
            You requested to reset your password. Click the button below to create a new password.
          </p>
          
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #DC2626; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600;">
            Reset Password
          </a>
          
          <p style="font-size: 14px; color: #6B7280; margin-top: 20px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #DC2626; word-break: break-all; font-size: 14px; background-color: #FEE2E2; padding: 10px; border-radius: 4px;">
            ${resetUrl}
          </p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 4px;">
            <p style="margin: 0; color: #92400E; font-size: 14px;">
              <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact support if you have concerns.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
          
          <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
            This link will expire in 15 minutes. For your security, this is a one-time use link.
          </p>
        </div>
      </div>
    `,
    text: `
      Password Reset Request
      
      Hi${userName ? ` ${userName}` : ""},
      
      You requested to reset your password. Reset your password by visiting: ${resetUrl}
      
      This link will expire in 15 minutes.
      
      Security Notice: If you didn't request this, please ignore this email or contact support.
    `,
  };
};

// 4. Password reset success confirmation
export const passwordResetSuccessTemplate = (
  userName?: string,
): { subject: string; html: string; text: string } => {
  return {
    subject: "Password Reset Successful",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10B981; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">✓ Password Reset Successful</h2>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #374151;">Hi${userName ? ` ${userName}` : ""},</p>
          
          <p style="font-size: 16px; color: #374151;">
            Your password has been successfully reset. You can now log in to your account with your new password.
          </p>
          
          <a href="${process.env.FRONTEND_URL}/login" 
             style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600;">
            Log In to Your Account
          </a>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 4px;">
            <p style="margin: 0; color: #92400E; font-size: 14px;">
              <strong>⚠️ Security Notice:</strong> If you didn't make this change, please contact our support team immediately.
            </p>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            Reset Date: ${new Date().toLocaleString("en-US", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>
          
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
          
          <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
            This is an automated message. If you have questions, please contact our support team.
          </p>
        </div>
      </div>
    `,
    text: `
      Password Reset Successful
      
      Hi${userName ? ` ${userName}` : ""},
      
      Your password has been successfully reset. You can now log in to your account with your new password.
      
      Log in here: ${process.env.FRONTEND_URL}/login
      
      Security Notice: If you didn't make this change, please contact our support team immediately.
      
      Reset Date: ${new Date().toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      })}
    `,
  };
};
