import AuthButton from "@/components/AuthButton";
import FormUpload from "@/components/FormUpload";
import StudentsPage from "@/components/StudentsTable";
import FormsTable  from "@/components/FormsTable";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StudentFormsTable from "@/components/StudentTable";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm">
            <AuthButton />
          </div>
        </nav>
      </div>

      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <FormUpload/>
          <StudentsPage/>
          <FormsTable/>

        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>Daycard form sending</p>
      </footer>
    </div>
  );
}
