import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import FormDetail from "@/components/FormDetails"

const FormDetailsPage = ({ params }: { params: { formId: string } }) => {

  const path = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Forms', href: '/forms' }]
  return (
    <>
      <BreadcrumbWrapper paths={path} />
      <FormDetail formId={params.formId} />
    </>
  )
}

export default FormDetailsPage
