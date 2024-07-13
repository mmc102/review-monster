'use client'

import React, { useState } from 'react'
import { createForm } from '@/lib/fileManager'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

const FormUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [formName, setFormName] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
      setMessage('')
    }
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(event.target.value)
    setMessage('')
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage('No file selected')
      return
    }

    if (!formName) {
      setMessage('Please enter a form name')
      return
    }

    try {
      await createForm(file, formName)
      setMessage('File uploaded successfully')
      setFile(null)
      setFormName('')
    } catch (error: any) {
      setMessage(`Error uploading file: ${error.message}`)
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Create Form</CardTitle>
        <CardDescription>Create a new form and assign it a name</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Label htmlFor="formName">Form Name</Label>
        <Input
          id="formName"
          type="text"
          value={formName}
          onChange={handleNameChange}
          placeholder="Enter form name"
          required
        />
        <Label htmlFor="fileUpload">File</Label>
        <Input
          id="fileUpload"
          type="file"
          onChange={handleFileChange}
          required
        />
        {message && <p className="text-red-500">{message}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} className="w-full">
          Upload Form
        </Button>
      </CardFooter>
    </Card>
  )
}

export default FormUpload

