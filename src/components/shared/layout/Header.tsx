import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export async function Header() {
  const { userId } = await auth();

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <Link href="/">
        <h1 className="text-xl font-bold">UtardiAdvisor</h1>
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li><Link href="/project-advisor">Project Advisor</Link></li>
          <li><Link href="/project-advisor/profile">Profile</Link></li>
          <li><Link href="/project-advisor/virtual-try-on">Virtual Try-On</Link></li>
          <li><Link href="/project-advisor/outfit-builder">Outfit Builder</Link></li>
          <li><Link href="/pricing">Pricing</Link></li>
        </ul>
      </nav>
      <div>
        {userId ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <Link href="/sign-in">
            <button className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600">Sign In</button>
          </Link>
        )}
      </div>
    </header>
  );
}
