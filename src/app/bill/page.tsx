
import BillPageContent from './BillPageContent'; // adjust path if needed


export default function Page({
  searchParams,
}: {
  searchParams?: { orderId?: string };
}) {
 
  return <BillPageContent orderId={searchParams?.orderId} />;
}
