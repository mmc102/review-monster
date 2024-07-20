

export const generateReminderEmail = () => {
    return {
        body: `
            <html>
            <body>
            <p>Dear Parent,</p>
            <p>We hope this email finds you well.</p>
            <p>Just a friendly reminder to sign following form for your child, \${student_name}</p>
            <p>
            \${link}
            </p>
            <p>Let us know if you have any questions</p>
            <p>Thank you!</p>
            <p>\${daycare_name}</p>
            </body>
            </html>`,
        subject: "Reminder: Please sign the form for ${student_name}"
    }
}