'use client'

import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import SkeletonLoader from './SketetonLoader'
import { Student } from '@/types'




const StudentsTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('User not authenticated');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          email,
          created_at,
          class_id (
            name,
            year
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching students:', error);
      } else {
        setStudents(data as unknown as Student[]); //TODO improve
      }
      setLoading(false);
    };

    fetchStudents();
  }, [supabase]); // Dependencies: only re-run if supabase client changes

  const handleViewForms = (studentId: string) => {
    router.push(`/student/${studentId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Students</CardTitle>
          <CardDescription>List of students</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Enrolled Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4}>
                  <SkeletonLoader />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}>
                  <SkeletonLoader />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}>
                  <SkeletonLoader />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Students</CardTitle>
        <CardDescription>List of students</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Enrolled Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.email}</TableCell>
                <TableCell>{`${student.class_id.name} (${student.class_id.year})`}</TableCell>
                <TableCell>{new Date(student.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewForms(student.id)}>Assigned Forms</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StudentsTable;
