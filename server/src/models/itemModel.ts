import mongoose, { Document, Schema, model } from "mongoose";

export interface IItem extends Document {
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
  contact_no?: string;
  seller: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const ItemSchema = new Schema<IItem>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    images: [
      {
        url: String,
        key: String,
      },
    ],
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    year_of_purchase: {
      type: Number,
      required: [true, "Year of purchase is required"],
    },
    room_no: {
      type: String,
    },
    hostel_no: {
      type: String,
      required: [true, "Hostel number is required"],
    },
    contact_no: {
      type: String,
    },

    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller is required"],
    },
  },
  { timestamps: true }
);

const Item = mongoose.model<IItem>("Item", ItemSchema);
export default Item;
