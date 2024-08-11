'use client';

import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

function WithAuth({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();


        if (user) {
          setAuthenticated(true);
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="mt-10 text-center">Loading...</div>;
  }

  if (!authenticated) {
    return null; // This will prevent rendering while redirecting
  }

  return <>{children}</>;
}

export default WithAuth;
