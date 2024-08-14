export interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: {
    url: string;
    key: string;
  }[];
  category: string;
  year_of_purchase: number;
  room_no?: string;
  hostel_no: string;
  contact_no: string;
  seller: string;
  createdAt: Date;
  updatedAt: Date;
}
