import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <CheckCircleIcon className="w-24 h-24 text-green-500 mb-4" />
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-600 mb-8">Thank you for your subscription.</p>
      <Link href="/">
        <button className="px-6 py-3 rounded bg-blue-500 text-white text-lg hover:bg-blue-600">Go to Dashboard</button>
      </Link>
    </div>
  );
}