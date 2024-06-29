'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import {Badge}  from '@/components/ui/badge'
import { FormDetails, getFormDetails } from '@/lib/FormDetails'
import PDFViewer from './PDFViewer'

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

  if (loading || !form) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
    <PDFViewer url={form.blobUrl} height={500} width={500} />
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
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form.students.map((student: any) => (
              <TableRow key={student.id}>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell className="hidden md:table-cell">{new Date(student.assigned_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={student.completed ? 'bg-green-500' : 'bg-yellow-500'}>
                    {student.completed ? 'Signed' : 'Pending'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
</>
  )
}

export default FormDetail
