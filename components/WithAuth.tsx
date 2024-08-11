// components/WithAuth.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

function WithAuth({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (user) {
        setAuthenticated(true);
      } else {
        router.push('/login');
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    if (pathname === "/login") {
      return <>{children}</>
    }
    return null;
  }


  return <>{children}</>;
}

export default WithAuth;
