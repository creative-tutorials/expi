import Link from "next/link";
import { Home } from "lucide-react";

const links = [
  {
    name: "Account",
    href: "/account",
  },
  {
    name: "Budget",
    href: "/account/budget",
  },
  {
    name: "Notifications",
    href: "/account/notifications",
  },
];

type SideBarProp = {
  title: string;
};

export function Sidebar({ title }: SideBarProp) {
  return (
    <div
      id="sidebar"
      className="p-10 bg-[#080809] border-r border-zinc-900 w-full max-w-72 h-screen min-h-screen max-h-screen md:flex lg:flex flex-col hidden gap-4"
    >
      <div id="top-side" className="w-full h-full flex flex-col gap-4">
        <div id="general">
          <hgroup>
            <h1 className="text-2xl font-medium px-4">{title}</h1>
          </hgroup>
          {links.map((link: LinkProps) => (
            <div
              id="links"
              className="flex flex-col gap-2 mt-4 w-full"
              key={link.name}
            >
              <Link
                href={link.href}
                className="p-1 px-4 transition-all w-full hover:bg-zinc-900 rounded-md hover:underline"
              >
                {link.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div id="bottom-side" className="m-auto">
        <Link href="/">
          {" "}
          <Home />
        </Link>
      </div>
    </div>
  );
}
type LinkProps = {
  name: string;
  href: string;
};
