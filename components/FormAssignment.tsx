'use client';

import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import StudentSelectionTable from '@/components/StudentSelectionTable';
import { FormStatus } from "@/types";
import { EmailProps, EmailType, queueEmail } from "@/lib/emailSender";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/utils";
import { getUserForms } from "@/lib/fileManager";


interface Form {
  id: string;
  name: string;
}

const FormAssignment: React.FC = () => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter()

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const formsData = await getUserForms();
        setForms(formsData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [supabase]);

  const handleSubmit = async () => {
    if (!selectedForm || selectedStudents.length === 0) {
      alert('Please select a form and at least one student');
      return;
    }

    const user = await getUser()
    if (!user) {
      alert('User not authenticated');
      return;
    }

    try {
      const assignments = selectedStudents.map(studentId => ({
        student_id: studentId,
        form_id: selectedForm,
        status: FormStatus.Assigned,
        user_id: user.id,
        daycare_id: user.daycare_id,
      }));

      const { data, error } = await supabase.from('signed_forms').insert(assignments).select();


      if (error) throw error;




      data.forEach((assignment: { id: string, student_id: string }) => {
        const emailProps: EmailProps = {
          assignedFormId: assignment.id,
          emailType: EmailType.SIGN
        }
        queueEmail(emailProps);

      });

      alert('Forms assigned successfully');
      router.push('/protected/dashboard');
    } catch (error: any) {
      alert(`Error assigning forms: ${error.message}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle>Assign Forms to Students</CardTitle>
        <CardDescription>Select a form and students to create assignments.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="max-w-96">
          <Label htmlFor="formSelect">Select Form</Label>
          <Select onValueChange={setSelectedForm}>
            <SelectTrigger id="formSelect">
              <SelectValue placeholder="Select a form" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Forms</SelectLabel>
                {forms.map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Label>Select Students</Label>
        <StudentSelectionTable selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} selectedForm={selectedForm} />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit}>Assign Form</Button>
      </CardFooter>
    </Card>
  )
}

export default FormAssignment;

