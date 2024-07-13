'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { getFormById } from '@/lib/fileManager';
import { IForm } from '@/types';

interface SignFormPageProps {
  id: string;
}

const SignFormPage: React.FC<SignFormPageProps> = ({ id }) => {
  const [form, setForm] = useState<IForm | null>(null);
  const [studentId, setStudentId] = useState<string>('');
  const [formId, setFormId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data, error } = await supabase
          .from('signed_forms')
          .select('form_id, student_id')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
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
  }, [id, supabase]);

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
        .from('signed_forms')
        .upload(`${studentId}_${form!.name}_${Date.now()}`, file);

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage.from('signed_forms').getPublicUrl(data.path);

      const { error: updateError } = await supabase
        .from('signed_forms')
        .update({ signed_form_path: publicUrl })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      alert('Form uploaded successfully');
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
        <CardDescription>Download the form, sign it, and upload the signed form.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {form && (
          <>
            <p>Form Name: {form.name}</p>
            <a href={form.blobUrl} download={`${form.name}.pdf`}>
              <Button>Download Form</Button>
            </a>
          </>
        )}
        <Label htmlFor="upload">Upload Signed Form</Label>
        <Input id="upload" type="file" onChange={handleFileChange} />
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Signed Form'}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </CardFooter>
    </Card>
  );
};

export default SignFormPage;

