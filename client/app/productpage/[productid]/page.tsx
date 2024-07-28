/* eslint-disable prettier/prettier */
import * as React from 'react';
import { Image } from '@nextui-org/image';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Button } from '@nextui-org/button';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ChatIcon } from '@/components/icons';

export default function ProductPage({
  params,
}: {
  params: { productid: string };
}) {
  const product = dummyData[Number(params.productid) - 1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card
        isBlurred
        className="justify-center items-center w-full mx-auto"
        shadow="lg"
      >
        <Carousel
          className="w-full relative"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem key={index}>
                <Image
                  isBlurred
                  alt="Product image"
                  className="object-cover w-full h-full"
                  src={product.images[index]}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2" />
          <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2" />
        </Carousel>
      </Card>

      <Card isBlurred className="w-full mx-auto" shadow="lg">
        <CardHeader className="flex flex-col gap-3 items-start text-left">
          <li className="font-bold text-lg">Title: {product.title}</li>
          <li className="font-bold text-lg">Price: {product.price}</li>
          <li className="font-bold text-lg">Category: {product.category}</li>
        </CardHeader>
        <Divider />
        <CardBody>
          <li className="font-bold text-lg">
            Description:{' '}
            <p className="ml-6 font-normal">{product.description}</p>
          </li>
          <li className="font-bold text-lg">
            Year of Purchase: {product.year_of_purchase}
          </li>
        </CardBody>
        <Divider />
        <CardBody>
          <li className="font-bold text-lg">Seller Details</li>
          <div className="ml-6">
            <li className="font-normal text-lg">
              Name: {product.seller_details.name}
            </li>
            <li className="font-normal text-lg">
              Room Number:{' '}
              {product.seller_details.room_no
                ? product.seller_details.room_no
                : 'Not Available'}
            </li>
            <li className="font-normal text-lg">
              Hostel Number: {product.seller_details.hostel_no}
            </li>
          </div>
        </CardBody>
        <Divider />
        <CardFooter>
          <Button
            fullWidth
            className="mx-10 font-bold text-lg"
            color="success"
            size="lg"
            startContent={<ChatIcon />}
            variant="shadow"
          >
            Chat with Seller
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

const dummyData = [
  {
    id: '1',
    title: 'used laptop for sale',
    price: '$350',
    category: 'electronics',
    description:
      'a gently used laptop in good condition. ideal for students or professionals. comes with charger and original box.',
    year_of_purchase: '2021',
    seller_details: {
      name: 'john doe',
      room_no: '203',
      hostel_no: 'a1',
    },
    images: [
      'https://example.com/images/laptop1.jpg',
      'https://example.com/images/laptop2.jpg',
      'https://example.com/images/laptop3.jpg',
      'https://example.com/images/laptop4.jpg',
    ],
  },
  {
    id: '2',
    title: 'vintage bicycle',
    price: '$150',
    category: 'sports & outdoors',
    description:
      'a classic vintage bicycle with a sturdy frame. recently tuned up and in great working condition.',
    year_of_purchase: '2015',
    seller_details: {
      name: 'jane smith',

      hostel_no: 'b2',
    },
    images: [
      'https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg',
      'https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg',
      'https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg',
      'https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1',
    ],
  },
  {
    id: '3',
    title: 'mini fridge',
    price: '$100',
    category: 'appliances',
    description:
      'compact mini fridge, perfect for small spaces. includes a small freezer compartment.',
    year_of_purchase: '2019',
    seller_details: {
      name: 'alex johnson',
      room_no: '307',
      hostel_no: 'c3',
    },
    images: [
      'https://example.com/images/fridge1.jpg',
      'https://example.com/images/fridge2.jpg',
      'https://example.com/images/fridge3.jpg',
    ],
  },
  {
    id: '4',
    title: 'textbooks bundle',
    price: '$80',
    category: 'books',
    description:
      'a bundle of textbooks for various subjects, including math, science, and english. all books are in good condition.',
    year_of_purchase: '2022',
    seller_details: {
      name: 'emily davis',
      room_no: '410',
      hostel_no: 'd4',
    },
    images: [
      'https://example.com/images/textbooks1.jpg',
      'https://example.com/images/textbooks2.jpg',
    ],
  },
  {
    id: '5',
    title: 'gaming console',
    price: '$200',
    category: 'electronics',
    description:
      'used gaming console with two controllers and several games. in excellent working condition.',
    year_of_purchase: '2020',
    seller_details: {
      name: 'michael brown',
      room_no: '501',
      hostel_no: 'e5',
    },
    images: [
      'https://example.com/images/console1.jpg',
      'https://example.com/images/console2.jpg',
      'https://example.com/images/console3.jpg',
      'https://example.com/images/console4.jpg',
    ],
  },
];
