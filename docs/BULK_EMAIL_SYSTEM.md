# Bulk Email System Documentation

## Overview

The SoNoBrokers Bulk Email System is a comprehensive email composition and sending platform built with React and integrated with Resend for reliable email delivery. This system enables sending professional bulk emails with customizable templates, CC/BCC support, and advanced features for investor outreach, marketing campaigns, and general communications.

## Features

### 🎯 **Core Capabilities**
- **Bulk Email Sending**: Send emails to multiple recipients efficiently
- **Individual/Group Sending**: Choose between individual emails or group emails
- **CC/BCC Support**: Add carbon copy and blind carbon copy recipients
- **Template System**: Pre-built and customizable email templates
- **Variable Substitution**: Dynamic content with template variables
- **Email Preview**: See exactly how emails will appear to recipients
- **Email Tracking**: Optional open tracking via Resend
- **Professional Templates**: Ready-to-use templates for various use cases

### 📧 **Email Templates**

#### 1. **Investor Pre-Seed Template**
- **Purpose**: Fundraising outreach for pre-seed rounds
- **Variables**: `investor_name`, `company_name`, `amount_seeking`, `use_of_funds`
- **Content**: SoNoBrokers pitch with market opportunity, solution, and funding request

#### 2. **Marketing Newsletter Template**
- **Purpose**: Monthly updates and marketing communications
- **Variables**: `recipient_name`, `month`, `year`, `key_updates`
- **Content**: Platform updates, market insights, and community growth

#### 3. **Custom Template**
- **Purpose**: Flexible template for any use case
- **Variables**: `recipient_name`, `subject_variable`, `custom_content`
- **Content**: Customizable content with SoNoBrokers branding

## Access and Usage

### **URL Access**
```
http://localhost:3000/email-composer
```

### **Navigation**
The email composer is accessible directly via the `/email-composer` route and provides a tabbed interface for email composition.

## User Interface

### **Tab Structure**

#### 1. **Compose Tab**
- **Template Selection**: Choose from available email templates
- **Subject Line**: Customize email subject with variable support
- **Template Variables**: Fill in dynamic content fields
- **Email Content**: Rich text editor for email body
- **Sending Options**: Configure individual/group sending and tracking

#### 2. **Templates Tab**
- **Template Browser**: View all available email templates
- **Template Details**: See template variables and content preview
- **Template Selection**: Load templates into the composer

#### 3. **Recipients Tab**
- **Add Recipients**: Input email addresses with optional names
- **CC Recipients**: Add carbon copy recipients
- **BCC Recipients**: Add blind carbon copy recipients
- **Recipient Management**: View, edit, and remove recipients

#### 4. **Preview Tab**
- **Email Preview**: See processed email with variables filled
- **Header Information**: View To, CC, BCC, and Subject
- **Content Preview**: See final email content as recipients will receive it

## Technical Implementation

### **Component Structure**
```
src/components/email/SendEmailResend.tsx
├── EmailTemplate interface
├── EmailRecipient interface
├── EmailComposition interface
└── SendEmailResend component
```

### **API Integration**
```
src/app/api/send-email/route.ts
├── POST endpoint for sending emails
├── GET endpoint for API status
└── Resend integration
```

### **Key Functions**

