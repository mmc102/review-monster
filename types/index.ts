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

export interface IForm {
  id: string
  storage_path: string;
  signed_at?: string;
  created_at: string;
  name: string
  blobUrl: string
  status: FormStatus
}

export interface FormDetailsStudent {
  id: string
  email: string
  class: string
  assigned_at: string
  status: FormStatus
  signed_at: string
}

export interface WrappedUser extends User {
  daycare_id: string;

}

export interface SignedFormDetails {
  id: string
  name: string
  created_at: string
  blobUrl: string
  student: FormDetailsStudent
  status: FormStatus
}