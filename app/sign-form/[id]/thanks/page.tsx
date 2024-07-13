'use client'
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ThankYouPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();


  return (
    <Card className='mt-10 gap-3'>
      <CardHeader>
        <CardTitle>Thank You!</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>Thank you for signing the form. Your submission has been received.</CardDescription>
        <Button className="mt-4" onClick={() => router.push(`/sign-form/${params.id}`)}>Back to Form</Button>
      </CardContent>
    </Card>
  );
};

export default ThankYouPage;

