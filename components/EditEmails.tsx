'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import RichTextEditor from './RichText';
import { getRawEmails, prepareHtml, saveEmails } from '@/lib/emailSender';
import { useRouter } from 'next/navigation';


const EditEmails = () => {

    const router = useRouter()

    const [reminderSubject, setReminderSubject] = useState('');
    const [reminderBody, setReminderBody] = useState('');
    const [initialSubject, setInitialSubject] = useState('');
    const [initialBody, setInitialBody] = useState('');



    const handleSave = () => {
        saveEmails({ reminderBody, reminderSubject, initialBody, initialSubject })
        router.push('/protected/dashboard')
    };


    useEffect(() => {
        const setEmails = async () => {

            const data = await getRawEmails()

            setReminderSubject(data.reminderSubject)
            setReminderBody(data.reminderBody)
            setInitialSubject(data.initialSubject)
            setInitialBody(data.initialBody)

        }
        setEmails()

    }, [])
    return (
        <>
            <Button className='mb-2' onClick={handleSave}>
                Save
            </Button>
            <div className="flex flex-col gap-4">
                <EmailCard
                    title="Initial Email"
                    description="Send this email to parents when a new student is added"
                    setBody={setInitialBody}
                    body={initialBody}
                    subject={initialSubject}
                    setSubject={(e: any) => setInitialSubject(e.target.value)}
                />
                <EmailCard
                    title="Reminder Email"
                    description="Send this email to remind parents to sign"
                    setBody={setReminderBody}
                    body={reminderBody}
                    subject={reminderSubject}
                    setSubject={(e: any) => setReminderSubject(e.target.value)}
                />
            </div>
            <Button className='mt-2' onClick={handleSave}>
                Save
            </Button>

        </>
    );
};

function EmailCard({ title, description, subject, body, setSubject, setBody }: any) {
    return (
        <div className="flex flex-row gap-2">
            <Card className="min-w-[800px]">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label>
                        Subject:
                        <Input
                            type="text"
                            value={subject}
                            onChange={setSubject}
                        />
                    </Label>
                    <Label>
                        Body:
                        <div className="min-h-[350px]">
                            <RichTextEditor value={body} onChange={setBody}></RichTextEditor>
                        </div>
                    </Label>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col">
                        <CardDescription>{"Use ${student_name} for student name"}</CardDescription>
                        <CardDescription>{"Use ${daycare_name} for daycare name"}</CardDescription>
                        <CardDescription>{"Use ${link} for link"}</CardDescription>
                    </div>
                </CardFooter>
            </Card>
            <Card className='min-w-[500px]'>

                <CardContent className="m-4 gap-2">
                    <CardTitle>{prepareHtml(subject, "John Doe", "The Magic Daycare", "www.daycareisawesome.com")}</CardTitle>
                    <div className="mt-2" dangerouslySetInnerHTML={{ __html: prepareHtml(body, "John Doe", "The Magic Daycare", "www.daycareisawesome.com") }}>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default EditEmails;
