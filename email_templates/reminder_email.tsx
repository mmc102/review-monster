
export const generateReminderEmail = (link:string, studentName:string, daycareName:string) => `
<html>
<body>
<p>Dear Parent,</p>
<p>We hope this email finds you well.</p>
<p>Just a friendly reminder to sign following form for your child, ${studentName}</p>
<p><a href="${link}" target="_blank">${link}</a></p>
<p>Let us know if you have any questions</p>
<p>Thank you!</p>
<p>${daycareName}</p>
</body>
</html>
`;