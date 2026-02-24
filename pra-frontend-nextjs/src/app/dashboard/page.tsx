import { redirect } from 'next/navigation';

export default function Dashboard() {
  // Middleware will handle authentication check
  redirect('/dashboard/overview');
}
