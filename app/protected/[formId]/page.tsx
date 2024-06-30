import FormDetail from "@/components/FormDetails"

const FormDetailsPage = ({ params }: { params: { formId: string } }) => {
  return ( 
  <FormDetail formId={params.formId} />
  )
}

export default FormDetailsPage
