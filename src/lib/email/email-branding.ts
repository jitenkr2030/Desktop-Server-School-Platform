import { z } from 'zod';

// ============================================
// EMAIL BRANDING SYSTEM
// Customizable email templates with tenant branding
// ============================================

export interface EmailBranding {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  fontFamily?: string;
  socialImageUrl?: string;
  footerText?: string;
  footerHtml?: string;
  headerHtml?: string;
  metaTitle?: string;
  metaDescription?: string;
  socialLinks?: SocialLink[];
  senderName?: string;
  senderEmail?: string;
  replyTo?: string;
  unsubscribeUrl?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'whatsapp';
  url: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preheader?: string;
  templateType: EmailTemplateType;
  content: string;
  variables: string[];
}

export type EmailTemplateType =
  | 'WELCOME'
  | 'PASSWORD_RESET'
  | 'EMAIL_VERIFICATION'
  | 'COURSE_ENROLLMENT'
  | 'COURSE_COMPLETION'
  | 'ASSESSMENT_GRADE'
  | 'ANNOUNCEMENT'
  | 'LIVE_SESSION_REMINDER'
  | 'PARENT_LINK_REQUEST'
  | 'PAYMENT_RECEIPT'
  | 'SUBSCRIPTION_EXPIRY'
  | 'GENERAL_NOTIFICATION';

// Default branding for tenants
export const defaultBranding: EmailBranding = {
  primaryColor: '#3b82f6',
  secondaryColor: '#1e40af',
  accentColor: '#f59e0b',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  socialLinks: [],
  senderName: 'INR99 Academy',
  senderEmail: 'noreply@inr99.academy',
  replyTo: 'support@inr99.academy',
};

