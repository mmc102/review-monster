
import { createClient } from "@/utils/supabase/client";
import { pullFormBlobs } from "./fileManager";
import { FormDetailsStudent, FormStatus } from "@/types";



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
          class_id (
           name, 
           year
          )
        )
      `)
    .eq('form_id', formId)

  if (studentsError || studentsData === null) {
    console.log('Error fetching students:', studentsError)
    throw studentsError
  }
  const students = studentsData.map((row: any) => {
    return {
      id: row.students.id,
      email: row.students.email,
      class: `${row.students.class_id.name} (${row.students.class_id.year})`, // Fix here: row.students.class_id.year
      assigned_at: row.created_at,
      signed_at: row.signed_at,
      status: row.status
    }
  })


  const val = {
    ...formDataWithBlobs[0],
    students
  }

  return val
}


export const generateFormLink = (assignmentId: string) => (
  `${window.location.origin}/sign-form/${assignmentId}`
)