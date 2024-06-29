'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import {
  Badge
} from '@/components/ui/badge'
import { AssignedForm, getStudentForms } from '@/lib/SignedForms'



const StudentFormsTable: React.FC<{studentId: string}> = ({studentId}) => {
  const [forms, setForms] = useState<AssignedForm[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const forms = await getStudentForms(studentId)
        console.log(forms)
        setForms(forms)
      } catch (error: any) {
        console.error('Error fetching forms:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchForms()
  }, [studentId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }


  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Student Forms</CardTitle>
        <CardDescription>List of forms signed or pending by the student</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Created Date</TableHead>
              <TableHead>Completed?</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell>
                  <div className="font-medium">{form.name}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{new Date(form.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={form.completed ? 'bg-green-500' : 'bg-yellow-500'}>
                    {form.completed}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default StudentFormsTable
