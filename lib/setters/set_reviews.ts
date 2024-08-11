import { createClient } from "@/utils/supabase/client";


export async function updateReviewStatus(reviewId: string, newStatus: string) {

    const supabase = createClient()


    const { error } = await supabase
        .from('reviews')
        .update({ status: newStatus })
        .eq('id', reviewId);

    if (error) {
        console.error('Error updating review status:', error);
        throw error;
    }
}