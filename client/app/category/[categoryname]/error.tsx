'use client';
import Ripple from '@/components/magicui/ripple';

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[475px]">
      <p className="font-black lg:text-5xl sm:text-2xl md:text-5xl mb-4 text-center">
        Oops! That page does not exist
      </p>
      <Ripple />
    </div>
  );
}
