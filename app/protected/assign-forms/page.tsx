import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import FormAssignment from '@/components/FormAssignment';

const AssignFormsPage = () => {

  const path = [{ label: 'Dashboard', href: '/dashboard' },{ label: 'Form Assignment', href: '/assign-forms' }, ]
  return (
    <>
    <BreadcrumbWrapper paths={path} />
    <FormAssignment />
    </> 
)
};

export default AssignFormsPage;