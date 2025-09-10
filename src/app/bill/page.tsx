import BillPageContent from './BillPageContent';

// Mark the Page component as async to handle the Promise-based searchParams
export default async function Page({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const orderId = searchParams?.orderId;
  return <BillPageContent orderId={orderId} />;
}