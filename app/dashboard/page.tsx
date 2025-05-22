import { redirect } from 'next/navigation';

function DashboardPage() {
  return redirect('/dashboard/profile');
}
export default DashboardPage;
