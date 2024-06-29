import FormDetails from "@/components/FormDetails"

const FormDetailsPage = ({ params }: { params: { formId: string } }) => {
  return ( 
  <>
  <FormDetails formId={params.formId} />
</>
  )
}

export default FormDetailsPage
