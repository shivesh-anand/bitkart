"use client";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Textarea } from "@nextui-org/input";
import { MenuIcon, SendIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";
import { useSelector } from "react-redux";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetUserChatsQuery } from "@/redux/api/userSlice";
import { RootState } from "@/redux/store";

export default function App() {
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const [activeChat, setActiveChat] = useState(tabs[0]);

  const currentUser = useSelector((state: RootState) => state.auth.user);

  console.log("currentUser", currentUser);

  const { data, error, isLoading } = useGetUserChatsQuery(currentUser?._id);
  if (isLoading) return <div>Loading...</div>;
  console.log("data", data?.chats);

  const userIdsData = data.chats.map((chat) => chat.users);

  console.log("userIdsData", userIdsData[0][0]);

  const handleUserClick = (tab: any) => {
    setActiveChat(tab);
  };

  return (
    <div className="flex w-full h-screen">
      {isLargeScreen ? (
        <div className="w-1/4 p-4">
          <ul>
            {tabs.map((tab) => (
              <li key={tab.id} className="mb-2">
                <Button
                  fullWidth
                  color={activeChat.id === tab.id ? "success" : "default"}
                  variant={activeChat.id === tab.id ? "solid" : "light"}
                  onClick={() => handleUserClick(tab)}
                >
                  {tab.userName}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Sheet>
          <SheetTrigger asChild className="flex flex-col">
            <Button isIconOnly className="m-4" variant="light">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <ul className="p-4">
              {tabs.map((tab) => (
                <li key={tab.id} className="mb-2">
                  <SheetClose asChild>
                    <Button
                      fullWidth
                      color={activeChat.id === tab.id ? "success" : "default"}
                      variant={activeChat.id === tab.id ? "solid" : "light"}
                      onClick={() => handleUserClick(tab)}
                    >
                      {tab.userName}
                    </Button>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      )}
      <div className="p-4">
        <Card className="flex flex-col flex-1">
          <CardBody className="flex flex-col gap-4 flex-1 overflow-y-auto">
            {activeChat.chat.map((msg, index) => (
              <Card
                key={index}
                className={`lg:w-6/12 w-full ${
                  msg.userId === activeChat.id
                    ? "bg-green-500 text-white self-end"
                    : "self-start"
                }`}
                shadow="lg"
              >
                <CardHeader className="pb-0 font-bold text-md">
                  {msg.userId}
                </CardHeader>
                <CardBody>{msg.message}</CardBody>
                <CardFooter className="text-xs justify-end">3:00 PM</CardFooter>
              </Card>
            ))}
          </CardBody>
          <CardFooter className="gap-4 mt-4">
            <Textarea
              disableAutosize
              placeholder="Type your message"
              size="lg"
            />
            <Button isIconOnly color="success" radius="full">
              <SendIcon />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

let tabs = [
  {
    id: 1,
    userName: "John Doe",
    chat: [
      {
        userId: 1,
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        userId: 2,
        message:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
    ],
  },
  {
    id: 2,
    userName: "Shivesh Anand",
    chat: [
      {
        userId: 2,
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        userId: 1,
        message:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
    ],
  },
  {
    id: 3,
    userName: "Piyush Raj",
    chat: [
      {
        userId: 1,
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        userId: 3,
        message:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
    ],
  },
];
