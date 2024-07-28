import { Divider } from '@nextui-org/divider';
import { Link } from '@nextui-org/link';
import React from 'react';
import { CopyrightIcon, GithubIcon, MailIcon } from './icons';
import { siteConfig } from '@/config/site';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="w-full text-center items-center justify-center ">
      <Divider />
      <div className="flex items-center justify-center w-full py-5 tracking-widest text-center px-8 flex flex-wrap">
        <Link
          href={siteConfig.links.github}
          className="px-4 gap-2"
          color="foreground"
          isExternal
        >
          <GithubIcon />
          About Us{' '}
        </Link>{' '}
        |{' '}
        <Link
          href={siteConfig.links.mail}
          className="px-4 gap-2"
          color="foreground"
          isExternal
        >
          <MailIcon />
          Contact Us{' '}
        </Link>{' '}
        |{' '}
        <p className="px-4 flex flex-row gap-2">
          <CopyrightIcon />
          Copyright {currentYear}
        </p>
      </div>
    </div>
  );
};

export default Footer;
