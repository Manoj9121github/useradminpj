import BillPageContent from './BillPageContent';

export default function Page({ searchParams }: { searchParams: { orderId?: string } }) {
  // directly pass searchParams.orderId to client component
  return <BillPageContent orderId={searchParams?.orderId} />;
}
