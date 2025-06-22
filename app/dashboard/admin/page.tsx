import { redirect } from 'next/navigation';

function AdminPage() {
  return redirect('/dashboard/admin/products');
}
export default AdminPage;
