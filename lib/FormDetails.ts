
import { createClient } from "@/utils/supabase/client";
import { IForm, pullFormBlobs } from "./fileManager";
import { FormStatus } from "@/types";


export interface FormDetailsStudent {
      id: string
      email: string
      class: string
      assigned_at: string
      status: FormStatus
      signed_at: string
}
export interface FormDetails {
    id: string
    name: string
    created_at: string
    blobUrl: string
    students: FormDetailsStudent[];
  }
  
  export async function getFormDetails(formId: string): Promise<FormDetails> {

    const supabase = createClient()
    const { data: formData, error: formError } = await supabase
      .from('forms')
      .select('id, name, storage_path , created_at')
      .eq('id', formId)
      .single()
  
    if (formError) {
      throw formError
    }
    const formDataWithBlobs = await pullFormBlobs([formData])
  
    const { data: studentsData, error: studentsError } = await supabase
      .from('signed_forms')
      .select(`
        student_id,
        signed_at,
        status,
        created_at,
        students (
          id,
          email,
          class
        )
      `)
      .eq('form_id', formId)
  
    if (studentsError) {
      throw studentsError
    }
  
    const students = studentsData.map((row: any) => ({
      id: row.students.id,
      email: row.students.email,
      class: row.students.class,
      assigned_at: row.created_at,
      signed_at: row.signed_at,
      status: row.status
    }))
  
    const val =  {
      ...formDataWithBlobs[0],
      students
    }

    return val
  }


  export const generateFormLink = (assignmentId: string)=> (
    `${window.location.origin}/sign-form/${assignmentId}`
  )