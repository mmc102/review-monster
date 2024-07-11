import { generateSignEmailBody } from "@/email_templates/form_to_sign";
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
import { generateReminderEmail } from "@/email_templates/reminder_email";
import { createClient } from "@/utils/supabase/client";
import { generateFormLink } from "./FormDetails";
import { Student } from "@/types";

export interface EmailProps {
    assignedFormId: string;
    emailType: EmailType
}

export enum EmailType {
    SIGN = "SIGN",
    REMINDER = "REMINDER"
}

type emailGenerator = (link:string, studentName:string, daycareName:string) => string;

const emailBodyGenerators: { [key in EmailType]: emailGenerator } = {
    [EmailType.SIGN]: generateSignEmailBody,
    [EmailType.REMINDER]: generateReminderEmail
};


export const queueEmail = async ({assignedFormId,emailType}:EmailProps) => {


    const supabase = createClient();


    const formLink = generateFormLink(assignedFormId);

    const { data: rawStudentData, error: studentError } = await supabase
    .from('signed_forms')
    .select(`
        student_id !single(
        name,
        email,
        daycare_id,
        daycare_id (id, name))
    `)
    .eq('id', assignedFormId)
    .single();

    type StudentDataType = {
        student_id: {
            name: string,
            email: string,
            daycare_id: {
                name: string,
                id: string
            }
        }
    }

    const  studentData= rawStudentData as object as  StudentDataType

    if (studentError || !studentData) {
        console.error('Error fetching student data:', studentError);
        return;
    }

    const subject = 'Please Sign the Form for Your Child';
    const body = emailBodyGenerators[emailType](formLink, studentData.student_id.name ,studentData.student_id.daycare_id.name);



    if (process.env.NODE_ENV === 'development') {
        console.log('Email sent to:', studentData.student_id.email);
        console.log(subject);
        console.log(body);
        return
    }


    const { error } = await supabase
        .from('email_queue')
        .insert([
            {
                recipient_email: studentData.student_id.email,
                student_name: studentData.student_id.name,
                form_link: formLink,
                subject: subject,
                body: body,
                daycare_id: studentData.student_id.daycare_id.id,
            }
        ]);

    if (error) {
        console.error('Error queueing email:', error);
    } 
};

