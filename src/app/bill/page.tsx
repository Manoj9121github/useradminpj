import BillPageContent from './BillPageContent';

export default function Page({ searchParams }: any) {
  // Pass orderId to client component
  return <BillPageContent orderId={searchParams?.orderId} />;
}
