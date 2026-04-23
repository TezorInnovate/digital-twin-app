"use client"; // client component
export const dynamic = "force-dynamic"; // prevent server-side pre-render

import PayClient from "./PayClient";

export default function Page() {
  return <PayClient />;
}