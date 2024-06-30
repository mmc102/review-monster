'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AssignedForm, getStudentForms, StudentInfo,getStudentInfo } from '@/lib/SignedForms';
import { FormStatus } from '@/types';



const StudentFormsTable: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [forms, setForms] = useState<AssignedForm[]>([]);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [forms, studentInfo] = await Promise.all([
          getStudentForms(studentId),
          getStudentInfo(studentId),
        ]);
        setForms(forms);
        setStudentInfo(studentInfo);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Student Forms</CardTitle>
        <CardDescription>List of forms signed or pending by the student</CardDescription>
      </CardHeader>
      <CardContent>
        {studentInfo && (
          <div className="mb-6">
            <h2 className="text-lg font-bold">Student Information</h2>
            <p><strong>Name:</strong> {studentInfo.name}</p>
            <p><strong>Email:</strong> {studentInfo.email}</p>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Created Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell>
                  <div className="font-medium">{form.name}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{new Date(form.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={
                    form.status === FormStatus.Assigned ? 'bg-yellow-500' :
                    form.status === FormStatus.Signed ? 'bg-blue-500' :
                    'bg-green-500'
                  }>
                    {form.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StudentFormsTable;

