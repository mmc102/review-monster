'use client'

import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { IForm, getUserForms } from "@/lib/fileManager";
import PDFViewer from "./PDFViewer";
import { Button } from "./ui/button";
import SkeletonLoader from './SketetonLoader'



const FormsTable: React.FC = () => {
  const [forms, setForms] = useState<IForm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const forms = await getUserForms();
        setForms(forms);
      } catch (error: any) {
        console.error('Error fetching forms:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleViewForm = (formId: string) => {
    router.push(`/form/${formId}`);
  };

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Forms</CardTitle>
        <CardDescription>Available forms</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Created Date</TableHead>
              <TableHead>Form</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                <TableRow>
                  <TableCell colSpan={4}>
                    <SkeletonLoader />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}>
                    <SkeletonLoader />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}>
                    <SkeletonLoader />
                  </TableCell>
                </TableRow>
              </>
            ) : (
              forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    <div className="font-medium">{form.name}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(form.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <PDFViewer url={form.blobUrl} height={50} width={50} />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleViewForm(form.id)}>View Form</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};



export default  FormsTable