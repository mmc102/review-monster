import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import FormAdminTable from "@/components/FormAdmin";

async function getDaycareId(supabase: any, user_id: string): Promise<{ daycare_id: string | null }> {

  const { data: daycareData, error: daycareError } = await supabase
    .from('user_daycares')
    .select('daycare_id')
    .eq('user_id', user_id)
    .maybeSingle();

  if (daycareError) {
    throw daycareError
  } else {
    return { daycare_id: daycareData?.daycare_id };
  }
}

export default async function Dashboard() {

  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const { daycare_id } = await getDaycareId(supabase, user.id)


  if (!daycare_id) {
    return redirect("/protected/create-daycare");
  }

  return (
    <div className="mt-10 flex w-full flex-1 flex-col items-center gap-20">
      <div className="flex flex-1 flex-col gap-20 px-3">
        <div className="grid grid-cols-2 gap-6">
          <Card className="max-w-96">
            <CardHeader>
              <CardTitle>Manage Students</CardTitle>
              <CardDescription>View and create students</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/protected/students">
                <Button> Students<ArrowRightIcon /></Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="max-w-96">
            <CardHeader>
              <CardTitle>Manage Email Templates</CardTitle>
              <CardDescription>View and edit email templates </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/protected/emails">
                <Button> Emails<ArrowRightIcon /></Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="max-w-96">
            <CardHeader>
              <CardTitle>Manage Forms</CardTitle>
              <CardDescription>View and create forms</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/protected/forms">
                <Button>Forms<ArrowRightIcon /></Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="max-w-96">
            <CardHeader>
              <CardTitle>Assign Forms</CardTitle>
              <CardDescription>Assign forms to students</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/protected/assign-forms">
                <Button>Assign Forms<ArrowRightIcon /></Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <FormAdminTable />
      </div>
    </div >
  );
}
