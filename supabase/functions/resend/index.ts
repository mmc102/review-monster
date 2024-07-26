// @ts-nocheck
import { createClient } from 'jsr:@supabase/supabase-js@2'


const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

const handler = async (request: Request): Promise<Response> => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_ANON_KEY'),
    )
    const { id, recipient_email, subject, body } = await request.json();

    // Validate the required fields
    if (!id || !recipient_email || !subject || !body) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Make the request to the Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'matt@businessdocuments.com',
        to: [recipient_email],
        subject: subject,
        html: body,
      }),
    });

    const data = await res.json();

    // Update the email queue status in the database
    if (res.ok) {
      await supabase
        .from('email_queue')
        .update({ status: 'sent' })
        .eq('id', id);
    } else {
      await supabase
        .from('email_queue')
        .update({ status: 'failed' })
        .eq('id', id);
    }

    return new Response(JSON.stringify(data), {
      status: res.ok ? 200 : res.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Error in handler:', error);

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

Deno.serve(handler);
