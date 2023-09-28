"use client";

import { Section } from "@/types";
import Link from "next/link";
import { RefObject, useEffect, useRef, useState } from "react";
import { InView } from "react-intersection-observer";

interface Props {
  sections: Section[];
}

export default function Sections({ sections }: Props) {
  const refs = useRef<any>([]);
  const [observed, setObserved] = useState<Record<string, boolean>>({});
  const [current, setCurrent] = useState(sections[0].id);

  //   let current = "welcome";
  //   for (let i = 0; i < sections.length; i++) {
  //     if (observed[sections[i].id]) {
  //       current = sections[i].id;
  //       if (i === 0) break;
  //     }
  //   }

  useEffect(() => {
    if (!refs.current?.length) return;
    const options = { threshold: 0.3 };

    const observer = new IntersectionObserver((entries) => {
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          setCurrent(entries[i].target.id);
          if (i === 0) break;
        }
      }
    }, options);

    for (const ref of refs.current) {
      observer.observe(ref);
    }
    return () => observer.disconnect();
  }, [refs, setObserved]);

  const navItems = sections.map((section) => {
    return (
      <NavItem
        key={section.id}
        anchor={section.id}
        active={section.id === current}
      >
        {section.link}
      </NavItem>
    );
  });

  return (
    <>
      <div className="flex justify-between items-center lg:hidden sticky top-0 h-20 backdrop-blur-md bg-[#fff7] border-b-2 border-primary z-20">
        <img src="/images/logo_small.png" className="h-8 pl-4" />
        <div className="flex flex-wrap justify-center">{navItems}</div>
        <div />
      </div>
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-12 animate-fade-in">
        <div className=" flex flex-col-reverse lg:flex-row">
          <div className="flex-auto relative w-full max-w-2xl mx-auto lg:mx-0 prose lg:prose-xl mt-8 lg:mt-24 mb-[25%]">
            {sections.map((section, i) => (
              <div key={section.id} className="relative  mb-24">
                <div
                  id={section.id}
                  ref={(el) => (refs.current[i] = el)}
                  className="Sentinel absolute top-0 w-1 h-screen max-h-full scroll-mt-28 "
                />
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            ))}
          </div>

          <div className="flex mx-auto lg:w-1/3 lg:mr-0">
            <div className="lg:fixed flex lg:flex-col ml-auto">
              <img
                alt={"Logo"}
                src={"/images/logo.png"}
                className="p-8 w-full max-w-[500px]"
              />
              <ul className="hidden lg:flex flex-col lg:mx-auto justify-center prose md:prose-xl lg:prose-2xl">
                {navItems}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const NavItem = (props: {
  children: React.ReactNode;
  anchor: string;
  active: boolean;
}) => {
  return (
    <Link href={`#${props.anchor}`}>
      <button
        className={`transition  p-2 lg:p-4 md:px-8    ${
          props.active ? " text-primary" : " text-secondary"
        } hover:text-primary`}
      >
        <span className="font-semibold ">{props.children}</span>
      </button>
    </Link>
  );
};
