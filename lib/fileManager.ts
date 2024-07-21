import { IForm } from "@/types";
import { createClient } from "@/utils/supabase/client";




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

  if (!user) {
    throw new Error('User not authenticated');
  }
  const { data: daycareData, error: daycareError } = await supabase
    .from('user_daycares')
    .select('daycare_id')
    .eq('user_id', user.id).single();

  if (!daycareData || daycareError) {
    throw new Error('issue getting the daycare id');
  }

  const storagePath: string = await uploadFile(file)
  const { data, error } = await supabase
    .from('forms')
    .insert([{ storage_path: storagePath, user_id: user?.id, name, daycare_id: daycareData.daycare_id }])

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


interface PullBlobProps {
  storage_path: string;
}

export const pullFormBlobs = async (data: PullBlobProps[]): Promise<IForm[]> => {

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
  return formsWithBlobs as IForm[]
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

  return pullFormBlobs(data as object as Omit<IForm, 'blobUrl'>[])
}


const pullFormBlob = async (form: Omit<IForm, 'blobUrl' | 'status'>): Promise<IForm> => {
  const supabase = createClient();
  const { data: fileData, error: fileError } = await supabase.storage
    .from('forms')
    .download(form.storage_path);

  if (fileError) {
    throw fileError;
  }

  const blobUrl = URL.createObjectURL(fileData);
  return { ...form, blobUrl } as IForm;
};



export const getFormById = async (formId: string): Promise<Omit<IForm, "status">> => {
  const supabase = createClient();

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
