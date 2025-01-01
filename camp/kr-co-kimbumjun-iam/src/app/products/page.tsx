import Link from 'next/link';

export default function ProductList() {
  const productId = 100;

  return (
    <>
      <Link href="/">Home</Link>
      <h1>Product List</h1>
      <h2>Product 1</h2>
      <h2>
        <Link href="products/1">Product 1</Link>
      </h2>
      <h2>
        <Link href="products/2">Product 2</Link>
      </h2>
      <h2>
        <Link href="products/3" replace>
          Product 3
        </Link>
      </h2>
      <h2>
        <Link href="products/4">Product 4</Link>
      </h2>

      <h2>
        <Link href={`products/${productId}`}>Product {productId}</Link>{' '}
      </h2>
    </>
  );
}

/// hello, world fine tha / hello, world fine tha a you next.js! RLD
// Tha / Hello, World Fine Tha a You Next.js!
/// Hello, World Fine Tha / Hello, orld Fine Tha a You Next.js!
//rld Fine
//dk
