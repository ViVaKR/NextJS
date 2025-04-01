// * src/app/(root)/google/layout.tsx
import { ReactNode, Suspense } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
