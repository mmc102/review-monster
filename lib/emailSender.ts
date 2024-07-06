import { createClient } from "@/utils/supabase/client";

export interface EmailProps {
    studentId: string;
    formLink: string;
}


const generateSignEmailBody = (link:string, studentName:string, daycareName:string) => `
<html>
<body>
<p>Dear Parent,</p>
<p>We hope this email finds you well.</p>
<p>Please sign the following form for your child, <strong>${studentName}</strong>:</p>
<p><a href="${link}" target="_blank">${link}</a></p>
<p>Let us know if you have any questions</p>
<p>Thank you!</p>
<p>Best regards,</p>
<p>${daycareName}</p>
</body>
</html>
`;

export const queueEmail = async ({formLink, studentId}:EmailProps) => {

    const supabase = createClient();

    const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('name, email, daycare_id, daycare_id (name)')
        .eq('id', studentId)
        .single();

    if (studentError || !studentData) {
        console.error('Error fetching student data:', studentError);
        return;
    }

    const subject = 'Please Sign the Form for Your Child';
    const body = generateSignEmailBody(formLink, studentData.name ,studentData.daycare_id.name);



    if (process.env.NODE_ENV === 'development') {
        console.log('Email sent to:', studentData.email);
        console.log(subject);
        console.log(body);
        return
    }


    const { error } = await supabase
        .from('email_queue')
        .insert([
            {
                recipient_email: studentData.email,
                student_name: studentData.name,
                form_link: formLink,
                subject: subject,
                body: body,
                daycare_id: studentData.daycare_id,
            },
        ]);

    if (error) {
        console.error('Error queueing email:', error);
    } 
};

