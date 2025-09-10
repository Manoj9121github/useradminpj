import { PageProps } from 'next/app'; // This import might be needed depending on Next.js version
import BillPageContent from './BillPageContent';

// Define a type for the page props that correctly handles searchParams.
type BillPageProps = {
  searchParams: {
    orderId?: string;
  };
};

export default function Page({ searchParams }: BillPageProps) {
  return <BillPageContent orderId={searchParams?.orderId} />;
}