import React from 'react'
import StudentsTable from '@/components/StudentsTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import NewStudentCard from '@/components/NewStudentCard'

const StudentsPage: React.FC = () => {

  const path = [{ label: 'Dashboard', href: '/dashboard' },{ label: 'Students', href: '/students' }]
  return (
    <>
    <BreadcrumbWrapper paths={path} />
    <div className="flex flex-row gap-10 mt-10">
    <StudentsTable />
    <NewStudentCard />
    </div>
</>
  )
}

export default StudentsPage
