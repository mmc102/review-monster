'use client';

import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import StudentSelectionTable from '@/components/StudentSelectionTable';
import { FormStatus } from "@/types";
import { EmailProps, queueEmail } from "@/lib/emailSender";


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

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const { data: formsData, error: formsError } = await supabase.from('forms').select('*');
        if (formsError) throw formsError;
        setForms(formsData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleSubmit = async () => {
    if (!selectedForm || selectedStudents.length === 0) {
      alert('Please select a form and at least one student');
      return;
    }

    const { data: {user}} = await supabase.auth.getUser();
    if (!user) {
      alert('User not authenticated');
      return;
    }

    try {
      const assignments = selectedStudents.map(studentId => ({
        student_id: studentId,
        form_id: selectedForm,
        status: FormStatus.Assigned,
        completed: false,
        user_id: user.id,
      }));

      const { data, error } = await supabase.from('signed_forms').insert(assignments).select();


      if (error) throw error;

      data.forEach((assignment: { id: string, student_id: string }) => {
        const formLink = `${window.location.origin}/sign-form/${assignment.id}`;

        const emailProps: EmailProps = {
          formLink,
          studentId: assignment.student_id,  
        }
      queueEmail(emailProps);

      });

      alert('Forms assigned successfully');
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
        <Label htmlFor="formSelect">Select Form</Label>
        <Select onValueChange={setSelectedForm}>
          <SelectTrigger id="formSelect">
            <SelectValue   placeholder="Select a form" />
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

        <Label>Select Students</Label>
        <StudentSelectionTable selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} selectedForm={selectedForm}/>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit}>Assign Form</Button>
      </CardFooter>
    </Card>
  )
}

export default FormAssignment;

