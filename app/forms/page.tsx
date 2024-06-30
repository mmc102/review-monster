import React from 'react'
import FormsTable from '@/components/FormsTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import FormUpload from '@/components/FormUpload'

const FormsPage: React.FC = () => {

  return (
    <>
    <BreadcrumbWrapper paths={[{ label: 'Dashboard', href: '/dashboard' },{ label: 'Forms', href: '/forms' }]} />

    <div className="flex flex-row gap-10 mt-10">
    <FormsTable />
    <FormUpload />
</div>
  </>
  )
}

export default FormsPage 
