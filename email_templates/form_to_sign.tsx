
function generateEmailBody(link: string, studentName: string): string {
return `
  <html>
      <body>
          <p>Dear Parent,</p>
          <p>We hope this email finds you well.</p>
          <p>We kindly ask you to visit the following link to sign a form for your child, <strong>${studentName}</strong>:</p>
          <p><a href="${link}" target="_blank">${link}</a></p>
          <p>Your prompt response is greatly appreciated.</p>
          <p>Thank you!</p>
          <p>Best regards,</p>
          <p>The School Administration</p>
      </body>
  </html>
`;
}
