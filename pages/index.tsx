import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the App Router home page
    router.replace('/');
  }, [router]);

  return <div>Redirecting...</div>;
} 