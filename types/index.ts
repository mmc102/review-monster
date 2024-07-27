import { User } from "@supabase/supabase-js";


export interface WrappedUser extends User {
  business_name: string;
  business_id: string;

}


export interface QueueItem {
  reviewer: string;
  review: string;
  response: string;
  status: string;
  createdDate: string;
}
