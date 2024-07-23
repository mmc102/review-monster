"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Class } from "@/types";
import { getUser } from "@/lib/utils";
import ClassSelector from "./ClassSelector";
import { useRouter } from "next/navigation";

export function BulkUploadCard() {
    const [currentClass, setCurrentClass] = useState<string | undefined>(
        undefined
    );
    const [classes, setClasses] = useState<Class[]>([]);
    const [students, setStudents] = useState<{ name: string, email: string }[]>([]);
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

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
            }) as string[][];

            const students = jsonData.slice(1).map((row) => {
                row[0] = row[0]?.trim();
                row[1] = row[1]?.trim();
                if (!row[0] || !row[1]) {
                    return null;
                }
                return {
                    email: row[0],
                    name: row[1],
                };
            }).filter(student => student !== null);

            setStudents(students as { name: string, email: string }[]);
        };

        reader.readAsArrayBuffer(file);
    };

    const handleRemoveStudent = (index: number) => {
        setStudents((prevStudents) => prevStudents.filter((_, i) => i !== index));
    };

    const handleConfirmUpload = async () => {
        if (!currentClass) {
            alert("Please fill in all fields");
            return;
        }
        const user = await getUser();
        setLoading(true);

        try {
            const { data, error } = await supabase.from("students").insert(
                students.map((student) => ({
                    ...student,
                    created_at: new Date().toISOString(),
                    class_id: parseInt(currentClass),
                    user_id: user.id,
                    daycare_id: user.daycare_id,
                }))
            ).select(`
                id,
                email,
                name,
                created_at,
                class_id (
                    name,
                    year
                )
            `);

            if (error) throw error;

            const newStudents = data.map((castData: any) => ({
                id: castData.id,
                email: castData.email,
                name: castData.name,
                created_at: castData.created_at,
                class_id: {
                    name: castData.class_id.name,
                    year: castData.class_id.year,
                },
            }));
            alert("Students added successfully");
            router.push('/protected/students')

            setStudents([]);
        } catch (error: any) {
            console.error("Error adding students:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bulk Upload Students</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <ClassSelector
                    setClass={setCurrentClass}
                    setClasses={setClasses}
                    currentClass={currentClass}
                    classes={classes}
                />

                <Label htmlFor="bulkUpload">Upload Excel File</Label>
                <CardDescription>
                    The first row should be the column headers: Email, Name
                </CardDescription>
                <Input
                    id="bulkUpload"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                />

                {students.length > 0 && (
                    <div className="max-w-[500px]">
                        <h3 className="text-lg font-semibold ">Students to Upload</h3>
                        <ul>
                            {students.map((student, index) => (
                                <li key={index} className="m-1 flex items-center justify-between">
                                    <span>{student.name} ({student.email})</span>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleRemoveStudent(index)}
                                    >
                                        Remove
                                    </Button>
                                </li>
                            ))}
                        </ul>
                        <Button onClick={handleConfirmUpload} disabled={loading}>
                            {loading ? "Uploading..." : "Confirm and Upload"}
                        </Button>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                {<CardDescription>{error && <p className="text-red-500">{error}</p>}</CardDescription>}
            </CardFooter>
        </Card>
    );
}
