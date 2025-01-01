import { Metadata } from 'next';

type Props = {
  params: {
    productId: string;
  };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const title = await new Promise((resolve) =>
    setTimeout(() => resolve(`Product iPhone ${params.productId}`), 1000)
  );
  return {
    title: `Product ${title}`,
    description: `Details about Product ${params.productId}`,
  };
};

export default function ProductDetails({ params }: Props) {
  return <h1>Details about Product! {params.productId}</h1>;
}
