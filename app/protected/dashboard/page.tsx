import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import FormAdminTable from "@/components/FormAdmin";

export default async function Dashboard() {
 const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="mt-10 flex w-full flex-1 flex-col items-center gap-20">
      <div className="flex flex-1 flex-col gap-20 px-3">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Manage Students</CardTitle>
                <CardDescription>View and create students</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/protected/students">
                  <Button> Students<ArrowRightIcon/></Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Manage Forms</CardTitle>
                <CardDescription>View and create forms</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/protected/forms">
                  <Button>Forms<ArrowRightIcon/></Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Assign Forms</CardTitle>
                <CardDescription>Assign forms to students</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/protected/assign-forms">
                  <Button>Assign Forms<ArrowRightIcon/></Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          <FormAdminTable/>
      </div>
    </div>
  );
}
