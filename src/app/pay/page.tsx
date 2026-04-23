// /app/pay/page.tsx
"use client"; // make the page a client component
export const dynamic = "force-dynamic"; // disable server-side prerender

import PayClient from "./PayClient";

export default function Page() {
  return <PayClient />;
}