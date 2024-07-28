/* eslint-disable prettier/prettier */

import { CartIcon } from '@/components/icons';
import GradualSpacing from '@/components/magicui/gradual-spacing';
import ProductList from '@/components/product-list';
import { Button } from '@nextui-org/button';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-row items-center justify-center gap-4 mb-4">
        <Toaster />
        <Button isIconOnly variant="ghost" size="lg">
          <CartIcon size={30} />
        </Button>{' '}
        <GradualSpacing
          className="font-display text-center text-5xl font-bold tracking-[-0.1em]  text-black dark:text-white md:text-5xl md:leading-[5rem]"
          text="Buy & Sell Used Items"
        />
      </div>

      <ProductList category="" />
    </section>
  );
}
