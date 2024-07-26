import Link from "next/link"
import {
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  Users2,
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
import { SideBar } from "@/components/SideBar"



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

function WrappedTableRow({ data }: { data: QueueItem }) {
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

function InnerTabContent({ queueItems }: { queueItems: QueueItem[] }) {
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
              <WrappedTableRow key={index} data={queueItem} />))}
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
        <SideBar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="size-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="#"
                    className="group flex size-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  >
                    <Package2 className="size-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">Review Monster</span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Home className="size-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <ShoppingCart className="size-5" />
                    Orders
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-foreground"
                  >
                    <Package className="size-5" />
                    Products
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Users2 className="size-5" />
                    Customers
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <LineChart className="size-5" />
                    Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
          </header>
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
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 gap-1">
                        <ListFilter className="size-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Filter
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        Pending
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Approved</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Rejected
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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