import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SignedFormDetail from "@/components/SignedFormDetails"

const SignedFormPage = ({ params }: { params: { assignedFormId: string } }) => {

    const path = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Signed Form', href: '/dashboard' }]
    return (
        <>
            <BreadcrumbWrapper paths={path} />
            <SignedFormDetail assignedFormId={params.assignedFormId} />
        </>
    )
}

export default SignedFormPage
