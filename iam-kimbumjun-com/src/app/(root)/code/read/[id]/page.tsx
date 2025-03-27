
import { Suspense } from "react";

import { CodeReadContent } from "./CodeReadContent";

export default async function CodeReadPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CodeReadContent id={Number(id)} />
    </Suspense>
  );
}
