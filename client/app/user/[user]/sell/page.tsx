"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Textarea } from "@nextui-org/input";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import GradualSpacing from "@/components/magicui/gradual-spacing";
import { GoogleIcon, UploadIcon } from "@/components/icons";
import { RootState } from "@/redux/store";

const SellPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = user ? true : false;

  if (!isLoggedIn) {
    toast.error("You need to be logged in to access this page", {
      id: "login",
    });
    router.replace("/login");
  }

  const sortedCategories = categories.sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [invalid, setInvalid] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const [isFileValid, setIsFileValid] = useState<boolean>(false);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || (/^\d{0,4}$/.test(value) && +value <= currentYear)) {
      setInvalid(false);
      setYear(value);
      setError("");
    } else {
      setInvalid(true);
      setError(`Please enter a valid year up to ${currentYear}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      const allowedFormats = ["image/jpeg", "image/png"];

      if (fileArray.length > 4) {
        setIsFileValid(true);

        toast.error("You can only upload up to 4 files.");

        return;
      }

      for (let file of fileArray) {
        if (!allowedFormats.includes(file.type)) {
          setIsFileValid(true);

          toast.error("Only JPEG, JPG, or PNG formats are allowed.");

          return;
        }
      }

      setIsFileValid(false);
      setFiles(fileArray);
      setFileError("");
    }
  };

  return (
    <div className="w-full">
      <Toaster />
      <GradualSpacing
        className="font-display text-center text-5xl font-bold mb-4 tracking-[-0.1em]  text-black dark:text-white md:text-5xl md:leading-[5rem]"
        text="Sell an Item"
      />
      <form className="items-center justify-center flex flex-col gap-4 w-full">
        <Select
          isRequired
          items={sortedCategories}
          label="Category"
          placeholder="Select a category"
          selectionMode="single"
          variant="bordered"
        >
          {(category) => (
            <SelectItem key={category.label} value={category.label}>
              {category.label}
            </SelectItem>
          )}
        </Select>
        <Input
          isClearable
          isRequired
          label="Item Title"
          placeholder="Enter Item title"
          variant="bordered"
        />
        <Textarea
          disableAutosize
          isRequired
          label="Item Description"
          placeholder="Enter the Item description"
          variant="bordered"
        />

        <Input
          isRequired
          errorMessage={error}
          isInvalid={invalid}
          label="Year of Purchase"
          max={currentYear}
          min={1900}
          placeholder="e.g.: 2024"
          type="number"
          variant="bordered"
          onChange={handleYearChange}
        />

        <Input
          isClearable
          isRequired
          label="Item Price"
          placeholder="Set A Price"
          startContent="₹"
          type="number"
          variant="bordered"
        />
        <Input
          isClearable
          label="Room Number"
          placeholder="e.g.: 376"
          type="number"
          variant="bordered"
        />
        <Input
          isClearable
          isRequired
          label="Hostel Number"
          placeholder="e.g.: 11"
          type="number"
          variant="bordered"
        />

        <Button
          fullWidth
          color="secondary"
          size="lg"
          startContent={<UploadIcon />}
          variant="shadow"
        >
          Upload Upto 4 Photos
          <Input
            fullWidth
            isClearable
            multiple
            accept=".jpeg, .jpg, .png"
            className="absolute inset-0.5 opacity-0 cursor-pointer"
            errorMessage={fileError}
            isInvalid={isFileValid}
            size="lg"
            type="file"
            variant="bordered"
            onChange={handleFileChange}
          />
        </Button>

        <Button
          fullWidth
          color="success"
          size="lg"
          startContent={<GoogleIcon />}
          variant="shadow"
        >
          Upload Ad
        </Button>
      </form>
    </div>
  );
};

export default SellPage;

const categories = [
  {
    label: "Electronics",
  },
  {
    label: "Clothing",
  },
  {
    label: "Stationery",
  },
  {
    label: "Hostel Essentials",
  },
  {
    label: "Shoes",
  },
  {
    label: "Sports",
  },
  {
    label: "Others",
  },
  {
    label: "Books and Notes",
  },
  {
    label: "Bikes",
  },
  {
    label: "Accessories",
  },
  {
    label: "Beauty and Health",
  },
];
