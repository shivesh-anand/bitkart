/* eslint-disable prettier/prettier */
'use client';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import { Chip } from '@nextui-org/chip';
import BlurFade from './magicui/blur-fade';
import { useRouter } from 'next/navigation';

interface ProductProps {
  category: string | undefined;
}

const ProductList = ({ category }: ProductProps) => {
  const router = useRouter();
  const filteredData = category
    ? dummyData.filter((item) => item.category === category)
    : dummyData;

  const handlePress = (id: number) => {
    router.push(`/productpage/${id}`);
  };

  return (
    <div className="flex flex-wrap gap-4 text-center justify-center">
      {filteredData.map((item) => (
        <BlurFade key={item.id} delay={0.25} inView>
          <Card
            className="py-4"
            isHoverable={true}
            isPressable={true}
            onPress={() => handlePress(item.id)}
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-row items-start gap-4">
              <Chip variant="faded">Posted On: {item.createdAt}</Chip>
              <h1 className="text-gray-400">Tap to View</h1>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                isZoomed
                alt="Card background"
                className="object-cover rounded-xl aspect-video"
                src="https://nextui.org/images/hero-card-complete.jpeg"
                height={225}
                width={300}
              />
            </CardBody>
            <CardFooter className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">₹{item.price}</h4>
              <p className="font-bold">{item.title}</p>
              <p>{item.address}</p>
            </CardFooter>
          </Card>
        </BlurFade>
      ))}
    </div>
  );
};

export default ProductList;

const dummyData = [
  {
    id: 1,
    title: 'Used MacBook Pro',
    price: 1200,
    address: '123 Main St, San Francisco, CA',
    createdAt: 'July 15, 2024',
    image: 'https://example.com/images/macbook-pro.jpg',
    category: 'Electronics',
  },
  {
    id: 2,
    title: 'Mountain Bike',
    price: 350,
    address: '456 Elm St, Denver, CO',
    createdAt: 'July 14, 2024',
    image: 'https://example.com/images/mountain-bike.jpg',
    category: 'Bikes',
  },
  {
    id: 3,
    title: 'Stationery Set',
    price: 15,
    address: '789 Pine St, Austin, TX',
    createdAt: 'July 13, 2024',
    image: 'https://example.com/images/stationery.jpg',
    category: 'Stationary',
  },
  {
    id: 4,
    title: 'Basketball',
    price: 25,
    address: '321 Oak St, Chicago, IL',
    createdAt: 'July 12, 2024',
    image: 'https://example.com/images/basketball.jpg',
    category: 'Sports',
  },
  {
    id: 5,
    title: 'Textbook Set',
    price: 60,
    address: '654 Cedar St, Seattle, WA',
    createdAt: 'July 11, 2024',
    image: 'https://example.com/images/textbooks.jpg',
    category: 'Books & Notes',
  },
  {
    id: 6,
    title: 'Hostel Bedding',
    price: 40,
    address: '987 Birch St, Miami, FL',
    createdAt: 'July 10, 2024',
    image: 'https://example.com/images/bedding.jpg',
    category: 'Hostel Essentials',
  },
  {
    id: 7,
    title: 'Running Shoes',
    price: 70,
    address: '123 Willow St, Denver, CO',
    createdAt: 'July 9, 2024',
    image: 'https://example.com/images/shoes.jpg',
    category: 'Shoes',
  },
  {
    id: 8,
    title: 'Leather Jacket',
    price: 100,
    address: '456 Maple St, Boston, MA',
    createdAt: 'July 8, 2024',
    image: 'https://example.com/images/jacket.jpg',
    category: 'Clothing',
  },
  {
    id: 9,
    title: 'Smartwatch',
    price: 150,
    address: '789 Spruce St, Portland, OR',
    createdAt: 'July 7, 2024',
    image: 'https://example.com/images/smartwatch.jpg',
    category: 'Accessories',
  },
  {
    id: 10,
    title: 'Skincare Set',
    price: 30,
    address: '321 Fir St, New York, NY',
    createdAt: 'July 6, 2024',
    image: 'https://example.com/images/skincare.jpg',
    category: 'Beauty & Health',
  },
  {
    id: 11,
    title: 'Vintage Lamp',
    price: 80,
    address: '654 Ash St, Los Angeles, CA',
    createdAt: 'July 5, 2024',
    image: 'https://example.com/images/lamp.jpg',
    category: 'Others',
  },
];