#### **Template Processing**
```typescript
const processTemplate = (content: string, variables: Record<string, string>) => {
  let processed = content
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{ ${key} }}`, 'g')
    processed = processed.replace(regex, value)
  })
  return processed
}
```

#### **Email Sending**
```typescript
const sendEmails = async () => {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: recipients,
      cc: ccRecipients,
      bcc: bccRecipients,
      subject: processedSubject,
      html: processedContent,
      sendIndividually: true,
      trackOpens: true
    })
  })
}
```

## Configuration

### **Environment Variables**
```env
RESEND_API_KEY=re_your_resend_api_key_here
```

### **Email Settings**
- **From Address**: `SoNoBrokers <support@sonobrokers.com>`
- **Tracking Tags**: `campaign: bulk-email`
- **Content Types**: HTML and plain text
- **Text Fallback**: Automatically generated from HTML content if not provided

## API Endpoints

### **POST /api/send-email**
Send bulk emails via Resend API.

**Request Body:**
```json
{
  "to": ["email1@example.com", "email2@example.com"],
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"],
  "subject": "Email Subject",
  "html": "<p>HTML content</p>",
  "text": "Plain text content",
  "sendIndividually": true,
  "trackOpens": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully sent 2 emails",
  "results": [
    {
      "recipient": "user1@example.com",
      "success": true,
      "id": "email_id_123"
    },
    {
      "recipient": "user2@example.com",
      "success": true,
      "id": "email_id_456"
    }
  ],
  "errors": [],
  "stats": {
    "total": 2,
    "successful": 2,
    "failed": 0
  }
}
```

### **GET /api/send-email**
Check API status and configuration.

**Response:**
```json
{
  "status": "ok",
  "service": "Resend Email API (via ResendService)",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "configured": true
}
```

## Best Practices

### **Email Composition**
1. **Use Templates**: Start with pre-built templates for consistency
2. **Fill Variables**: Ensure all template variables are populated
3. **Preview First**: Always preview emails before sending
4. **Test Recipients**: Use test email addresses for initial testing

### **Recipient Management**
1. **Validate Emails**: Ensure all email addresses are valid
2. **Use BCC**: Use BCC for privacy when sending to multiple recipients
3. **Individual Sending**: Use individual sending for personalized emails
4. **Batch Size**: Consider breaking large recipient lists into smaller batches

### **Content Guidelines**
1. **Professional Tone**: Maintain professional communication standards
2. **Clear Subject**: Use descriptive and engaging subject lines
3. **Personalization**: Utilize template variables for personalization
4. **Call to Action**: Include clear next steps or contact information

## Troubleshooting

### **Common Issues**

#### **Email Not Sending**
- Verify RESEND_API_KEY is set correctly
- Check recipient email format
- Ensure subject and content are provided
- Review API response for error details

#### **Template Variables Not Working**
- Verify variable names match template exactly
- Use correct syntax: `{{ variable_name }}`
- Ensure all required variables are filled

#### **Recipients Not Added**
- Check email format includes @ symbol
- Verify email addresses are valid
- Use format: `email@domain.com Name` for named recipients

### **Error Messages**
- `Recipients (to) field is required and must be a non-empty array`: Add at least one recipient
- `Subject and content are required`: Fill in subject and email content
- `Internal server error`: Check API key, network connection, and server logs
- Individual email failures are tracked in the `errors` array of the response

## Error Handling

### **Individual Email Failures**
When `sendIndividually` is enabled (default), the system handles individual email failures gracefully:
- Failed emails are logged and tracked in the `errors` array
- Successful emails continue to be sent even if some fail
- Each result includes recipient, success status, and error details if applicable

### **Bulk Email Failures**
When `sendIndividually` is disabled, a single failure affects the entire batch:
- All recipients are included in a single email
- Failure affects all recipients at once
- Error details are provided for troubleshooting

### **API Error Responses**
```json
{
  "error": "Internal server error",
  "message": "Detailed error message from Resend API"
}
```

## Security Considerations

1. **API Key Protection**: Keep RESEND_API_KEY secure and never expose in client code
2. **Email Validation**: Validate all email addresses before sending
3. **Rate Limiting**: Be mindful of Resend API rate limits
4. **Privacy**: Use BCC for recipient privacy in bulk emails
5. **Content Filtering**: Ensure email content complies with anti-spam regulations

## Future Enhancements

### **Planned Features**
- **Email Scheduling**: Schedule emails for future delivery
- **Template Editor**: Visual template creation and editing
- **Analytics Dashboard**: Email performance tracking and analytics
- **Contact Lists**: Saved recipient groups and contact management
- **A/B Testing**: Subject line and content testing capabilities
- **Email Automation**: Triggered email sequences and workflows

### **Integration Opportunities**
- **CRM Integration**: Connect with customer relationship management systems
- **Analytics Integration**: Enhanced tracking with Google Analytics
- **Database Integration**: Store email history and recipient data
- **Webhook Support**: Real-time email event notifications

## Support

For technical support or feature requests related to the bulk email system:

- **Email**: support@sonobrokers.com
- **Documentation**: Review this guide and API documentation
- **Testing**: Use the `/email-composer` interface for testing
- **Logs**: Check browser console and server logs for debugging

---

**Last Updated**: January 2025
**Version**: 1.1
**Component**: SendEmailResend
**API**: /api/send-email
**Service**: ResendService (lib/resend.ts)
