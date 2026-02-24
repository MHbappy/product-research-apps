import { redirect } from 'next/navigation';

export default function Page() {
  // Middleware will handle authentication check
  redirect('/dashboard/overview');
}
