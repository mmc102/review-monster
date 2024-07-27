import { QueueItem } from "@/types";
import { getUser } from "./get_user";
import { createClient } from "@/utils/supabase/client";


export async function getReviews(): Promise<QueueItem[]> {
    const user = await getUser()

    const supabase = createClient()

    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('business_id', user.business_id)
        .order('created_at', { ascending: false }).limit(10)

    if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }

    console.log(data)

    return data.map((item) => (
        {
            reviewer: item.reviewer,
            review: item.review_body,
            response: item.response,
            status: item.status,
            createdDate: item.created_at
        }
    ))
}