'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

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
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
