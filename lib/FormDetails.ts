
import { createClient } from "@/utils/supabase/client";
import { IForm, pullFormBlobs } from "./fileManager";

export interface FormDetails {
    id: string
    name: string
    created_at: string
    blobUrl: string
    students: {
      id: string
      email: string
      class: string
      assigned_at: string
      completed: boolean
    }[]
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
        completed,
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
      completed: row.completed
    }))
  
    const val =  {
      ...formDataWithBlobs[0],
      students
    }

    return val
  }