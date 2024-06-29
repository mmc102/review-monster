'use client'

import React, { useEffect, useState } from 'react'
import { PDFDocument, rgb } from 'pdf-lib'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { getFormDetails } from '@/lib/FormDetails'
import { createClient } from '@/utils/supabase/client'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'


interface SignFormProps {
  formId: string
}
//TODO maybe this
//https://github.com/docusealco/docuseal-react-examples/blob/master/next-app/src/app/page.tsx
const SignForm: React.FC<SignFormProps> = ({ formId }) => {
    const supabase = createClient()
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [parentName, setParentName] = useState<string>('')
  const [signature, setSignature] = useState<string>('')

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

  const handleSign = async () => {
    if (!parentName || !signature) {
      alert('Please enter your name and signature')
      return
    }

    try {
      const pdfDoc = await PDFDocument.load(form.blobUrl
      )
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      const { width, height } = firstPage.getSize()

      firstPage.drawText(`Signed by: ${parentName}`, {
        x: 50,
        y: height - 50,
        size: 12,
        color: rgb(0, 0, 0),
      })

      firstPage.drawText(`Signature: ${signature}`, {
        x: 50,
        y: height - 70,
        size: 12,
        color: rgb(0, 0, 0),
      })

      const signedPdfBytes = await pdfDoc.save()

      const { data, error } = await supabase.storage
        .from('signed_forms')
        .upload(`signed/${formId}_${Date.now()}.pdf`, signedPdfBytes, {
          contentType: 'application/pdf',
        })

      if (error) {
        throw error
      }

      await supabase.from('signed_forms').update({ completed: true }).eq('form_id', formId)

      alert('Form signed successfully')
    } catch (error: any) {
      console.error('Error signing form:', error)
      alert(`Error signing form: ${error.message}`)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Sign Form</CardTitle>
        <CardDescription>{form.name}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Label htmlFor="parentName">Parent Name</Label>
        <Input
          id="parentName"
          type="text"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
          placeholder="Enter your name"
          required
        />
        <Label htmlFor="signature">Signature</Label>
        <Input
          id="signature"
          type="text"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder="Enter your signature"
          required
        />
        <Button onClick={handleSign}>Sign Form</Button>
      </CardContent>
    </Card>
  )
}

export default SignForm
