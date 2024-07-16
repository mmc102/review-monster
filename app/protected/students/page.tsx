'use client'
import React, { useState } from 'react'
import StudentsTable from '@/components/StudentsTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import NewStudentCard from '@/components/NewStudentCard'
import { Student } from '@/types'

const StudentsPage: React.FC = () => {

  const path = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Students', href: '/students' }]

  const [students, setStudents] = useState<Student[]>([]);
  return (
    <>
      <BreadcrumbWrapper paths={path} />
      <div className="mt-10 flex flex-row gap-10">
        <StudentsTable students={students} setStudents={setStudents} />
        <NewStudentCard setStudents={setStudents} prevStudents={students} />
      </div>
    </>
  )
}

export default StudentsPage
