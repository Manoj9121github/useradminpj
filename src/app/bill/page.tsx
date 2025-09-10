import BillPageContent from './BillPageContent';

export default function Page({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  return <BillPageContent orderId={searchParams?.orderId} />;
}
