import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendVerificationEmailParams {
  tenantId: string
  tenantName: string
  recipientEmail: string
  notificationType: 'APPLICATION_RECEIVED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'REQUIRES_MORE_INFO' | 'REMINDER' | 'DEADLINE_WARNING' | 'FINAL_NOTICE'
  adminName?: string
  reviewNotes?: string | null
  deadline?: string | null
}

export async function sendVerificationEmail(params: SendVerificationEmailParams): Promise<{ success: boolean; error?: string }> {
  const { tenantId, tenantName, recipientEmail, notificationType, adminName, reviewNotes, deadline } = params

  const emailTemplates: Record<string, { subject: string; html: string }> = {
    APPLICATION_RECEIVED: {
      subject: `Verification Application Received - ${tenantName}`,
      html: getApplicationReceivedTemplate(tenantName)
    },
    UNDER_REVIEW: {
      subject: `Your Verification is Under Review - ${tenantName}`,
      html: getUnderReviewTemplate(tenantName)
    },
    APPROVED: {
      subject: `Verification Approved! - ${tenantName}`,
      html: getApprovedTemplate(tenantName, adminName || 'Administrator')
    },
    REJECTED: {
      subject: `Verification Application Update - ${tenantName}`,
      html: getRejectedTemplate(tenantName, reviewNotes || '')
    },
    REQUIRES_MORE_INFO: {
      subject: `Additional Information Required - ${tenantName}`,
      html: getRequiresMoreInfoTemplate(tenantName, reviewNotes || '')
    },
    REMINDER: {
      subject: `Reminder: Complete Your Verification - ${tenantName}`,
      html: getReminderTemplate(tenantName, deadline)
    },
    DEADLINE_WARNING: {
      subject: `URGENT: Verification Deadline Approaching - ${tenantName}`,
      html: getDeadlineWarningTemplate(tenantName, deadline)
    },
    FINAL_NOTICE: {
      subject: `FINAL NOTICE: Verification Deadline - ${tenantName}`,
      html: getFinalNoticeTemplate(tenantName, deadline)
    }
  }

  const template = emailTemplates[notificationType]
  if (!template) {
    return { success: false, error: 'Invalid notification type' }
  }

  try {
    await resend.emails.send({
      from: 'INR99 Academy <verification@inr99.academy>',
      to: [recipientEmail],
      subject: template.subject,
      html: template.html
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

function getApplicationReceivedTemplate(tenantName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Application Received</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px;">Dear <strong>${tenantName}</strong>,</p>
        <p>We have received your verification application. Our team will review your documents and get back to you within 3-5 business days.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #374151;">What's Next?</h3>
          <ol style="margin: 0; padding-left: 20px;">
            <li>Our verification team will review your submitted documents</li>
            <li>You will receive email updates on your application status</li>
            <li>Once approved, you will have full access to all platform features</li>
          </ol>
        </div>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The INR99 Academy Team</p>
      </div>
    </body>
    </html>
  `
}

function getUnderReviewTemplate(tenantName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Under Review</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px;">Dear <strong>${tenantName}</strong>,</p>
        <p>Good news! Your verification application is now <strong style="color: #2563eb;">under review</strong> by our team.</p>
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <p style="margin: 0; color: #1e40af;">We are carefully reviewing your documents. This process typically takes 2-3 business days.</p>
        </div>
        <p>You will receive another email once the review is complete.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The INR99 Academy Team</p>
      </div>
    </body>
    </html>
  `
}

function getApprovedTemplate(tenantName: string, adminName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">✓ Verification Approved!</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px;">Dear <strong>${tenantName}</strong>,</p>
        <p>Congratulations! Your verification application has been <strong style="color: #059669;">approved</strong> by our team.</p>
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0 0 10px 0; font-size: 18px; color: #047857;">You now have full access to all platform features!</p>
          <p style="margin: 0; color: #6b7280;">No restrictions - complete access granted</p>
        </div>
        <p>You can now access all premium features and services available on the platform.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">Reviewed by: ${adminName}<br>Best regards,<br>The INR99 Academy Team</p>
      </div>
    </body>
    </html>
  `
}

function getRejectedTemplate(tenantName: string, reviewNotes: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Application Not Approved</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px;">Dear <strong>${tenantName}</strong>,</p>
        <p>We regret to inform you that your verification application has <strong style="color: #dc2626;">not been approved</strong> at this time.</p>
        ${reviewNotes ? `
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="margin: 0 0 10px 0; color: #991b1b;">Reason for Rejection:</h3>
          <p style="margin: 0; color: #7f1d1d;">${reviewNotes}</p>
        </div>
        ` : ''}
        <p>If you believe this decision was made in error or if you have additional information to provide, please contact our support team.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The INR99 Academy Team</p>
      </div>
    </body>
    </html>
  `
}

function getRequiresMoreInfoTemplate(tenantName: string, reviewNotes: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Additional Information Required</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px;">Dear <strong>${tenantName}</strong>,</p>
        <p>Our verification team needs <strong style="color: #d97706;">additional information</strong> to complete your application review.</p>
        <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
          <h3 style="margin: 0 0 10px 0; color: #92400e;">Please provide:</h3>
          <p style="margin: 0; color: #78350f;">${reviewNotes}</p>
        </div>
        <p>Please log in to your verification portal and upload the requested documents.</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Best regards,<br>The INR99 Academy Team</p>
      </div>
    </body>
    </html>
  `
}

function getReminderTemplate(tenantName: string, deadline?: string | null): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Verification Reminder</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px;">Dear <strong>${tenantName}</strong>,</p>
        <p>This is a friendly reminder to complete your verification application.</p>
        ${deadline ? `
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Verification Deadline</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #2563eb;">${new Date(deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        ` : ''}
        <p>Please log in to your dashboard and complete your verification to avoid any service interruptions.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The INR99 Academy Team</p>
      </div>
    </body>
    </html>
  `
}

function getDeadlineWarningTemplate(tenantName: string, deadline?: string | null): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Deadline Approaching</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px;">Dear <strong>${tenantName}</strong>,</p>
        <p style="color: #d97706;"><strong>Your verification deadline is approaching!</strong></p>
        ${deadline ? `
        <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #fbbf24;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">Deadline</p>
          <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #d97706;">${new Date(deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        ` : ''}
        <p>Please complete your verification immediately to avoid feature restrictions.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The INR99 Academy Team</p>
      </div>
    </body>
    </html>
  `
}

function getFinalNoticeTemplate(tenantName: string, deadline?: string | null): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🚨 FINAL NOTICE</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px;">Dear <strong>${tenantName}</strong>,</p>
        <p style="color: #dc2626;"><strong>URGENT: Your verification deadline is TODAY!</strong></p>
        ${deadline ? `
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #fecaca;">
          <p style="margin: 0; font-size: 14px; color: #991b1b;">Final Deadline</p>
          <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #dc2626;">${new Date(deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        ` : ''}
        <p style="color: #dc2626;"><strong>If you do not complete your verification by the deadline, your access to platform features will be restricted.</strong></p>
        <p>Please complete your verification immediately to avoid service interruption.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The INR99 Academy Team</p>
      </div>
    </body>
    </html>
  `
}
