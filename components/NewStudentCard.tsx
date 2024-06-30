'use client';

import { createClient } from "@/utils/supabase/client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const NewStudentCard: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !name || !studentClass) {
      alert('Please fill in all fields');
      return;
    }

    const supabase = createClient();    
    setLoading(true);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('User not authenticated');
      setLoading(false);
      return
    }



    try {
      const { error } = await supabase.from('students').insert({
        email,
        name,
        class: studentClass,
        created_at: new Date().toISOString(),
        user_id: user.id
      });

      if (error) throw error;

      setEmail('');
      setName('');
      setStudentClass('');
      alert('Student added successfully');
    } catch (error: any) {
      console.error('Error adding student:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <Input
          id="class"
          type="text"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
          placeholder="Enter student class"
          required
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Adding...' : 'Add Student'}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </CardFooter>
    </Card>
  );
};

export default NewStudentCard;
