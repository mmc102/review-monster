export const generateSignEmailBody = () => (
    {
        body: `
            <html>
            <body>
            <p>Dear Parent,</p>
            <p>We hope this email finds you well.</p>
            <p>Please sign the following form for your child, \${student_name}</p>
            <p>\${link}</p>
            <p>Let us know if you have any questions</p>
            <p>Thank you!</p>
            <p>\${business_name}</p>
            </body>
            </html>`,
        subject: `Please sign a form for \${student_name}`
    })