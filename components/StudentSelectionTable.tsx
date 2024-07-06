'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/utils/supabase/client';

interface Student {
  id: string;
  email: string;
  name: string
  class_id: { name: string };
}

interface StudentSelectionTableProps {
  selectedStudents: string[];
  setSelectedStudents: (selected: string[]) => void;
  selectedForm: string | null
}
// TODO use selected form to filter available students
const StudentSelectionTable: React.FC<StudentSelectionTableProps> = ({ selectedStudents, setSelectedStudents }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

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
        .select('id, name, email, class_id (name)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching students:', error);
      } else {
        setStudents(data as object as Student[]);
      }
      setLoading(false);
    };

    fetchStudents();
  }, [supabase]);

  const handleCheckAll = () => {
    setAllStudents((prev) => !prev);
    const func = (prevSelected: string | any[]) =>(
      prevSelected.length === students.length ? [] : students.map((student) => student.id))

    setSelectedStudents(func(selectedStudents))
  }


const handleCheckboxChange = (studentId: string) => {
  const func = (prevSelected: string[]) => {
    if (prevSelected.includes(studentId)) {
      return prevSelected.filter((id: string) => id !== studentId);
    } else {
      return [...prevSelected, studentId];
    }
  }
  
  setSelectedStudents(func(selectedStudents))
};


  if (loading) {
    return <div>Loading...</div>;
  }
 return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
         <Checkbox
                checked={allStudents}
                onClick={() => handleCheckAll()}
              />

          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Class</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>
              <Checkbox
                checked={selectedStudents.includes(student.id)}
                onClick={() => handleCheckboxChange(student.id)}
              />
            </TableCell>

            <TableCell>{student.name}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.class_id.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StudentSelectionTable;
