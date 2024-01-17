import { UserRound, PiggyBank, BellDot, Home } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
export function Footer() {
  return (
    <footer className="md:hidden lg:hidden block fixed bottom-12 left-1/2 right-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-sm rounded-md bg-zinc-950 border border-zinc-800 shadow-md p-5">
      <div id="icons" className="flex items-center justify-between">
        <div id="icon">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/account">
                  <UserRound className="w-8" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div id="icon">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/account/budget">
                  <PiggyBank className="w-8" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Budget</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div id="icon">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/account/notifications">
                  <BellDot className="w-8" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div id="icon">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/">
                  <Home className="w-8" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </footer>
  );
}
