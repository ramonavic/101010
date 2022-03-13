import nodemailer from 'nodemailer'

export default class Mailer {
    constructor() {

        // Simple check to see if we can authenticate
        if (process.env.MAIL_USER && process.env.MAIL_PASSWORD) {
            this.transport = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD
                },
                secure: false // NOTE: maybe put this true for production (locally it gives an error)
                // SEE ALSO: https://nodemailer.com/smtp/testing/#examples
            });
        } else {
            throw 'Mail credentials not available. Can\'t setup mailer'
        }

        switch (process.env.ENVIRONMENT) {
            case 'prod':
                this.integration = 'mailchimp'
                break;
            case 'dev':
                this.integration = 'mailtrap'
                break
            default:
                throw 'Mail environment unclear'

        }

    }

    // TODO add mailchimp template as param?
    // TODO wrap params as object?
    async send(recipients, subject, body) {
        try {
            const info = await this.transport.sendMail({
                from: "101010 support@101010.nl",
                to: recipients.toString(),
                subject,
                html: body
            })

            console.log('Received info after sending mail', info)

            if (info.rejected.length) {
                // Do something

                console.log(`Could not send mailt to:  ${info.rejected}`)

            }

            return info
        } catch (err) {
            console.error('Error while sending mail', err)
        }
    }

}