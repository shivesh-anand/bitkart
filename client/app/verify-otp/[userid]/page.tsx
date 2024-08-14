"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardFooter, CardBody } from "@nextui-org/card";
import Cookies from "js-cookie";

import GradualSpacing from "@/components/magicui/gradual-spacing";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/redux/api/apiSlice";
import { setCredentials } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";

const VerifyOtpPage = ({ params }: { params: { userid: string } }) => {
  const userId = params.userid;
  const dispatch = useDispatch();
  const router = useRouter();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isinValid, setIsInValid] = useState(false);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    const token = Cookies.get("token");

    if (isAuthenticated || token) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    if (e.target.value.length > 6) {
      setIsInValid(true);
    } else {
      setIsInValid(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp?.toString().length !== 6) {
      toast.error("OTP must be 6 digits");
      setIsInValid(true);

      return;
    }
    setIsInValid(false);
    setIsSubmitting(true);
    try {
      const response = await verifyOtp({ userId, otp }).unwrap();

      toast.success("Account verified successfully");
      dispatch(setCredentials(response.user));
      router.push("/login");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.data?.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ userId }).unwrap();
      toast.success("OTP resent successfully");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <Card
      className="w-full items-center justify-center flex flex-col"
      isBlurred={isSubmitting}
      shadow="lg"
    >
      <CardHeader className="text-center justify-center">
        <GradualSpacing
          className="font-display text-center text-5xl font-bold tracking-[-0.1em] text-black dark:text-white md:text-5xl md:leading-[5rem]"
          text="Verify OTP"
        />
      </CardHeader>
      <CardBody className="items-center justify-center">
        <form
          className="flex flex-col gap-4 items-center w-[300px]"
          onSubmit={handleSubmit}
        >
          <Input
            className="text-center"
            errorMessage="OTP must be 6 digits"
            id="otp"
            isInvalid={isinValid}
            label="One Time Password"
            labelPlacement="outside"
            maxLength={6}
            placeholder="Enter your OTP"
            type="number"
            onChange={handleOtpChange}
          />

          <Button color="success" isDisabled={isSubmitting} type="submit">
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </CardBody>
      <CardFooter className="flex flex-col gap-4 items-center justify-center">
        <p>Didn&apos;t receive the OTP? Check Spam folder</p>
        <p>OR</p>
        <Button onClick={handleResend}>Resend OTP</Button>
      </CardFooter>
    </Card>
  );
};

export default VerifyOtpPage;
