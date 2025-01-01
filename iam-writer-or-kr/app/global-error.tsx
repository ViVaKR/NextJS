"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { sigest?: string };
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Global Error</h2>
      </body>
    </html>
  );
}
