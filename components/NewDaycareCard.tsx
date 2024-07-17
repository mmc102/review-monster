'use client';

import { createClient } from "@/utils/supabase/client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation'

const NewDaycareCard = () => {
    const [name, setName] = useState<string>('');

    const supabase = createClient();
    const router = useRouter();




    const handleAddNewDaycare = async () => {
        if (!name) {
            alert('Please fill in the name fields');
            return;
        }

        try {

            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) throw authError

            const { data, error } = await supabase.from('daycares').insert({
                name: name,
                address: null,
            }).select().single();

            if (error) throw error;

            const { error: UserError } = await supabase.from('user_daycares').insert({
                user_id: user.id,
                daycare_id: data.id,
            })



            if (UserError) throw UserError;


            router.push('/protected/dashboard');



        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="mt-10 flex max-h-[410px] flex-col gap-4 md:flex-row">
            <Card>
                <CardHeader>
                    <CardTitle>New Daycare</CardTitle>
                    <CardDescription>We need to know which daycare you work for!</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Label htmlFor="newClassName">Class Name</Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Daycare Name"
                    />
                    <Button onClick={handleAddNewDaycare}>Add New Daycare</Button>
                </CardContent>
            </Card>
        </div >
    );
};

export default NewDaycareCard;

