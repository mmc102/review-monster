import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import StudentFormsTable from '@/components/StudentTable'

const StudentFormsPage = ({ params }: { params: { studentId: string } }) => {

  const path = [{ label: 'Dashboard', href: '/dashboard' },{ label: 'Students', href: '/students' }, { label: 'Student Forms', href: `/student/${params.studentId}` }]
  return (
    <>
    <BreadcrumbWrapper paths={path} /> 
  <StudentFormsTable studentId={params.studentId} />
</>

  )
}

export default StudentFormsPage
