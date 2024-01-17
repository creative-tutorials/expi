"use client";

import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/main/account/sidebar";
import { Footer } from "@/components/layout/main/account/footer";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Profile } from "@/components/layout/main/account/profile";

import { StaticImport } from "next/dist/shared/lib/get-img-props";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [userX, setUser] = useState({
    name: "",
    username: "",
    email: "",
    imageUrl: "",
  });
  const { user } = useUser();

  useEffect(() => {
    const userObj = user || {
      fullName: "",
      username: "",
      emailAddresses: [],
      imageUrl: "",
    };

    const timer = setTimeout(() => {
      setIsLoading(false);
      setUser({
        name: userObj.fullName || "",
        username: userObj.username || "",
        email: userObj.emailAddresses[0]?.emailAddress || "",
        imageUrl: userObj.imageUrl || "",
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <>
      <main className="w-full h-screen md:flex lg:flex">
        <Sidebar title="Account" />
        {isLoading ? (
          <div>fetching account details...</div>
        ) : (
          <Content setIsModal={setIsModal} userX={userX} />
        )}

        <Footer />
        {isModal && <Profile setIsModal={setIsModal} />}
      </main>
    </>
  );
}

function Content(props: {
  userX: {
    imageUrl: string | StaticImport;
    name: string;
    email: string | undefined;
  };
  setIsModal: (arg0: boolean) => void;
}) {
  return (
    <div id="page" className="md:p-10 lg:p-10 p-4 w-full">
      <section id="account-management">
        <hgroup className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium">Account Management</h1>
          <span>Manage your account settings and preferences</span>
        </hgroup>
        <div
          id="context"
          className="flex md:flex-row lg:flex-row flex-col gap-4 mt-4 w-full"
        >
          <div id="image" className="">
            <Image
              src={props.userX.imageUrl}
              width={30}
              height={30}
              alt={props.userX.name}
              className="rounded-full object-cover w-40 h-40 max-w-none"
              unoptimized // Disable image optimization
            />
          </div>
          <div id="xyz" className="flex flex-col gap-3 w-full">
            <div id="email" className="flex flex-col gap-4 w-full">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                placeholder="Email"
                className="w-full"
                defaultValue={props.userX.email}
                disabled
              />
            </div>
            <div id="name" className="flex flex-col gap-4 w-full">
              <Label htmlFor="username">Name</Label>
              <Input
                type="text"
                placeholder="Name"
                defaultValue={props.userX.name}
                className="w-full"
                disabled
              />
            </div>
            <div id="call-to-action" className="flex items-end justify-end">
              <Button
                className="x bg-indigo-600 hover:bg-indigo-700"
                onClick={() => props.setIsModal(true)}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
