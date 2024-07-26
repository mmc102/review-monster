import { WrappedUser } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";



interface SupabaseBusinessResponse {
  business_id: string;
}


export async function getBusinessId(supabase: SupabaseClient, user_id: string): Promise<{ business_id: string | null }> {

  const { data: businessData, error: businessError } = await supabase
    .from('user_businesss')
    .select('business_id')
    .eq('user_id', user_id)
    .single<SupabaseBusinessResponse>();

  if (businessError) {
    throw businessError
  } else {
    return { business_id: businessData.business_id };
  }
}


export async function getUser(): Promise<WrappedUser> {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Error fetching user:', authError);
    throw authError;
  } else {
    const { data: businessData, error: businessError } = await supabase
      .from('user_businesss')
      .select('business_id')
      .eq('user_id', user.id)
      .single<SupabaseBusinessResponse>();

    if (businessError) {
      console.error('Error fetching business_id:', businessError);
      throw businessError
    } else {
      return { ...user, business_id: businessData.business_id };
    }
  }
}