"use client";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { AddIcon, CrossIcon, UploadIcon } from "@/components/icons";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import { useCreateItemMutation } from "@/redux/api/itemSlice";
import { RootState } from "@/redux/store";

const SellPage = () => {
  const router = useRouter();

  const [createItem] = useCreateItemMutation();

  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = !!user;

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

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

    setIsUploading(true);

    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
      let totalSize = 0;

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
        totalSize += file.size;
      }

      if (totalSize > 25 * 1024 * 1024) {
        // 25 MB
        setIsFileValid(true);
        setIsUploading(false);
        toast.error("Total file size exceeds 25 MB.");

        return;
      }

      setIsFileValid(false);
      setFiles(fileArray);
      setFileError("");
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (files.length === 0) {
      toast.error("Please upload at least one image.");

      return;
    }

    const formData = new FormData();

    formData.append("title", (e.target as any).title.value);
    formData.append("description", (e.target as any).description.value);
    formData.append("price", (e.target as any).price.value);
    formData.append("year_of_purchase", year);
    formData.append("room_no", (e.target as any).roomNumber.value);
    formData.append("hostel_no", (e.target as any).hostelNumber.value);
    formData.append("category", (e.target as any).category.value);

    const contactNumber = (e.target as any).contactNumber.value;

    if (contactNumber) {
      formData.append("contact_no", contactNumber);
    }

    files.forEach((file) => formData.append("images", file));
    //console.log("formData", formData);
    try {
      await createItem(formData).unwrap();
      toast.success("Item created successfully");
      setIsLoading(false);
      router.push("/"); // Redirect to items page or another page
    } catch (error) {
      //console.error("Error creating item:", error);
      toast.error("Failed to create item");
    }
  };

  return (
    <div className="w-full">
      <Toaster />
      <GradualSpacing
        className="font-display text-center text-5xl font-bold mb-4 tracking-[-0.1em] text-black dark:text-white md:text-5xl md:leading-[5rem]"
        text="Sell an Item"
      />
      <form
        className="items-center justify-center flex flex-col gap-4 w-full"
        onSubmit={handleSubmit}
      >
        <Select
          isRequired
          items={sortedCategories}
          label="Category"
          name="category"
          placeholder="Select a category"
          selectionMode="single"
          variant="bordered"
        >
          {(category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          )}
        </Select>
        <Input
          isClearable
          isRequired
          label="Item Title"
          name="title"
          placeholder="Enter Item title"
          variant="bordered"
        />
        <Textarea
          disableAutosize
          isRequired
          label="Item Description"
          name="description"
          placeholder="Enter the Item description"
          variant="bordered"
        />
        <Input
          isRequired
          errorMessage={error}
          isInvalid={invalid}
          label="Year of Purchase"
          name="year"
          placeholder="e.g.: 2024"
          type="number"
          variant="bordered"
          onChange={handleYearChange}
        />
        <Input
          isClearable
          isRequired
          label="Item Price"
          name="price"
          placeholder="Set A Price"
          startContent="₹"
          type="number"
          variant="bordered"
        />
        <Input
          isClearable
          label="Room Number (Optional)"
          name="roomNumber"
          placeholder="e.g.: 376"
          type="number"
          variant="bordered"
        />
        <Input
          isClearable
          isRequired
          label="Hostel Number"
          name="hostelNumber"
          placeholder="e.g.: 11"
          type="number"
          variant="bordered"
        />
        <Input
          isClearable
          label="Enter 10 digit Contact  (Optional)"
          name="contactNumber"
          placeholder="e.g.: 1234567890"
          type="number"
          variant="bordered"
        />

        <div className="relative">
          <Button
            fullWidth
            color="secondary"
            isDisabled={isLoading}
            isLoading={isLoading}
            size="lg"
            startContent={<UploadIcon />}
            variant="shadow"
          >
            {isUploading ? "Uploading" : "Upload Upto 4 Photos"}
          </Button>
          <Input
            fullWidth
            isClearable
            multiple
            accept=".jpeg, .jpg, .png"
            className="absolute inset-0 opacity-0 cursor-pointer"
            errorMessage={fileError}
            isInvalid={isFileValid}
            size="lg"
            type="file"
            variant="bordered"
            onChange={handleFileChange}
          />
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Selected Files:</h3>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2 gap-4"
              >
                <span>{file.name}</span>
                <Button
                  isIconOnly
                  color="danger"
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => handleRemoveFile(file)}
                >
                  <CrossIcon size={16} />
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <Button
          fullWidth
          color="success"
          isDisabled={isLoading}
          isLoading={isLoading}
          size="lg"
          startContent={<AddIcon />}
          type="submit"
          variant="shadow"
        >
          {isLoading ? "Uploading Item" : "Upload Item"}
        </Button>
      </form>
    </div>
  );
};

export default SellPage;

const categories = [
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  { label: "Stationery", value: "stationery" },
  { label: "Hostel Essentials", value: "hostel-essentials" },
  { label: "Shoes", value: "shoes" },
  { label: "Sports", value: "sports" },
  { label: "Others", value: "others" },
  { label: "Books and Notes", value: "books-and-notes" },
  { label: "Bikes", value: "bikes" },
  { label: "Accessories", value: "accessories" },
  { label: "Beauty and Health", value: "beauty-and-health" },
];
