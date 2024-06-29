import StudentFormsTable from '@/components/StudentTable'

const StudentFormsPage = ({ params }: { params: { studentId: string } }) => {
  return <StudentFormsTable studentId={params.studentId} />
}

export default StudentFormsPage
