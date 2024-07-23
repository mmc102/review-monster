"use client";

import React, { useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
    SelectGroup,
} from "@/components/ui/select";


import { createClient } from "@/utils/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Class } from "@/types";
import { getUser } from "@/lib/utils";


interface NewClassCardProps {
    setClasses: (classes: Class[]) => void;
    classes: Class[];
    setShowNewClass: (show: boolean) => void;
    setError?: (error: string | null) => void;
    setClass?: (studentClass: string) => void;
}

function NewClassCard({
    setClasses,
    classes,
    setShowNewClass,
    setError,
    setClass,
}: NewClassCardProps) {
    const [newClassName, setNewClassName] = useState<string>("");
    const [newClassYear, setNewClassYear] = useState<number>(
        new Date().getFullYear()
    );

    const handleAddNewClass = async () => {
        if (!newClassName || !newClassYear) {
            alert("Please fill in all class fields");
            return;
        }

        const supabase = createClient();
        const user = await getUser();

        try {
            const { data, error } = await supabase
                .from("class")
                .insert({
                    name: newClassName,
                    year: newClassYear,
                    user_id: user.id,
                    daycare_id: user.daycare_id,
                    created_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) throw error;

            setClasses([...classes, data]);
            setNewClassName("");
            setNewClassYear(new Date().getFullYear());
            setClass && setClass(data.id.toString());
            setShowNewClass(false);
            alert("Class added successfully");
        } catch (error: any) {
            console.error("Error adding class:", error);
            setError && setError(error.message);
        }
    };
    return (
        <>
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
            <Button variant='link' onClick={handleAddNewClass}>+ Add</Button>
            <Button variant="link" onClick={() => setShowNewClass(false)}>
                Cancel
            </Button>
        </>
    )

}


export default function ClassSelector({
    setClass,
    currentClass,
    classes,
    setClasses,
}: {
    setClass: (value: string) => void;
    currentClass: string | undefined;
    classes: Class[];
    setClasses: (classes: Class[]) => void;
}) {
    const [showNewClass, setShowNewClass] = useState(false)
    return (
        <>
            <Label htmlFor="class">Class</Label>
            <Select onValueChange={setClass} value={currentClass}>
                <SelectTrigger id="class">
                    <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id.toString()}>
                                {cls.name} ({cls.year})
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    {showNewClass ?
                        <NewClassCard
                            setClasses={setClasses}
                            classes={classes}
                            setShowNewClass={setShowNewClass}
                            setClass={setClass} />
                        :
                        <Button variant="link" onClick={() => setShowNewClass(true)}>
                            + New Class
                        </Button>
                    }
                </SelectContent>
            </Select>
        </>)
}