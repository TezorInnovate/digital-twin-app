  // /app/pay/page.tsx
  "use client"; // must be client
  export const dynamic = "force-dynamic"; // disables static & SSR

  import PayClient from "./PayClient";

  export default function Page() {
    return <PayClient />;
  }