"use client";
import React, { useEffect, useState } from "react";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  if (id === null) {
    return <div>Loading...</div>;
  }

  return <div className="text-3xl">User Profile: {id}</div>;
};

export default Page;
