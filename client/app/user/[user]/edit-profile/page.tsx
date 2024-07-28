import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import { CheckCircle2, LockIcon, MailIcon, User2Icon } from 'lucide-react';

import { UploadIcon } from '@/components/icons';
import GradualSpacing from '@/components/magicui/gradual-spacing';
import ShineBorder from '@/components/magicui/shine-border';

const EditProfilePage = () => {
  const user = {
    name: 'John Doe',
    email: 'johndoe@email.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  };

  return (
    <ShineBorder color={['#A07CFE', '#2BD2FF', '#2BFF88']}>
      <Card fullWidth={true} shadow="lg">
        <CardHeader className="flex flex-wrap gap-4 text-center text-5xl font-extrabold justify-center">
          <Avatar
            isBordered
            isFocusable
            showFallback
            size="lg"
            src={user.avatar}
          />
          <GradualSpacing
            className="font-display text-center text-5xl font-bold tracking-[-0.1em]  text-black dark:text-white md:text-5xl md:leading-[5rem]"
            text={`Hi! ${user.name}`}
          />
        </CardHeader>
        <CardBody>
          <form className="flex flex-col py-4 px-4 gap-4 w-full">
            <Input
              endContent={
                <User2Icon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Edit Name"
              placeholder={user.name}
              type="text"
              variant="bordered"
            />
            <Input
              endContent={
                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Edit Email"
              placeholder={user.email}
              type="email"
              variant="bordered"
            />
            <Input
              endContent={
                <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="New Password"
              placeholder="Enter new Password"
              type="password"
              variant="bordered"
            />
            <Input
              endContent={
                <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Confirm New Password"
              placeholder="Re-Enter your new password"
              type="password"
              variant="bordered"
            />
            <Button
              className="font-semibold text-lg"
              fullWidth
              color="primary"
              size="lg"
              startContent={<UploadIcon />}
              variant="shadow"
            >
              Change Avatar
              <Input
                fullWidth
                accept=".jpeg, .jpg, .png"
                className="absolute inset-0.5 opacity-0 cursor-pointer"
                size="lg"
                type="file"
                variant="bordered"
              />
            </Button>
            <Button
              className="font-semibold text-lg w-full"
              color="success"
              size="lg"
              startContent={<CheckCircle2 />}
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
