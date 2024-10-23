export default function Docs({
  params,
}: {
  params: {
    slug: string[];
  };
}) {
  switch (params.slug?.length) {
    case 0:
      return <div>Docs home page</div>;
    case 1:
      return <div>Docs page: {params.slug[0]}</div>;
    case 2:
      return (
        <h1>
          Viewing docs for feature {params.slug[0]} and concept {params.slug[1]}
          <br />
          Viewing docs for feature {params.slug[0]}/{params.slug[1]}
        </h1>
        // <div>
        //
        // </div>
      );
    default:
      return <div>Docs page: {params.slug?.join('/')}</div>;
  }
}
