"use client";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { CheckCircle2, LockIcon, User2Icon } from "lucide-react";
import { Spinner } from "@nextui-org/spinner";
import toast from "react-hot-toast";

import GradualSpacing from "@/components/magicui/gradual-spacing";
import ShineBorder from "@/components/magicui/shine-border";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/redux/api/userSlice";

const EditProfilePage = () => {
  const { data, isError, error, isLoading } = useGetUserProfileQuery({});
  const [updateUserProfile] = useUpdateUserProfileMutation();

  const isGoogleUser = data?.user?.googleId;

  //console.log("data", data);

  // Initialize form values
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  // Update form values when user data is fetched
  useEffect(() => {
    if (data?.user) {
      setFormValues({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        password: "",
        confirmPassword: "",
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formValues.password !== formValues.confirmPassword) {
      toast.error("Passwords do not match");

      return;
    }

    const { ...updatedUser } = formValues;

    // console.log("update user", updatedUser);
    // console.log("form values", formValues);

    try {
      await updateUserProfile(updatedUser).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    toast.error("An error occurred. Please try again.");
    console.log(error);
    return null;
  }

  return (
    <ShineBorder color={["#A07CFE", "#2BD2FF", "#2BFF88"]}>
      <Card fullWidth shadow="lg">
        <CardHeader className="flex flex-wrap gap-4 text-center text-5xl font-extrabold justify-center">
          <GradualSpacing
            className="font-display text-center text-5xl font-bold tracking-[-0.1em]  text-black dark:text-white md:text-5xl md:leading-[5rem]"
            text={`Hi! ${formValues.firstName} ${formValues.lastName}`}
          />
        </CardHeader>
        <CardBody>
          <form
            className="flex flex-col py-4 px-4 gap-4 w-full"
            onSubmit={handleSubmit}
          >
            <Input
              endContent={
                <User2Icon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Edit First Name"
              name="firstName"
              placeholder="First Name"
              type="text"
              value={formValues.firstName}
              variant="bordered"
              onChange={handleInputChange}
            />
            <Input
              endContent={
                <User2Icon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Edit Last Name"
              name="lastName"
              placeholder="Last Name"
              type="text"
              value={formValues.lastName}
              variant="bordered"
              onChange={handleInputChange}
            />

            {!isGoogleUser && (
              <>
                <Input
                  endContent={
                    <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="New Password"
                  name="password"
                  placeholder="Enter new Password"
                  type="password"
                  value={formValues.password}
                  variant="bordered"
                  onChange={handleInputChange}
                />
                <Input
                  endContent={
                    <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Confirm New Password"
                  name="confirmPassword"
                  placeholder="Re-Enter your new password"
                  type="password"
                  value={formValues.confirmPassword}
                  variant="bordered"
                  onChange={handleInputChange}
                />
              </>
            )}

            <Button
              className="font-semibold text-lg w-full"
              color="success"
              size="lg"
              startContent={<CheckCircle2 />}
              type="submit"
              variant="shadow"
            >
              Update
            </Button>
          </form>
        </CardBody>
      </Card>
    </ShineBorder>
  );
};

export default EditProfilePage;
