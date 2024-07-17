import { WrappedUser } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


interface SupabaseDaycareResponse {
  daycare_id: string;
}


export async function getDaycareId(user_id: string): Promise<{ daycare_id: string | null }> {
  const supabase = createClient()

  const { data: daycareData, error: daycareError } = await supabase
    .from('user_daycares')
    .select('daycare_id')
    .eq('user_id', user_id)
    .single<SupabaseDaycareResponse>();

  if (daycareError) {
    throw daycareError
  } else {
    return { daycare_id: daycareData.daycare_id };
  }
}


export async function getUser(): Promise<WrappedUser> {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Error fetching user:', authError);
    throw authError;
  } else {
    const { data: daycareData, error: daycareError } = await supabase
      .from('user_daycares')
      .select('daycare_id')
      .eq('user_id', user.id)
      .single<SupabaseDaycareResponse>();

    if (daycareError) {
      console.error('Error fetching daycare_id:', daycareError);
      throw daycareError
    } else {
      return { ...user, daycare_id: daycareData.daycare_id };
    }
  }
}