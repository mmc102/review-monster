
import { createClient } from "@/utils/supabase/client";


export interface AssignedForm {
  id: string
  status: string
  name: string
  created_at: string
}

export async function getStudentForms(studentId: string): Promise<AssignedForm[]> {
const supabase = createClient()
  const { data, error } = await supabase
    .from('signed_forms')
    .select(`
      status,
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
    status: row.status
  }))
}

export interface StudentInfo {
  name: string;
  email: string;
}


export const getStudentInfo = async (studentId: string): Promise<StudentInfo> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('students')
    .select('name, email')
    .eq('id', studentId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
