'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { IForm, getFormById } from '@/lib/fileManager';
import { useRouter } from 'next/navigation';
import { FormStatus } from '@/types';

const SignFormPage = ({ params }: { params: { id: string } }) => {
  const [form, setForm] = useState<IForm | null>(null);
  const [signedForm, setSignedForm] = useState<IForm | null>(null);
  const [studentId, setStudentId] = useState<string>('');
  const [_formId, setFormId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [signedFormUrl, setSignedFormUrl] = useState<string | null>(null);

  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data, error } = await supabase
          .from('signed_forms')
          .select('form_id, student_id, status ,signed_storage_path')
          .eq('id', params.id)
          .single();

        if (error) {
          throw error;
        }

        if (data.signed_storage_path) {
          const { data : {publicUrl} } = supabase.storage.from('forms').getPublicUrl(data.signed_storage_path);
          setSignedFormUrl(publicUrl);
        }

        const form = await getFormById(data.form_id);
        setForm(form);
        setStudentId(data.student_id);
        setFormId(data.form_id);
      } catch (error: any) {
        console.error('Error fetching form:', error);
        setError('Error fetching form');
      }
    };

    fetchForm();
  }, [params.id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.storage
        .from('forms')
        .upload(`${studentId}_${form!.name}_${Date.now()}`, file);

      if (error) {
        throw error;
      }

      const { error: updateError } = await supabase
        .from('signed_forms')
        .update({ signed_storage_path: data.path,status: FormStatus.Signed, completed: true })
        .eq('id', params.id);

      if (updateError) {
        throw updateError;
      }

      router.push(`/sign-form/${params.id}/thanks`);
    } catch (error: any) {
      console.error('Error uploading form:', error);
      setError('Error uploading form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Form</CardTitle>
        <CardDescription>
          {signedFormUrl ? 'You\'ve already signed!' : 'Download the form, sign it, and upload the signed form.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {form && (
          <>
            <p>Form Name: {form.name}</p>
            {signedFormUrl ? (
              <a href={signedFormUrl.blobUrl} download={`${form.name}.pdf`}>
                <Button>Download Signed Form</Button>
              </a>
            ) : (
              <a href={form.blobUrl} download={`${form.name}.pdf`}>
                <Button>Download Form</Button>
              </a>
            )}
          </>
        )}
        {!signedFormUrl && (
          <>
            <Label htmlFor="upload">Upload Signed Form</Label>
            <Input id="upload" type="file" onChange={handleFileChange} />
          </>
        )}
      </CardContent>
      <CardFooter>
        {!signedFormUrl && (
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Signed Form'}
          </Button>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </CardFooter>
    </Card>
  );
};

export default SignFormPage;

