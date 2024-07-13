'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import PDFViewer from './PDFViewer'
import { FormStatus, SignedFormDetails } from "@/types"
import { getSignedFormDetails } from '@/lib/SignedForms'

interface FormDetailsProps {
  assignedFormId: string
}

const SignedFormDetail: React.FC<FormDetailsProps> = ({ assignedFormId }) => {
  const [form, setForm] = useState<SignedFormDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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
      <Card className='max-h-48'>
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
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignedFormDetail
