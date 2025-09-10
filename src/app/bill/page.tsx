import BillPageContent from './BillPageContent';

interface PageProps {
  searchParams?: { orderId?: string };
}

export default function Page({ searchParams }: PageProps) {
  // Pass the orderId as a string or undefined
  return <BillPageContent orderId={searchParams?.orderId} />;
}
