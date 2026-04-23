"use client";

import { Suspense } from "react";
import PayClient from "./PayClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PayClient />
    </Suspense>
  );
}