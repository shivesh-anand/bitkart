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

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
    } catch (err: any) {
      toast.error(err.data.message);
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
      <CardBody>
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
            placeholder="Enter your email"
            value={form.email}
            variant="bordered"
            onChange={handleChange}
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
            type="submit"
            variant="shadow"
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
