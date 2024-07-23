import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { BulkUploadCard } from "@/components/BulkStudentLoad"

const BulkUploadPage = () => {

    const path = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Bulk Edit', href: '/bulk-upload' }]
    return (
        <>
            <BreadcrumbWrapper paths={path} />
            <BulkUploadCard />
        </>
    )
}

export default BulkUploadPage

