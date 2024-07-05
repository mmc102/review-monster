
import { createClient } from "@/utils/supabase/client";

interface EmailProps {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({to, subject, html}: EmailProps) => {

    if (process.env.NODE_ENV === 'development') {
        console.log('Email sent to:', to);
        console.log(html);
        return
        
    }

  const supabase = createClient();
    try {
   
     const body = {
       from: 'matt@daycaredocuments.com',
       to: to,
       subject:subject,
       html: html,
     }
     console.log('oh boy')
       // const {data, error} = await supabase.functions.invoke('resend', {method:'POST',body});
   
     }
        catch {
            //do something here tha tis useable in app
        }
     }
   
   