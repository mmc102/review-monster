'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/utils/supabase/client';

interface Student {
  id: string;
  email: string;
  class: string;
  created_at: string;
}

interface StudentSelectionTableProps {
  selectedStudents: string[];
  setSelectedStudents: (selected: string[]) => void;
}

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
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching students:', error);
      } else {
        setStudents(data);
      }
      setLoading(false);
    };

    fetchStudents();
  }, [supabase]);

  const handleCheckAll = () => {
    setAllStudents((prev) => !prev);
    setSelectedStudents((prevSelected) =>
      prevSelected.length === students.length ? [] : students.map((student) => student.id)
    );
  }


 const handleCheckboxChange = (studentId: string) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
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
            <TableCell>{student.class}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StudentSelectionTable;
