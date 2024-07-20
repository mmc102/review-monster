'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import PDFViewer from './PDFViewer'
import { FormStatus, SignedFormDetails } from "@/types"
import { getSignedFormDetails } from '@/lib/SignedForms'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface FormDetailsProps {
  assignedFormId: string
}

const SignedFormDetail: React.FC<FormDetailsProps> = ({ assignedFormId }) => {
  const [form, setForm] = useState<SignedFormDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleApprove = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('signed_forms')
        .update({ status: FormStatus.Accepted })
        .eq('id', assignedFormId);

      if (error) {
        throw error;
      }

    } catch (error: any) {
      console.error('Error approving form:', error);
      setError('Error approving form');
    }
    router.push('/protected/dashboard')

  };


  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const formDetails = await getSignedFormDetails(assignedFormId)
        setForm(formDetails)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFormDetails()
  }, [assignedFormId])

  if (loading) {
    return <div>Loading...</div>
  }
  if (!form) {
    return <div>No form found</div>
  }
  if (error) {
    return <div>Error: {error}</div>
  }


  return (
    <div className='flex flex-row'>
      <PDFViewer url={form.blobUrl} height={600} width={600} />
      <Card className='max-h-[250px]'>
        <CardHeader className="px-7">
          <CardTitle>{form.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="hidden md:table-cell">Assigned Date</TableHead>
                <TableHead className="hidden md:table-cell">Signed Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow key={form.student.id}>
                <TableCell>{form.student.email}</TableCell>
                <TableCell>{form.student.class}</TableCell>
                <TableCell className="hidden md:table-cell">{new Date(form.student.assigned_at).toLocaleDateString()}</TableCell>
                <TableCell className="hidden md:table-cell">{form.student.signed_at ? new Date(form.student.signed_at).toLocaleDateString() : '---'}</TableCell>
                <TableCell>
                  <Badge className={
                    form.student.status === FormStatus.Assigned ? 'bg-yellow-500' :
                      form.student.status === FormStatus.Signed ? 'bg-blue-500' :
                        'bg-green-500'
                  }>
                    {form.student.status}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
            <Button className='mt-2' disabled={form.status !== FormStatus.Signed} onClick={() => handleApprove()}>Approve</Button>
          </Table>

        </CardContent>
      </Card>
    </div>
  )
}

export default SignedFormDetail
