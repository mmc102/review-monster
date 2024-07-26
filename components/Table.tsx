'use client'

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
import { Button } from "./ui/button";


interface Columns {
  header: string,
  attribute: string,
}

interface Actions {
  name: string,
  action: (id: string) => void
  enabled: (id: string) => boolean
}

interface TableProps {
  cols: Columns[],
  data: any[]
  actions: Actions[],
}

export default function GenericTable({ cols, data, actions }: TableProps) {
  const headers = cols.map((col, index) => <TableHead key={index}>{col.header}</TableHead>)

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Students</CardTitle>
        <CardDescription>List of students</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {headers}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((datum, index) => (
              <TableRow key={index}>
                {cols.map((col, index) => <TableCell key={index}>{datum[col.attribute]}</TableCell>)}
                <TableCell>
                  {actions.map((action, index) => (
                    <Button key={index} onClick={() => action.action(datum.id)} disabled={!action.enabled(datum.id)}>{action.name}</Button>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

