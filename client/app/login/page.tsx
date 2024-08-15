/* eslint-disable prettier/prettier */
"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { LockIcon, MailIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

import GradualSpacing from "@/components/magicui/gradual-spacing";
import { BorderBeam } from "@/components/magicui/border-beam";
import { GoogleIcon, SignIn } from "@/components/icons";
import { useLoginMutation } from "@/redux/api/apiSlice";
import { setCredentials } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";

const metadata = {
  title: "Login - Bitkart",
  description:
    "Login to your Bitkart account using your institute email ID. Secure and easy access to your account with email and password or Google login.",
  keywords: [
    "Bitkart login",
    "institute email login",
    "BIT Mesra login",
    "student login",
    "secure login",
    "second-hand marketplace",
    "online shopping",
    "BIT Mesra",
    "Birla Institute of Technology, Mesra",
    "Birla Institute of Technology",
    "BIT",
  ],
  author: "Shivesh Anand",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1.0",
  charset: "UTF-8",
};

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    const token = Cookies.get("token");

    if (isAuthenticated || token) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

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
      const response = await login(form).unwrap();

      dispatch(
        setCredentials({
          token: response.token,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          _id: response._id,
        })
      );

      toast.success("Logged in successfully", { id: "logged in" });

      router.push("/");
      window.location.reload();
    } catch (err: any) {
      if (
        err.data?.message ===
        "Your account is not verified. A verification email has been sent to your email address."
      ) {
        toast.error(err.data.message);
        //console.log(err);
        router.push(`/verify-otp/${err.data.userId}`);
      }
    }
  };

  return (
    <Card fullWidth={true} shadow="lg">
      <CardHeader className="text-center text-5xl font-extrabold justify-center">
        <GradualSpacing
          className="font-display text-center text-5xl font-bold tracking-[-0.1em]  text-black dark:text-white md:text-5xl md:leading-[5rem]"
          text="Log In"
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
              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            label="Email"
            name="email"
            placeholder="Enter your email e.g: btech10123.21@bitmesra.ac.in"
            value={form.email}
            isInvalid={isValidEmail}
            errorMessage="Please use your institute email id"
            variant="bordered"
            onChange={handleChange}
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
            className="font-bold text-lg w-full transition duration-200 hover:bg-green-500 hover:text-black"
            isDisabled={isLoading}
            size="lg"
            startContent={<SignIn />}
            type="submit"
            variant="shadow"
          >
            Login
          </Button>
        </form>
        <h1 className="text-center">OR</h1>
        <form className="flex flex-col py-4 px-4 gap-4 w-full">
          <Button
            className="font-bold text-lg w-full transition duration-200 hover:bg-green-500 hover:text-black"
            size="lg"
            startContent={<GoogleIcon />}
            isDisabled={isLoading}
            variant="shadow"
            onPress={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/google`)
            }
          >
            Login with Google
          </Button>
        </form>
      </CardBody>
      <CardFooter className="justify-center">
        Don&apos;t have an account yet?
        <Link
          showAnchorIcon
          className="px-4 font-bold text-lg"
          color="foreground"
          href="/signup"
        >
          Sign Up
        </Link>
      </CardFooter>
      <BorderBeam
        borderWidth={3}
        colorFrom="#0093E9"
        colorTo="#80D0C7"
        delay={9}
        duration={12}
        size={300}
      />
    </Card>
  );
};

export default LoginPage;
