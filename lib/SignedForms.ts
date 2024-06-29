
import { createClient } from "@/utils/supabase/client";


export interface AssignedForm {
  id: string
  name: string
  created_at: string
  completed:boolean
}

export async function getStudentForms(studentId: string): Promise<AssignedForm[]> {
const supabase = createClient()
  const { data, error } = await supabase
    .from('signed_forms')
    .select(`
      completed,
      forms (
        id,
        name,
        created_at
      )
    `)
    .eq('student_id', studentId)

  if (error) {
    throw error
  }

  return data.map((row: any) => ({
    id: row.forms.id,
    name: row.forms.name,
    created_at: row.forms.created_at,
    completed: true
  }))
}
