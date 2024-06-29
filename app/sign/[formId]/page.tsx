import SignForm from '@/components/SignForm'

const SignFormPage = ({ params }: { params: { formId: string } }) => {
  return <SignForm formId={params.formId} />
}

export default SignFormPage
