import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";




export default async function Index() {

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  else {
    return redirect("/dashboard");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
          <h2 className="font-bold text-4xl mb-4">Loading...</h2>
      </div>
    </div>
  );
}
