
import { pullFormBlobs } from "./fileManager";
import { FormDetailsStudent, IForm, SignedFormDetails } from "@/types";
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
  class_id: {
    name: string
    year: string
  }
}


export const getStudentInfo = async (studentId: string): Promise<StudentInfo> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('students')
    .select('name, email, class_id (name, year)')
    .eq('id', studentId)
    .single();

  if (error) {
    throw error;
  }

  return data as object as StudentInfo;
};

interface FormData {
  id: any;
  form_id: {
    name: any;
  };
  signed_storage_path: any;
  created_at: any;
  signed_at: any;
}

export async function getSignedFormDetails(assignedFormId: string): Promise<SignedFormDetails> {

  const supabase = createClient()
  const { data: formData, error: formError } = await supabase
    .from('signed_forms')
    .select('id, form_id (name) , signed_storage_path , created_at, signed_at, status')
    .eq('id', assignedFormId)
    .single()

  if (formError) {
    throw formError
  }

  const parsedFormData: Omit<IForm, 'blobUrl'> = {
    id: formData.id,
    name: (formData as object as { form_id: { name: string } }).form_id.name,
    created_at: formData.created_at,
    signed_at: formData.signed_at,
    storage_path: formData.signed_storage_path,
    status: formData.status
  }
  const formDataWithBlobs = await pullFormBlobs([parsedFormData])

  const { data: studentData, error: studentsError } = await supabase
    .from('signed_forms')
    .select(`
        signed_at,
        status,
        created_at,
        student_id (
          id,
          email,
          class_id (
           name, 
           year
          )
        )
      `)
    .eq('id', assignedFormId).single()

  if (studentsError || studentData === null) {
    console.log('Error fetching student:', studentsError)
    throw studentsError
  }

  const parsedStudentData = studentData as object as { signed_at: any, status: any, created_at: any, student_id: { email: string, class_id: { name: any, year: any }, id: any } }


  const student: FormDetailsStudent = {
    id: parsedStudentData.student_id.id,
    email: parsedStudentData.student_id.email,
    class: `${parsedStudentData.student_id.class_id.name} (${parsedStudentData.student_id.class_id.year})`,
    assigned_at: studentData.created_at,
    signed_at: studentData.signed_at,
    status: studentData.status
  }


  const val = {
    ...formDataWithBlobs[0],
    student
  }


  return val
}

