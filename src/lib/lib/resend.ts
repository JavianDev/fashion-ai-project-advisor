// TODO: Create email templates
// import InvoiceTemplate from '@/components/_archive/email-templates/Invoice'
// import ThankYouTemplate from '@/components/_archive/email-templates/ThanksYouTemplate'
import config from '@/config'
// Note: Prisma removed, using .NET Web API instead
import { Resend } from 'resend'

class ResendService {
	private resend = new Resend(process.env.RESEND_API_KEY)

	public async sendThanksYouEmail(toMail: string) {
		const { data, error } = await this.resend.emails.send({
			from: config.resend.fromAdmin,
			to: [toMail],
			replyTo: config.resend.forwardRepliesTo,
			subject: config.resend.subjects.thankYou,
			html: `<h1>Thank You!</h1><p>Thank you for your business, ${toMail}!</p>`,
		})

		if (error) {
			throw error
		}

		return data
	}

	public async sendInvoice(toMail: string, renderData: any) {
		const { data, error } = await this.resend.emails.send({
			from: config.resend.fromAdmin,
			to: [toMail],
			replyTo: config.resend.forwardRepliesTo,
			subject: 'Invoice: ' + renderData.id,
			html: `<h1>Invoice</h1><p>Invoice ID: ${renderData.id}</p><p>Thank you for your business!</p>`,
		})

		if (error) {
			throw error
		}

		return data
	}

	public async addNewEmailAddress(email: string) {
		const audience = await this.upsertAudience()
		return this.resend.contacts.create({
			email,
			unsubscribed: false,
			audienceId: audience.resend_id,
		})
	}

	public async sendConciergeInquiry(toEmail: string, subject: string, content: string) {
		const { data, error } = await this.resend.emails.send({
			from: config.resend.fromAdmin,
			to: [toEmail],
			replyTo: config.resend.forwardRepliesTo,
			subject: subject,
			text: content,
		})

		if (error) {
			throw error
		}

		return data
	}

	public async sendConciergeConfirmation(toEmail: string, name: string, packageName: string) {
		const { data, error } = await this.resend.emails.send({
			from: config.resend.fromAdmin,
			to: [toEmail],
			replyTo: config.resend.forwardRepliesTo,
			subject: 'Thank you for your Concierge Services inquiry',
			text: `Dear ${name},

Thank you for your interest in our ${packageName} service. We have received your inquiry and our concierge team will contact you within 24 hours to discuss your property sale needs.

In the meantime, if you have any urgent questions, please don't hesitate to contact us at support@sonobrokers.com.

Best regards,
The SoNoBrokers Concierge Team

---
This is an automated confirmation email from SoNoBrokers.`,
		})

		if (error) {
			throw error
		}

		return data
	}

	public async sendBulkEmail(emailData: {
		to: string[]
		cc?: string[]
		bcc?: string[]
		subject: string
		html: string
		text?: string
		sendIndividually?: boolean
		trackOpens?: boolean
	}) {
		const {
			to,
			cc = [],
			bcc = [],
			subject,
			html,
			text,
			sendIndividually = true,
			trackOpens = true
		} = emailData

		const results = []
		const errors = []

		if (sendIndividually) {
			// Send individual emails to each recipient
			for (const recipient of to) {
				try {
					const emailPayload: any = {
						from: 'SoNoBrokers <support@sonobrokers.com>',
						to: [recipient],
						subject,
						html,
						text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
					}

					// Add CC and BCC if provided
					if (cc.length > 0) emailPayload.cc = cc
					if (bcc.length > 0) emailPayload.bcc = bcc

					// Add tracking if enabled
					if (trackOpens) {
						emailPayload.tags = [
							{
								name: 'campaign',
								value: 'bulk-email'
							}
						]
					}

					const result = await this.resend.emails.send(emailPayload)

					if (result.error) {
						console.error(`Failed to send email to ${recipient}:`, result.error)
						errors.push({
							recipient,
							success: false,
							error: result.error.message || 'Unknown error'
						})
					} else {
						console.log(`Email sent successfully to ${recipient}, ID: ${result.data?.id}`)
						results.push({
							recipient,
							success: true,
							id: result.data?.id
						})
					}
				} catch (error) {
					console.error(`Failed to send email to ${recipient}:`, error)
					errors.push({
						recipient,
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error'
					})
				}
			}
		} else {
			// Send one email to all recipients
			try {
				const emailPayload: any = {
					from: 'SoNoBrokers <support@sonobrokers.com>',
					to,
					subject,
					html,
					text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
				}

				// Add CC and BCC if provided
				if (cc.length > 0) emailPayload.cc = cc
				if (bcc.length > 0) emailPayload.bcc = bcc

				// Add tracking if enabled
				if (trackOpens) {
					emailPayload.tags = [
						{
							name: 'campaign',
							value: 'bulk-email'
						}
					]
				}

				const result = await this.resend.emails.send(emailPayload)

				if (result.error) {
					console.error('Failed to send bulk email:', result.error)
					errors.push({
						recipients: to,
						success: false,
						error: result.error.message || 'Unknown error'
					})
				} else {
					console.log(`Bulk email sent successfully, ID: ${result.data?.id}`)
					results.push({
						recipients: to,
						success: true,
						id: result.data?.id
					})
				}
			} catch (error) {
				console.error('Failed to send bulk email:', error)
				errors.push({
					recipients: to,
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error'
				})
			}
		}

		// Return results
		const successCount = results.filter(r => r.success).length
		const errorCount = errors.length

		return {
			success: errorCount === 0,
			message: `Successfully sent ${successCount} emails${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
			results,
			errors,
			stats: {
				total: sendIndividually ? to.length : 1,
				successful: successCount,
				failed: errorCount
			}
		}
	}

	private async upsertAudience() {
		// TODO: Add audiences table to Prisma schema if needed
		// const audience = await prisma.audiences.findFirst()

		// if (audience) {
		// 	return audience
		// }

		const resendAudience = await this.resend.audiences.create({
			name: 'Waiting List',
		})
		const {
			data: { id, name },
		} = resendAudience

		// TODO: Uncomment when audiences table is added to schema
		// return prisma.audiences.create({
		// 	data: {
		// 		resend_id: id,
		// 		name,
		// 	},
		// })

		// Return mock data for now
		return { resend_id: id, name }
	}
}

export const resendService = new ResendService()
