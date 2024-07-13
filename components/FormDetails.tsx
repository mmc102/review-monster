'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { FormDetails, FormDetailsStudent, getFormDetails } from '@/lib/FormDetails'
import PDFViewer from './PDFViewer'
import { FormStatus } from "@/types"

interface FormDetailsProps {
  formId: string
}

const FormDetail: React.FC<FormDetailsProps> = ({ formId }) => {
  const [form, setForm] = useState<FormDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const formDetails = await getFormDetails(formId)
        setForm(formDetails)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFormDetails()
  }, [formId])

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
    <div className='flex flex-col'>
      <PDFViewer url={form.blobUrl} height={600} width={600} />
      <Card>
        <CardHeader className="px-7">
          <CardTitle>{form.name}</CardTitle>
          <CardDescription>Created on: {new Date(form.created_at).toLocaleDateString()}</CardDescription>
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
              {form.students.map((student: FormDetailsStudent) => (
                <TableRow key={student.id}>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(student.assigned_at).toLocaleDateString()}</TableCell>
                  <TableCell className="hidden md:table-cell">{student.signed_at ? new Date(student.signed_at).toLocaleDateString() : '---'}</TableCell>
                  <TableCell>
                    <Badge className={
                      student.status === FormStatus.Assigned ? 'bg-yellow-500' :
                        student.status === FormStatus.Signed ? 'bg-blue-500' :
                          'bg-green-500'
                    }>
                      {student.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default FormDetail
