import { createClient } from "@/utils/supabase/client";
import { generateFormLink } from "./FormDetails";
import DOMPurify from 'dompurify';
import { getUser } from "./utils";
import { generateReminderEmail } from "@/email_templates/reminder_email";
import { generateSignEmailBody } from "@/email_templates/form_to_sign";
import { get } from "http";

export interface EmailProps {
    assignedFormId: string;
    emailType: EmailType
}

export enum EmailType {
    SIGN = "SIGN",
    REMINDER = "REMINDER"
}

const makeSubs = (html: string, sub: string, value: string): string => {
    return html.replace(sub, value)
}

const addLink = (html: string, sub: string, link: string): string => {
    const anchor = `<a href="${link}" target="_blank">${link}</a>`
    return html.replace(sub, anchor)

}

export const prepareHtml = (html: string, studentName: string, daycareName: string, link: string) => {
    var subbed = makeSubs(html, "${student_name}", studentName)
    subbed = makeSubs(subbed, "${daycare_name}", daycareName)
    subbed = addLink(subbed, "${link}", link)
    return DOMPurify.sanitize(subbed)
}


export const getRawEmails = async () => {
    const supabase = createClient();
    const user = await getUser()
    if (!user) {
        throw new Error('User not found')
    }

    const { data, error } = await supabase
        .from('email_templates')
        .select('reminder_subject, reminder_body, initial_body, initial_subject')
        .eq('daycare_id', user.daycare_id)
        .maybeSingle();
    if (error) {
        throw error
    }

    if (!data) {
        const { subject: reminderSubject, body: reminderBody } = generateReminderEmail()
        const { subject: initialSubject, body: initialBody } = generateSignEmailBody()
        const emailTemplates = { id: null, reminderBody, reminderSubject, initialBody, initialSubject }
        return emailTemplates

    }
    return { reminderSubject: data.reminder_subject, reminderBody: data.reminder_body, initialBody: data.initial_body, initialSubject: data.initial_subject }
}


const generateEmail = async (type: EmailType, link: string, studentName: string, daycareName: string) => {

    const data = await getRawEmails()

    if (type === EmailType.REMINDER) {
        return {
            subject: prepareHtml(data.reminderSubject, studentName, daycareName, link),
            body: prepareHtml(data.reminderBody, studentName, daycareName, link)

        }
    }
    else {
        return {
            subject: prepareHtml(data.initialSubject, studentName, daycareName, link),
            body: prepareHtml(data.initialBody, studentName, daycareName, link)
        }

    }

}





export const saveEmails = async ({ id, reminderSubject, reminderBody, initialBody, initialSubject }: any) => {
    const supabase = createClient();
    const user = await getUser()
    if (!user) {
        throw new Error('User not found')
    }
    const emailTemplates = {
        reminder_subject: reminderSubject,
        reminder_body: reminderBody,
        initial_subject: initialSubject,
        initial_body: initialBody,
    };

    const { error: saveError } = await supabase
        .from('email_templates')
        .upsert([
            {
                daycare_id: user.daycare_id,
                ...emailTemplates,
            }
        ],
            {
                onConflict: 'daycare_id'
            })

    if (saveError) {
        throw saveError;
    }
    alert("email templates saved successfuly")
}




export const queueEmail = async ({ assignedFormId, emailType }: EmailProps) => {


    const supabase = createClient();

    const formLink = generateFormLink(assignedFormId);

    const { data: rawStudentData, error: studentError } = await supabase
        .from('signed_forms')
        .select(`
        student_id (
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

    const studentData = rawStudentData as object as StudentDataType


    if (studentError || !studentData) {
        console.error('Error fetching student data:', studentError);
        return;
    }

    const { subject, body } = await generateEmail(emailType, formLink, studentData.student_id.name, studentData.student_id.daycare_id.name);


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

