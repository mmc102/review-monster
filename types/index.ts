import { User } from "@supabase/supabase-js";

export enum FormStatus {
    Assigned = 'assigned',
    Signed = 'signed',
    Accepted = 'accepted',
  }


export interface Class {
id: number;
year: number;
name: string;
created_at: string;
}


export interface Student {
    id: string;
    email: string;
    name: string;
    created_at: string;
    class_id: {
      name: string;
      year: number;
    };
  }


export interface WrappedUser extends User{
  daycare_id: string;
  
}
  