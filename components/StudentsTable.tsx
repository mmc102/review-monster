'use client'


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


interface Student {
  id: string
  email: string
  class: string
  created_at: string
}

const StudentsTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const supabase = createClient()

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
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching students:', error)
      } else {
        setStudents(data)
      }
      setLoading(false)
    }

    fetchStudents()
  }, [supabase]) // Dependencies: only re-run if supabase client changes

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Students</CardTitle>
        <CardDescription>List of students enrolled in your classes.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="hidden md:table-cell">Enrolled Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="font-medium">{student.email}</div>
                </TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell className="hidden md:table-cell">{new Date(student.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}




export default function StudentsPage(){

    return (
        <div>
            <StudentsTable/>
        </div>

    )
}
