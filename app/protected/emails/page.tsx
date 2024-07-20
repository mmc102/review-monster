import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import EditEmails from "@/components/EditEmails"

const EditEmailsPage = () => {

    const path = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Edit Emails', href: '/emails' }]
    return (
        <>
            <BreadcrumbWrapper paths={path} />
            <EditEmails />
        </>
    )
}

export default EditEmailsPage 
