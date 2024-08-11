"use client"
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
import { QueueItem } from "@/types"
import { useEffect, useState } from "react"
import { getReviews } from "@/lib/getters/get_reviews"
import { CommentThread } from "@/components/CommentThread"
import { useRouter } from "next/navigation"



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

function MobileCard({ data }: { data: QueueItem }) {
  return (
    <Card className="mb-2 rounded-lg bg-white p-4 shadow">
      <div className="mb-2 flex items-center justify-between">
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
      <div className="mt-2 text-sm text-gray-500">{new Date(data.createdDate).toDateString()}</div>
    </Card>
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




function MobileTable({ queueItems }: { queueItems: QueueItem[] }) {
  const router = useRouter()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
        <CardDescription>
          <Button variant={"secondary"} onClick={() => { router.push("/protected/review-queue") }}>Respond to reviews</Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {queueItems.length === 0 && <div className="text-center">No reviews found</div>}

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




function InnerTabContent({ queueItems }: { queueItems: QueueItem[] }) {
  return (
    <MobileTable queueItems={queueItems} />
  )
}

export default function Dashboard() {

  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQueueItems = async () => {
      try {
        const rawQueueItems = await getReviews();
        setQueueItems(rawQueueItems);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueItems();
  }, []);



  const filterQueue = (queueItems: QueueItem[], status: string) => {
    return queueItems.filter((item) => item.status === status);
  }

  if (loading) {
    return <div className="mt-10 text-center">Loading...</div>;
  }


  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">

          <main className="grid flex-1 gap-4  sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
              <TabsList className="mt-2 w-full items-center justify-between sm:w-[300px] sm:justify-normal">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected
                </TabsTrigger>
              </TabsList>
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