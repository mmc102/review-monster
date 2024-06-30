import { createClient } from "@/utils/supabase/client";

export interface IForm {
  id: string
  storage_path: string;
  created_at: string;
  name: string
  blobUrl: string
}

interface SignedForm {
  student_id: string;
  form_id: string;
  signed_storage_path: string;
  created_at?: string;
}
export async function uploadFile(file: File): Promise<string> {

  const supabase = createClient();
  const fileName = `forms/${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('forms')
    .upload(fileName, file)

  console.log(data, error)
  if (error) {

    throw error
  }

  return data.path
}

export async function createForm(file: File, name: String): Promise<any> {

  const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();



  const storagePath: string = await uploadFile(file)
  const { data, error } = await supabase
    .from('forms')
    .insert([{ storage_path: storagePath, user_id: user?.id , name}])

  if (error) {
    throw error
  }

  return data
}




async function downloadBlob(storagePath: string): Promise<object> {

    const supabase = createClient();
  const { data, error } = await supabase.storage
    .from('forms')
    .download(storagePath)

  if (error) {
    throw error
  }

  return data
}

export const pullFormBlobs = async (data: Omit<IForm, 'blobUrl'>[]): Promise<IForm[]> => {

    const supabase = createClient();
    const formsWithBlobs = await Promise.all(
        data.map(async (form) => {
        const { data: fileData, error: fileError } = await supabase.storage
            .from('forms')
            .download(form.storage_path)

        if (fileError) {
            throw fileError
        }

        const blobUrl = URL.createObjectURL(fileData)
        return { ...form, blobUrl }
        })
    )
  return formsWithBlobs
}


export async function getUserForms(): Promise<IForm[]> {
    
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('forms')
    .select('id, storage_path, name, created_at')
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  if (!data) {
    return []
  }

  return pullFormBlobs(data)
}


const pullFormBlob = async (form: Omit<IForm, 'blobUrl'>): Promise<IForm> => {
  const supabase = createClient();
  const { data: fileData, error: fileError } = await supabase.storage
    .from('forms')
    .download(form.storage_path);

  if (fileError) {
    throw fileError;
  }

  const blobUrl = URL.createObjectURL(fileData);
  return { ...form, blobUrl };
};



export const getFormById = async (formId: string): Promise<IForm> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('forms')
    .select('id, storage_path, name, created_at')
    .eq('id', formId)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('Form not found');
  }

  return pullFormBlob(data);
};
