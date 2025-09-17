interface TextProps {
  params: {
    slug: string[]; // [...slug]는 slug라는 이름의 string 배열을 받는다.
  };
}

async function getProductsByCategory(categoryPath: string[]) {
  // 실제 DB 에서는 categoryPath 배열을 사용하여 WHERE 절을 구성
  // 예: 'electronics' 카테고리 하위의 'laptops' 카테고리 하위의 'gaming-laptops' 제품들
  return [
    { id: 1, name: `Product A (${categoryPath.join(' > ')})` },
    { id: 2, name: `Product B (${categoryPath.join(' > ')})` },
  ]
}

async function getCmsContent(pathSegments: string[]) {
  // 실제로는 pathSegments 를 사용하여 CMS API 를 호출
  // 예: fetch('/api/cms?path=' + pathSegments.join('/'))

  console.log('Fetch content for CMS path:', pathSegments);

  return {
    title: `CMS Page: ${pathSegments.join(' / ')}`,
    body: `이 내용은 CMS에서 경로 ${pathSegments.join('/')} 의 내용`
  }
}

export default async function ReadText({ params }: TextProps) {
  const { slug } = params;
  const currentPath = slug.join('/');

  const products = await getProductsByCategory(slug);
  const content = await getCmsContent(slug);

  return (
    <div className="p-4">

      <h1>Read Text</h1>

      <div>
        <h3>{content.title} </h3>
        <p>{content.body}</p>

        <p>
          요청된 URL: <code>/cms/{slug.join('/')}</code>
        </p>
      </div>

      <h2>
        {
          slug.join(' > ').toUpperCase()
        }
      </h2>

      <h2>제품 목록:</h2>

      <ul>
        {products.map((product, index) => (
          <li key={index}>{product.name}</li>
        ))}
      </ul>


      <ul>
        <li>
          URL 의 계층적인 구조를 가지거나, 여러 세그먼트가 결합되어 하나의 논리적인 경로를 형성할 때.
        </li>
        <li>
          /blog/2025/10/25/post-id
        </li>
      </ul>

      <code>
        {JSON.stringify(slug, null, 2)}
      </code>

      {slug.length > 0 ? (
        <p>
          현재 문서의 경로는
          <code>
            {currentPath}
          </code>
          입니다.
        </p>
      ) : (
        <p>
          문서의 경로가 제공되지 않았습니다.
        </p>
      )}

      <p>
        {slug[0]}
      </p>
      <p>
        {slug[1]}
      </p>

      <p>
        Lorem ipsum dolor sit amet.
      </p>

    </div>
  )
}
