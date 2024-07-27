import {
  MoreHorizontal,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"



function WrappedBadge({ status }: { status: string }) {
  let badgeClass = "";

  switch (status) {
    case "approved":
      badgeClass = "bg-green-500";
      break;
    case "pending":
      badgeClass = "bg-yellow-500";
      break;
    case "rejected":
      badgeClass = "bg-red-500";
      break;
    default:
      badgeClass = "bg-gray-500"; // Fallback for unexpected statuses
      break;
  }

  return (
    <Badge className={badgeClass}>
      {status}
    </Badge>
  );
}

export function CommentThread({ data }: { data: QueueItem }) {

  return (
    <>
      <div className="text-sm text-gray-700 mb-2 bg-gray-100 p-2 rounded-md">
        {data.review}
      </div>
      <div className="text-sm text-gray-700 ml-4 pl-4 border-l-2 border-gray-200">
        <div className="font-semibold">Response:</div>
        {data.response}
      </div>
    </>
  )
}


function MobileCard({ data }: { data: QueueItem }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-2">
      <div className="flex items-center justify-between mb-2">
        <WrappedBadge status={data.status} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-haspopup="true"
              size="icon"
              variant="ghost"
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mb-2 font-medium">{data.reviewer}</div>
      <CommentThread data={data} />
      <div className="text-sm text-gray-500 mt-2">{data.createdDate}</div>
    </div>
  );
}



function DesktopRow({ data }: { data: QueueItem }) {
  return (
    <TableRow>
      <TableCell>
        <WrappedBadge status={data.status} />
      </TableCell>
      <TableCell className="font-medium">
        {data.reviewer}
      </TableCell>

      <TableCell>{data.review}</TableCell>
      <TableCell>
        {data.response}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {data?.createdDate}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-haspopup="true"
              size="icon"
              variant="ghost"
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}



export interface QueueItem {
  reviewer: string;
  review: string;
  response: string;
  status: string;
  createdDate: string;
}

function MobileTable({ queueItems }: { queueItems: QueueItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
        <CardDescription>
          Manage your reviews
        </CardDescription>
      </CardHeader>
      <CardContent>

        <MobileCard key={-1} data={queueItems[0]} />
        {queueItems.map((queueItem, index) => (
          <MobileCard key={index} data={queueItem} />
        ))}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{queueItems.length}</strong> of <strong>{queueItems.length}</strong>{" "}
          reviews
        </div>
      </CardFooter>
    </Card>
  )
}


function DesktopTable({ queueItems }: { queueItems: QueueItem[] }) {
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
        <CardDescription>
          Manage your reviews
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>
                Response
              </TableHead>
              <TableHead>
                Created
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queueItems.map((queueItem, index) => (
              <DesktopRow key={index} data={queueItem} />))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{queueItems.length}</strong> of <strong>{queueItems.length}</strong>{" "}
          reviews
        </div>
      </CardFooter>
    </Card>
  )
}



function InnerTabContent({ queueItems }: { queueItems: QueueItem[] }) {
  return (
    <div>
      {/* Display DesktopTable on md and larger screens */}
      <div className="hidden md:block">
        <DesktopTable queueItems={queueItems} />
      </div>
      {/* Display MobileTable on sm screens */}
      <div className="block md:hidden">
        <MobileTable queueItems={queueItems} />
      </div>
    </div>
  );
}

export default function Dashboard() {

  const queueItems: QueueItem[] = [
    {
      reviewer: "Alice",
      review: "The feature is well-implemented, but there's a minor issue with the UI alignment.",
      response: "Thank you for the feedback, Alice. We'll address the UI alignment issue promptly.",
      status: "approved",
      createdDate: "2024-07-20"
    },
    {
      reviewer: "Bob",
      review: "Great work! The performance improvements are noticeable, but the documentation could be more detailed.",
      response: "We appreciate your input, Bob. We'll enhance the documentation to provide more clarity.",
      status: "pending",
      createdDate: "2024-07-22"
    },
    {
      reviewer: "Charlie",
      review: "The new design is sleek and user-friendly. However, there's a bug when submitting the form under certain conditions.",
      response: "Thanks, Charlie. We're glad you like the design. We'll investigate and fix the form submission bug.",
      status: "rejected",
      createdDate: "2024-07-19"
    },
    {
      reviewer: "Dana",
      review: "The recent changes are good, but there are a few typos in the latest release notes.",
      response: "Apologies for the oversight, Dana. We'll correct the typos in the release notes.",
      status: "approved",
      createdDate: "2024-07-21"
    },
    {
      reviewer: "Eli",
      review: "The API integration is seamless. Could we get some more examples on how to use the new endpoints?",
      response: "Sure thing, Eli. We'll add more examples to the documentation for the new endpoints.",
      status: "pending",
      createdDate: "2024-07-23"
    }
  ];


  const filterQueue = (queueItems: QueueItem[], status: string) => {
    return queueItems.filter((item) => item.status === status);
  }


  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">

          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all">
                <InnerTabContent queueItems={queueItems} />
              </TabsContent>
              <TabsContent value="pending">
                <InnerTabContent queueItems={filterQueue(queueItems, "pending")} />
              </TabsContent>
              <TabsContent value="rejected">
                <InnerTabContent queueItems={filterQueue(queueItems, "rejected")} />
              </TabsContent>
              <TabsContent value="approved">
                <InnerTabContent queueItems={filterQueue(queueItems, "approved")} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}