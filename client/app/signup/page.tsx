/* eslint-disable prettier/prettier */
"use client";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import Cookies from "js-cookie";
import { LockIcon, MailIcon, User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { GoogleIcon, SignIn } from "@/components/icons";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import ShineBorder from "@/components/magicui/shine-border";
import { useRegisterMutation } from "@/redux/api/apiSlice";
import { RootState } from "@/redux/store";

const SignUpPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [register, { isLoading, error, isError }] = useRegisterMutation();
  const [isValidEmail, setIsValidEmail] = useState(false);

  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    const token = Cookies.get("token");

    if (isAuthenticated || token) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setForm({
  //     ...form,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    // Validate email
    if (name === "email") {
      if (!value.endsWith("@bitmesra.ac.in")) {
        setIsValidEmail(true);
      } else {
        setIsValidEmail(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await register(form).unwrap();

      toast.success(response.message);
      //console.log(response);
      //console.log(response.user._id);
      //dispatch(setCredentials(response.user));
      router.push(`/verify-otp/${response.user._id}`); // Redirect to home or other protected page
    } catch (err) {
      toast.error((err as Error).message);
      //console.log(err);
      // Handle errors (e.g., show error message to user)
    }
  };

  return (
    <ShineBorder color={["#A07CFE", "#2BD2FF", "#2BFF88"]}>
      <Card fullWidth={true} shadow="lg">
        <CardHeader className="text-center text-5xl font-extrabold justify-center">
          <GradualSpacing
            className="font-display text-center text-5xl font-bold tracking-[-0.1em]  text-black dark:text-white md:text-5xl md:leading-[5rem]"
            text="Sign Up"
          />
        </CardHeader>
        <CardBody className="items-center justify-center">
          <h1>Use your institute email id</h1>
          <form
            className="flex flex-col py-4 px-4 gap-4 w-full"
            onSubmit={handleSubmit}
          >
            <Input
              endContent={
                <User2Icon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="First Name"
              name="firstName"
              placeholder="Enter your first name"
              value={form.firstName}
              variant="bordered"
              onChange={handleChange}
              isRequired
            />
            <Input
              endContent={
                <User2Icon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Last Name"
              name="lastName"
              placeholder="Enter your last name"
              value={form.lastName}
              variant="bordered"
              onChange={handleChange}
              isRequired
            />
            <Input
              endContent={
                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Email"
              name="email"
              placeholder="Enter your email e.g: btech10123.21@bitmesra.ac.in"
              value={form.email}
              variant="bordered"
              onChange={handleChange}
              isInvalid={isValidEmail}
              errorMessage="Please enter your institute email id"
              isRequired
            />
            <Input
              endContent={
                <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Password"
              name="password"
              placeholder="Enter your password"
              type="password"
              value={form.password}
              variant="bordered"
              onChange={handleChange}
              isRequired
            />
            <Button
              className="w-full"
              color="success"
              isDisabled={isLoading}
              size="lg"
              startContent={<SignIn />}
              type="submit"
              variant="shadow"
            >
              Sign Up
            </Button>
          </form>

          <h1 className="text-center">OR</h1>
          <form className="flex flex-col py-4 px-4 gap-4 w-full">
            <Button
              className="w-full"
              color="success"
              size="lg"
              startContent={<GoogleIcon />}
              isDisabled={isLoading}
              variant="shadow"
              onPress={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/google`)
              }
            >
              Sign Up with Google
            </Button>
          </form>
        </CardBody>
        <CardFooter className="justify-center">
          Already have an account?
          <Link
            showAnchorIcon
            className="px-4 font-bold text-lg"
            color="foreground"
            href="/login"
          >
            Log In
          </Link>
        </CardFooter>
      </Card>
    </ShineBorder>
  );
};

export default SignUpPage;
