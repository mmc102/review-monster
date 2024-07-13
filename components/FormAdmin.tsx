'use client';

import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FormStatus } from '@/types';
import Link from 'next/link';
import SkeletonLoader from './SketetonLoader';
import { EmailType, queueEmail } from '@/lib/emailSender';
import { useRouter } from 'next/navigation';




interface AssignedForm {
  id: string;
  formId: string;
  name: string;
  class: string;
  status: FormStatus;
  signed_storage_path?: string;
  student_email: string;
  student_name: string;
  student_id: string;
}

const FormAdminTable: React.FC = () => {
  const [assignedForms, setAssignedForms] = useState<AssignedForm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter()



  useEffect(() => {
    const fetchForms = async () => {
      try {
        const { data, error } = await supabase
          .from('signed_forms')
          .select(`
            id,
            status,
            signed_storage_path,
            student_id (
              id,
              email,
              name,
              class_id (
                name,
                year 
              )
            ),
            form_id (
              id,
              name
            )
          `);

        if (error) {
          throw error;
        }

        const formattedData = data.map((item: any) => ({
          id: item.id,
          name: item.form_id.name,
          formId: item.form_id.id,
          status: item.status,
          signed_storage_path: item.signed_storage_path,
          student_email: item.student_id.email,
          class: item.student_id.class_id.name,
          student_id: item.student_id.id,
          student_name: item.student_id.name,
        }));

        setAssignedForms(formattedData);
      } catch (error: any) {
        console.error('Error fetching forms:', error);
        setError('Error fetching forms');
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [supabase]);

  const handleRemind = async (assignedFormId: string) => {
    queueEmail({
      assignedFormId,
      emailType: EmailType.REMINDER

    })
    alert("Reminder sent")

  }
  const handleShowForm = (assignedFormId: string) => {
    router.push(`/protected/signed-form/${assignedFormId}`)
  }

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('signed_forms')
        .update({ status: FormStatus.Accepted })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setAssignedForms((prevForms) =>
        prevForms.map((form) =>
          form.id === id ? { ...form, status: FormStatus.Accepted } : form
        )
      );
    } catch (error: any) {
      console.error('Error approving form:', error);
      setError('Error approving form');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assigned Forms and Pending Actions</CardTitle>

          <CardDescription>Review and approve signed forms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Parent Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <SkeletonLoader />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Forms and Pending Actions</CardTitle>
        <CardDescription>Review and approve signed forms</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Parent Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignedForms.map((assignedForm) => (
              <TableRow key={assignedForm.id}>
                <TableCell>
                  <Button variant={'link'}>
                    <Link href={`/form/${assignedForm.formId}`}>{assignedForm.name}</Link>
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge className={
                    assignedForm.status === FormStatus.Assigned ? 'bg-yellow-500' :
                      assignedForm.status === FormStatus.Signed ? 'bg-blue-500' :
                        'bg-green-500'
                  }>
                    {assignedForm.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant={'link'}>
                    <Link href={`/student/${assignedForm.student_id}`}>{assignedForm.student_name}</Link>
                  </Button>
                </TableCell>
                <TableCell>{assignedForm.class}</TableCell>
                <TableCell>{assignedForm.student_email}</TableCell>
                <TableCell className='flex gap-2'>
                  <Button disabled={assignedForm.status !== FormStatus.Signed} onClick={() => handleApprove(assignedForm.id)}>Approve</Button>
                  <Button disabled={assignedForm.status === FormStatus.Assigned} onClick={() => handleShowForm(assignedForm.id)}>View Signed Form</Button>
                  <Button disabled={assignedForm.status !== FormStatus.Assigned} onClick={() => handleRemind(assignedForm.id)}>Send Reminder</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FormAdminTable;
