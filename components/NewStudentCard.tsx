"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Class, Student } from "@/types";
import { getUser } from "@/lib/utils";
import { FileStackIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ClassSelector from "./ClassSelector";

const NewStudentCard = ({
  prevStudents,
  setStudents,
}: {
  prevStudents: Student[];
  setStudents: (students: Student[]) => void;
}) => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [studentClass, setStudentClass] = useState<string | undefined>(
    undefined
  );
  const [classes, setClasses] = useState<Class[]>([]);
  const [showNewClass, setShowNewClass] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      const user = await getUser();
      const { data, error } = await supabase.from("class").select("*").eq('daycare_id', user.daycare_id)
      if (error) {
        console.error("Error fetching classes:", error);
      } else {
        setClasses(data);
      }
    };

    fetchClasses();
  }, [supabase]);



  const handleSubmit = async () => {
    if (!email || !name || !studentClass) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    const user = await getUser();

    try {
      const { data, error } = await supabase
        .from("students")
        .insert({
          email,
          name,
          class_id: parseInt(studentClass),
          created_at: new Date().toISOString(),
          user_id: user.id,
          daycare_id: user.daycare_id,
        })
        .select(
          `
          id,
          email,
          name,
          created_at,
          class_id (
            name,
            year
          )
        `
        )
        .single();

      if (error) throw error;

      const castData = data as object as {
        id: string;
        email: string;
        name: string;
        created_at: string;
        class_id: { name: string; year: number };
      };


      const newStudent: Student = {
        id: castData.id,
        email: castData.email,
        name: castData.name,
        created_at: castData.created_at,
        class_id: {
          name: castData.class_id.name,
          year: castData.class_id.year,
        },
      };

      setStudents([...prevStudents, newStudent]);
      setEmail("");
      setName("");
      setStudentClass(undefined);
      alert("Student added successfully");
    } catch (error: any) {
      console.error("Error adding student:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex max-h-[410px] flex-col gap-4 md:flex-row">
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
            placeholder="Enter email"
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
          <ClassSelector
            setClass={setStudentClass}
            currentClass={studentClass}
            classes={classes}
            setClasses={setClasses}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Student"}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          <Button variant="link" onClick={() => router.push('/protected/bulk-upload')}>
            <FileStackIcon size={16} />
            Bulk Upload
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};






export default NewStudentCard;
