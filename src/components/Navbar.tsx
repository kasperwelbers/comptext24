"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  function setHeight() {
    if (pathname === "/") return "grid-rows-[0px] overflow-hidden";
    return "grid-rows-[var(--navbar-height)] md:grid-rows-[var(--navbar-height-md)] overflow-visible";
  }

  return (
    <>
      <div
        className={`grid transition-all duration-500 w-full ${setHeight()}  backdrop-blur-sm bg-background-transparent sticky top-0 z-20 border-b-2`}
      >
        <div className="flex justify-between md:justify-start relative items-center h-full px-4">
          <div className="">
            <Logo />
          </div>
          <ul className="w-full max-w-[calc(1200px+96px)] mx-auto  hidden md:flex text-foreground text-xl">
            <Links />
          </ul>
          <FoldedMenu />
        </div>
      </div>
    </>
  );
};

const Links = () => {
  return (
    <>
      <NavItem route="/about">About us</NavItem>

      <NavItem route="/projects">Projects</NavItem>

      <NavItem route="/contact">Contact</NavItem>
    </>
  );
};

const NavItem = (props: { children: React.ReactNode; route: string }) => {
  const pathname = usePathname();
  const isActive = pathname === props.route;

  return (
    <Link href={props.route}>
      <button
        className={`transition  p-4 md:px-8    ${
          isActive ? " text-primary" : " text-secondary"
        } hover:text-primary`}
      >
        <span className="font-semibold ">{props.children}</span>
      </button>
    </Link>
  );
};

const FoldedMenu = () => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (show) {
      ref.current.style.gridTemplateRows = ref.current.scrollHeight + "px";
    } else {
      ref.current.style.gridTemplateRows = "0px";
    }

    function closePopup(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    }

    document.addEventListener("click", closePopup);
    return () => document.removeEventListener("click", closePopup);
  }, [ref, show]);

  return (
    <div className="relative ">
      <Button
        className={`bg-secondary p-1 mt-2 w-12 h-12 md:hidden rounded-full`}
        onClick={() => {
          setShow(!show);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
        >
          <path fill="#fff" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z" />
        </svg>
      </Button>
      <div
        ref={ref}
        onClick={() => setShow(false)}
        className={`grid grid-rows-[0px] transition-all fixed top-20 right-4 bg-background overflow-hidden`}
      >
        <div className="rounded w-full h-full border-4 border-secondary py-2">
          <ul className="flex flex-col">
            <Links />
          </ul>
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center gap-x-3 h-16 md:h-20 w-16 md:w-20 mr-4">
      <Link href="/">
        <img src="/images/logo_small.png" alt="logo" className="p-2" />
      </Link>
    </div>
  );
};

export default Navbar;
export { Links };
