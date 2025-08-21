// app/layout.tsx (or app/(protected)/layout.tsx if you group routes)
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // get the session server-side
  const session = await getServerSession(authOptions);

  // if not signed in, redirect to sign-in page
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="root-layout">
      <nav>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={38} height={32} />
          <h3 className="text-primary-100">PrepWise</h3>
        </Link>
      </nav>
      {children}
    </div>
  );
}