// Generate branded email HTML
export function generateEmailHtml(
  content: string,
  branding: EmailBranding,
  options: {
    preheader?: string;
    title?: string;
    templateType?: EmailTemplateType;
  } = {}
): string {
  const { preheader, title, templateType } = options;

  const escapedPrimaryColor = escapeHtml(branding.primaryColor);
  const escapedSecondaryColor = escapeHtml(branding.secondaryColor);
  const escapedAccentColor = escapeHtml(branding.accentColor);
  const escapedFontFamily = escapeHtml(branding.fontFamily || 'Inter, sans-serif');
  const logoUrl = branding.logoUrl || branding.logoDarkUrl;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  
  ${branding.metaTitle ? `<title>${escapeHtml(branding.metaTitle)}</title>` : ''}
  ${branding.metaDescription ? `<meta name="description" content="${escapeHtml(branding.metaDescription)}">` : ''}
  
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  
  <style>
    /* Reset styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; height: 100% !important; }
    
    /* Typography */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    /* Responsive styles */
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .content-block { padding: 15px !important; }
      .button { width: 100% !important; }
      .social-icons { text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: ${escapedFontFamily};">
  <!-- Preview text -->
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${escapeHtml(preheader)}</div>` : ''}

  <!-- Email wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        
        <!-- Email container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="email-container" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${escapedPrimaryColor} 0%, ${escapedSecondaryColor} 100%); padding: 30px 40px; text-align: center;">
              ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(branding.senderName || 'Logo')}" style="max-height: 50px; max-width: 200px; display: inline-block;">` : `<h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">${escapeHtml(branding.senderName || 'INR99 Academy')}</h1>`}
            </td>
          </tr>

          <!-- Header HTML override -->
          ${branding.headerHtml ? `<tr><td>${branding.headerHtml}</td></tr>` : ''}

          <!-- Main content -->
          <tr>
            <td class="content-block" style="padding: 40px;">
              ${title ? `<h2 style="color: ${escapedSecondaryColor}; margin: 0 0 20px; font-size: 24px; font-weight: 600;">${escapeHtml(title)}</h2>` : ''}
              ${content}
            </td>
          </tr>

          <!-- CTA Button placeholder -->
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <!-- CTA button can be inserted here -->
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px 40px; border-top: 1px solid #e9ecef;">
              
              <!-- Footer text -->
              ${branding.footerText ? `<p style="color: #6b7280; margin: 0 0 15px; font-size: 14px; text-align: center;">${branding.footerText}</p>` : ''}
              <!-- Footer HTML override -->
              ${branding.footerHtml ? `<div style="margin-bottom: 15px;">${branding.footerHtml}</div>` : ''}

              <!-- Social links -->
              ${branding.socialLinks && branding.socialLinks.length > 0 ? `
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" class="social-icons" style="padding-bottom: 15px;">
                    ${branding.socialLinks.map(link => `
                      <a href="${escapeHtml(link.url)}" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                        <img src="/api/email/social/${link.platform}" alt="${link.platform}" width="24" height="24" style="vertical-align: middle;">
                      </a>
                    `).join('')}
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Legal links -->
              <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                ${branding.unsubscribeUrl ? `<a href="${escapeHtml(branding.unsubscribeUrl)}" style="color: ${escapedPrimaryColor}; text-decoration: underline;">Unsubscribe</a> | ` : ''}
                ${branding.privacyPolicyUrl ? `<a href="${escapeHtml(branding.privacyPolicyUrl)}" style="color: ${escapedPrimaryColor}; text-decoration: underline;">Privacy Policy</a> | ` : ''}
                ${branding.termsOfServiceUrl ? `<a href="${escapeHtml(branding.termsOfServiceUrl)}" style="color: ${escapedPrimaryColor}; text-decoration: underline;">Terms of Service</a>` : ''}
              </p>
              
              <!-- Copyright -->
              <p style="margin: 15px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
                &copy; ${new Date().getFullYear()} ${escapeHtml(branding.senderName || 'INR99 Academy')}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

        <!-- Email footer note -->
        <p style="margin-top: 20px; font-size: 12px; color: #9ca3af; text-align: center;">
          This email was sent to {{email}}. <br>
          <a href="{{webVersionUrl}}" style="color: ${escapedPrimaryColor};">View in browser</a>
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Generate plain text version
export function generateEmailText(
  content: string,
  branding: EmailBranding,
  options: {
    title?: string;
  } = {}
): string {
  const { title } = options;

  let text = '';
  
  if (title) {
    text += `${title}\n`;
    text += `${'='.repeat(title.length)}\n\n`;
  }
  
  // Convert HTML to plain text
  text += content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
  
  text += `\n\n---\n`;
  
  if (branding.footerText) {
    text += `${branding.footerText}\n\n`;
  }
  
  text += `This email was sent to {{email}}.\n`;
  
  if (branding.unsubscribeUrl) {
    text += `To unsubscribe, visit: ${branding.unsubscribeUrl}\n`;
  }
  
  text += `\n&copy; ${new Date().getFullYear()} ${branding.senderName || 'INR99 Academy'}. All rights reserved.`;
  
  return text;
}

// Replace template variables
export function replaceVariables(
  template: string,
  variables: Record<string, string | number | undefined>
): string {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    if (value !== undefined) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value));
    }
  }
  
  return result;
}

// Escape HTML special characters
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// ============================================
// EMAIL TEMPLATES
// ============================================

export const emailTemplates: Record<EmailTemplateType, EmailTemplate> = {
  WELCOME: {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to {{institutionName}}!',
    preheader: 'Thank you for joining us. Here\'s what you need to get started.',
    templateType: 'WELCOME',
    content: `
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Hi {{name}},
      </p>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Welcome to <strong>{{institutionName}}</strong>! We're thrilled to have you join our learning community.
      </p>
      <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
        Here are a few things you can do to get started:
      </p>
      <ul style="margin: 0 0 30px 20px; padding: 0; font-size: 16px; line-height: 1.8; color: #374151;">
        <li>Complete your profile</li>
        <li>Browse our courses</li>
        <li>Join a class (if applicable)</li>
        <li>Connect with teachers and classmates</li>
      </ul>
      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #374151;">
        If you have any questions, feel free to reach out to our support team.
      </p>
    `,
    variables: ['name', 'institutionName', 'email', 'loginUrl'],
  },
  PASSWORD_RESET: {
    id: 'password_reset',
    name: 'Password Reset',
    subject: 'Reset your password',
    preheader: 'We received a request to reset your password.',
    templateType: 'PASSWORD_RESET',
    content: `
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Hi {{name}},
      </p>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        We received a request to reset your password for your <strong>{{institutionName}}</strong> account.
      </p>
      <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
        Click the button below to reset your password:
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td align="center" style="padding-bottom: 30px;">
            <a href="{{resetUrl}}" style="display: inline-block; padding: 14px 32px; background-color: {{primaryColor}}; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
              Reset Password
            </a>
          </td>
        </tr>
      </table>
      <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #6b7280;">
        This link will expire in <strong>{{expiryHours}} hours</strong>.
      </p>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
        If you didn't request this password reset, please ignore this email or contact support if you have concerns.
      </p>
    `,
    variables: ['name', 'institutionName', 'resetUrl', 'expiryHours', 'primaryColor'],
  },
  EMAIL_VERIFICATION: {
    id: 'email_verification',
    name: 'Email Verification',
    subject: 'Verify your email address',
    preheader: 'Please verify your email to activate your account.',
    templateType: 'EMAIL_VERIFICATION',
    content: `
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Hi {{name}},
      </p>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Thank you for signing up for <strong>{{institutionName}}</strong>! Please verify your email address to activate your account.
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td align="center" style="padding-bottom: 30px;">
            <a href="{{verificationUrl}}" style="display: inline-block; padding: 14px 32px; background-color: {{primaryColor}}; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
              Verify Email
            </a>
          </td>
        </tr>
      </table>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
        This link will expire in <strong>{{expiryHours}} hours</strong>.
      </p>
    `,
    variables: ['name', 'institutionName', 'verificationUrl', 'expiryHours', 'primaryColor'],
  },
  COURSE_ENROLLMENT: {
    id: 'course_enrollment',
    name: 'Course Enrollment',
    subject: 'You\'ve been enrolled in {{courseName}}',
    preheader: 'Start your learning journey today!',
    templateType: 'COURSE_ENROLLMENT',
    content: `
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Hi {{name}},
      </p>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        You've been enrolled in <strong>{{courseName}}</strong>!
      </p>
      <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
        {{courseDescription}}
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td align="center" style="padding-bottom: 30px;">
            <a href="{{courseUrl}}" style="display: inline-block; padding: 14px 32px; background-color: {{primaryColor}}; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
              Start Learning
            </a>
          </td>
        </tr>
      </table>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
        Happy learning!<br>
        The {{institutionName}} Team
      </p>
    `,
    variables: ['name', 'courseName', 'courseDescription', 'courseUrl', 'institutionName', 'primaryColor'],
  },
  COURSE_COMPLETION: {
    id: 'course_completion',
    name: 'Course Completion',
    subject: 'Congratulations! You completed {{courseName}}',
    preheader: 'You\'ve successfully completed the course!',
    templateType: 'COURSE_COMPLETION',
    content: `
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Hi {{name}},
      </p>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        <strong>Congratulations!</strong> You've successfully completed <strong>{{courseName}}</strong>!
      </p>
      <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
        Your final score: <strong>{{score}}%</strong>
      </p>
      <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
        You can download your certificate from your dashboard.
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td align="center">
            <a href="{{certificateUrl}}" style="display: inline-block; padding: 14px 32px; background-color: {{primaryColor}}; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
              View Certificate
            </a>
          </td>
        </tr>
      </table>
    `,
    variables: ['name', 'courseName', 'score', 'certificateUrl', 'primaryColor'],
  },
  ASSESSMENT_GRADE: {
    id: 'assessment_grade',
    name: 'Assessment Grade',
    subject: 'Your grade for {{assessmentName}}',
    preheader: 'Your assessment has been graded.',
    templateType: 'ASSESSMENT_GRADE',
    content: `
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Hi {{name}},
      </p>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Your assessment <strong>{{assessmentName}}</strong> has been graded.
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6; border-radius: 8px; margin-bottom: 30px;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="padding-bottom: 10px; color: #6b7280; font-size: 14px;">Score</td>
                <td align="right" style="padding-bottom: 10px; font-size: 24px; font-weight: 700; color: {{primaryColor}};">{{score}}/{{total}}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 10px; color: #6b7280; font-size: 14px;">Percentage</td>
                <td align="right" style="padding-bottom: 10px; font-size: 18px; font-weight: 600;">{{percentage}}%</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px;">Grade</td>
                <td align="right" style="font-size: 18px; font-weight: 600;">{{grade}}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
        View detailed results: <a href="{{resultsUrl}}" style="color: {{primaryColor}};">Click here</a>
      </p>
    `,
    variables: ['name', 'assessmentName', 'score', 'total', 'percentage', 'grade', 'resultsUrl', 'primaryColor'],
  },
  ANNOUNCEMENT: {
    id: 'announcement',
    name: 'Announcement',
    subject: '{{announcementTitle}}',
    preheader: '{{announcementSummary}}',
    templateType: 'ANNOUNCEMENT',
    content: `
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        {{announcementContent}}
      </p>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
        Posted by {{authorName}} on {{postedDate}}
      </p>
    `,
    variables: ['announcementTitle', 'announcementSummary', 'announcementContent', 'authorName', 'postedDate'],
  },
  LIVE_SESSION_REMINDER: {
    id: 'live_session_reminder',
    name: 'Live Session Reminder',
    subject: 'Your live session "{{sessionTitle}}" starts soon!',
    preheader: 'Don\'t miss your upcoming live session.',
    templateType: 'LIVE_SESSION_REMINDER',
    content: `
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Hi {{name}},
      </p>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Your live session <strong>{{sessionTitle}}</strong> is starting soon!
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6; border-radius: 8px; margin-bottom: 30px;">
        <tr>
          <td style="padding: 20px;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
              <strong>Date:</strong> {{sessionDate}}
            </p>
            <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
              <strong>Time:</strong> {{sessionTime}}
            </p>
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              <strong>Instructor:</strong> {{instructorName}}
            </p>
          </td>
        </tr>
      </table>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td align="center">
            <a href="{{sessionUrl}}" style="display: inline-block; padding: 14px 32px; background-color: {{primaryColor}}; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
              Join Session
            </a>
          </td>
        </tr>
      </table>
    `,
    variables: ['name', 'sessionTitle', 'sessionDate', 'sessionTime', 'instructorName', 'sessionUrl', 'primaryColor'],
  },
  PARENT_LINK_REQUEST: {
    id: 'parent_link_request',
    name: 'Parent Link Request',
    subject: '{{studentName}} has linked you to their account',
    preheader: 'A student has requested to link your account.',
    templateType: 'PARENT_LINK_REQUEST',
    content: `
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Hi {{parentName}},
      </p>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        <strong>{{studentName}}</strong> has requested to link your account to theirs. This will allow you to monitor their progress and receive updates about their learning.
      </p>
      <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
        Relationship: {{relationshipType}}
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td align="center" style="padding-bottom: 15px;">
            <a href="{{acceptUrl}}" style="display: inline-block; padding: 14px 32px; background-color: {{primaryColor}}; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
              Accept Link Request
            </a>
          </td>
        </tr>
        <tr>
          <td align="center">
            <a href="{{rejectUrl}}" style="display: inline-block; padding: 14px 32px; background-color: #ef4444; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
              Decline
            </a>
          </td>
        </tr>
      </table>
    `,
    variables: ['parentName', 'studentName', 'relationshipType', 'acceptUrl', 'rejectUrl', 'primaryColor'],
  },
  PAYMENT_RECEIPT: {
    id: 'payment_receipt',
    name: 'Payment Receipt',
    subject: 'Payment receipt for {{paymentDescription}}',
    preheader: 'Your payment has been processed successfully.',
    templateType: 'PAYMENT_RECEIPT',
    content: `
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Hi {{name}},
      </p>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Thank you for your payment! Your transaction has been processed successfully.
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6; border-radius: 8px; margin-bottom: 30px;">
        <tr>
          <td style="padding: 20px;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
              <strong>Transaction ID:</strong> {{transactionId}}
            </p>
            <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
              <strong>Date:</strong> {{paymentDate}}
            </p>
            <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
              <strong>Description:</strong> {{paymentDescription}}
            </p>
            <p style="margin: 0; font-size: 24px; font-weight: 700; color: {{primaryColor}};">
              {{amount}}
            </p>
          </td>
        </tr>
      </table>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
        A detailed receipt has been sent to your registered email address.
      </p>
    `,
    variables: ['name', 'transactionId', 'paymentDate', 'paymentDescription', 'amount', 'primaryColor'],
  },
  SUBSCRIPTION_EXPIRY: {
    id: 'subscription_expiry',
    name: 'Subscription Expiry',
    subject: 'Your subscription expires soon',
    preheader: 'Renew your subscription to continue accessing all features.',
    templateType: 'SUBSCRIPTION_EXPIRY',
    content: `
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Hi {{name}},
      </p>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        Your <strong>{{subscriptionPlan}}</strong> subscription will expire on <strong>{{expiryDate}}</strong>.
      </p>
      <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
        Renew now to continue enjoying all features without interruption.
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td align="center">
            <a href="{{renewalUrl}}" style="display: inline-block; padding: 14px 32px; background-color: {{primaryColor}}; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
              Renew Now
            </a>
          </td>
        </tr>
      </table>
    `,
    variables: ['name', 'subscriptionPlan', 'expiryDate', 'renewalUrl', 'primaryColor'],
  },
  GENERAL_NOTIFICATION: {
    id: 'general_notification',
    name: 'General Notification',
    subject: '{{notificationTitle}}',
    preheader: '{{notificationSummary}}',
    templateType: 'GENERAL_NOTIFICATION',
    content: `
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
        {{notificationContent}}
      </p>
    `,
    variables: ['notificationTitle', 'notificationSummary', 'notificationContent'],
  },
};

// ============================================
// EMAIL SENDING UTILITIES
// ============================================

export interface EmailSendOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
  metadata?: Record<string, string>;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

// Validation schemas
export const emailValidation = {
  to: z.string().email().optional(),
  subject: z.string().min(1).max(200),
  html: z.string().min(1),
};

// Generate complete email with branding
export function generateEmail(
  templateType: EmailTemplateType,
  variables: Record<string, string | number | undefined>,
  branding: EmailBranding = defaultBranding
): { html: string; text: string; subject: string } {
  const template = emailTemplates[templateType];
  
  if (!template) {
    throw new Error(`Unknown template type: ${templateType}`);
  }
  
  // Replace variables in subject and content
  const subject = replaceVariables(template.subject, variables);
  const preheader = template.preheader ? replaceVariables(template.preheader, variables) : undefined;
  const content = replaceVariables(template.content, variables);
  const title = replaceVariables(template.name, variables);
  
  // Generate HTML and plain text versions
  const html = generateEmailHtml(content, branding, {
    preheader,
    title,
    templateType,
  });
  
  const text = generateEmailText(content, branding, { title });
  
  return { html, text, subject };
}

// Export types for external use
export type {
  EmailBranding,
  SocialLink,
  EmailTemplate,
  EmailTemplateType,
  EmailSendOptions,
  EmailAttachment,
};
