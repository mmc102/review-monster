import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface BreadcrumbPath {
  label: string
  href?: string
}

interface BreadcrumbWrapperProps {
  paths: BreadcrumbPath[]
}

const BreadcrumbWrapper: React.FC<BreadcrumbWrapperProps> = ({ paths }) => {
  return (
    <Breadcrumb className='mb-10'>
      <BreadcrumbList>
        {paths.map((path, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {path.href ? (
                <BreadcrumbLink href={`/protected${path.href}`}>{path.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{path.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < paths.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadcrumbWrapper
