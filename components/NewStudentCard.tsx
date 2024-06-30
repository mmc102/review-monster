'use client';

import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Class } from '@/types';

const NewStudentCard: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string | undefined>(undefined);
  const [classes, setClasses] = useState<Class[]>([]);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [newClassName, setNewClassName] = useState<string>('');
  const [newClassYear, setNewClassYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();




  useEffect(() => {
    const fetchClasses = async () => {
      const { data, error } = await supabase.from('class').select('*');
      if (error) {
        console.error('Error fetching classes:', error);
      } else {
        setClasses(data);
      }
    };

    fetchClasses();
  }, []);

  const handleAddNewClass = async () => {
    if (!newClassName || !newClassYear) {
      alert('Please fill in all class fields');
      return;
    }


   const { data: { user } } = await supabase.auth.getUser();

    try {
      const { data, error } = await supabase.from('class').insert({
        name: newClassName,
        year: newClassYear,
        user_id: user!.id,
        created_at: new Date().toISOString(),
      }).select().single();

      if (error) throw error;

      setClasses([...classes, data]);
      setNewClassName('');
      setNewClassYear(new Date().getFullYear());
      setStudentClass(data.id.toString());
      setShowNew(false);
      alert('Class added successfully');
    } catch (error: any) {
      console.error('Error adding class:', error);
      setError(error.message);
    }
  };

  const handleSubmit = async () => {
    if (!email || !name || !studentClass) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('students').insert({
        email,
        name,
        class_id: parseInt(studentClass),
        created_at: new Date().toISOString(),
        user_id: user.id
      });

      if (error) throw error;

      setEmail('');
      setName('');
      setStudentClass(undefined);
      alert('Student added successfully');
    } catch (error: any) {
      console.error('Error adding student:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Card>
        <CardHeader>
          <CardTitle>New Student</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter student email"
            required
          />

          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student name"
            required
          />

          <Label htmlFor="class">Class</Label>
          <Select onValueChange={setStudentClass} value={studentClass}>
            <SelectTrigger id="class">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Classes</SelectLabel>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.name} ({cls.year})
                  </SelectItem>
                ))}
                
              </SelectGroup>
                <Button variant='link' onClick={() => setShowNew(true)}>
                  + New Class
                </Button>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Student'}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </CardFooter>
      </Card>

      {showNew && (
        <Card>
          <CardHeader>
            <CardTitle>New Class</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Label htmlFor="newClassName">Class Name</Label>
            <Input
              id="newClassName"
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Enter new class name"
            />
            <Label htmlFor="newClassYear">Class Year</Label>
            <Input
              id="newClassYear"
              type="number"
              value={newClassYear}
              onChange={(e) => setNewClassYear(parseInt(e.target.value))}
              placeholder="Enter new class year"
            />
            <Button onClick={handleAddNewClass}>Add New Class</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewStudentCard;

