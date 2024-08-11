'use client';

import { useEffect, useState } from 'react';
import { usePathname, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

function WithAuth({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (user) {
        setAuthenticated(true);
      } else if (pathname !== '/login') {
        redirect('/login'); // Redirect only if not on login page
      }

      setLoading(false); // Set loading to false after checking authentication
    };

    checkAuth();
  }, [pathname]); // Add pathname to dependency array

  if (loading) {
    return <div className="ml-6" >Loading...</div>;
  }

  if (authenticated) {
    return <>{children}</>;
  }

  // If not authenticated and not on the login page, redirect
  if (pathname !== '/login') {
    redirect('/login');
  }

  // Render children if on the login page
  return <>{children}</>;
}

export default WithAuth;
