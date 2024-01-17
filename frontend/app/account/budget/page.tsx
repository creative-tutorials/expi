"use client";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { getAPIURL } from "@/hooks/api-url";
import { useCountryCodes } from "@/hooks/country-codes";
import { AccountInfo } from "@/app/types/account";
import { Sidebar } from "@/components/layout/main/account/sidebar";
import { Footer } from "@/components/layout/main/account/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Eye, EyeOff, Clipboard, ClipboardCheckIcon, Ban } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const imageArr = [
  "card1.jpg",
  "card2.jpeg",
  "card3.jpg",
  "card4.jpg",
  "card5.jpg",
  "card6.jpg",
  "card7.jpg",
  "card8.jpg",
  "card9.jpg",
  "card10.jpg",
  "card11.jpg",
  "card12.jpg",
  "card13.jpg",
];

export default function Cloud() {
  const { user, isSignedIn } = useUser();
  const [count, setCount] = useState(0);
  const [account, setAccount] = useState({
    card_name: "",
    card_number: "####-####-####-####",
    expiry: "",
    cvv: "01/99",
    budget: "",
    code: "",
    username: "",
  });
  const [amtx, setAmtx] = useState(25000);
  const [formValue, setFormValue] = useState({
    amount: "",
    code: "",
    isPending: false,
  });
  const [expenseData, setExpenseData] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [cardImage, setCardImage] = useState("card1.jpg");
  const [isHidden, setIsHidden] = useState(true);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);

  const generateChartData = (data: { name: string; value: number }[]) => {
    const total = data.reduce((acc, item) => amtx + item.value, 0);
    const chartData = data.map((item) => ({
      name: item.name,
      value: ((item.value / total) * 100).toFixed(2),
    }));
    return chartData;
  };

  useEffect(() => {
    setCount((prev) => prev + 1);

    count === 1 && getBudget();

    return () => {
      setCount(0);
    };
  }, [count, isSignedIn, user?.id]);

  const getBudget = async () => {
    if (!isSignedIn) return;
    const url = getAPIURL();
    axios
      .get(`${url}/api/budget`, {
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_API_KEY,
          userid: user.id,
        },
      })
      .then(async (res) => {
        const data: AccountInfo = res.data.data;
        setAmtx(parseInt(data.budget));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: data.code,
        }).format(data.budget);
        setAccount((prev) => ({
          ...prev,
          card_name: data.card_name,
          card_number: data.card_number,
          expiry: data.expiry,
          cvv: data.cvv,
          budget: formatted,
          code: data.code,
          username: data.username,
        }));
        await getExpenses();
      })
      .catch(async (err) => {
        console.error(err.response);
      });
  };

  const getExpenses = async () => {
    if (!isSignedIn) return;
    const url = getAPIURL();
    axios
      .get(`${url}/api/expense`, {
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_API_KEY,
          userid: user.id,
        },
      })
      .then(async (res) => {
        const data = res.data;
        // The above code is mapping over an array called "data" and creating a new array called "dataX
        const dataX = data.map((value: any, index: number) => ({
          name: value.title, // replace with actual expense name
          value: parseInt(value.price), // replace with actual expense value
        }));
        setExpenseData(dataX);
      })
      .catch(async (err) => {
        console.error(err.response);
      });
  };

  const handleMouseEnter = () => {};
  const handleMouseLeave = () => {
    // reset rotation
    setRotationX(0);
    setRotationY(0);
  };

  const handleMouseMove = (e: {
    currentTarget: { getBoundingClientRect: () => any };
    clientY: number;
    clientX: number;
  }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    const newRotationX = (e.clientY - cardCenterY) / 10;
    const newRotationY = (e.clientX - cardCenterX) / 10;
    setRotationX(newRotationX);
    setRotationY(newRotationY);
  };

  const randomCardImage = () => {
    const randomIndex = Math.floor(Math.random() * imageArr.length);
    setCardImage(imageArr[randomIndex]);
  };

  const uploadData = async () => {
    if (!isSignedIn) return;
    setFormValue((prev) => ({ ...prev, isPending: true }));
    const url = getAPIURL();
    axios
      .post(
        `${url}/api/budget`,
        {
          username: user.firstName + " " + user.lastName,
          budget: formValue.amount,
          code: formValue.code,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
            userid: user.id,
          },
        }
      )
      .then(async (res) => {
        const data = res.data;

        setFormValue((prev) => ({ ...prev, isPending: false }));
        await getBudget();
      })
      .catch(async (err) => {
        console.error(err.response);
        setFormValue((prev) => ({ ...prev, isPending: false }));
      });
  };

  const copyText = () => {
    try {
      navigator.clipboard.writeText(account.card_number);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error("Error copying text", {
        action: {
          label: "Retry",
          onClick: () => copyText(),
        },
      });
      setIsCopied(false);
    }
  };

  return (
    <main className="w-full h-screen md:flex lg:flex">
      <Sidebar title={"Budget"} />
      <div
        id="page"
        className="md:p-10 lg:p-10 p-2 w-full h-screen max-h-min overflow-auto"
      >
        <div
          id="top"
          className="flex md:gap-0 lg:gap-0 gap-3 flex-wrap justify-between"
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Budget</DialogTitle>
                <DialogDescription>
                  Enter your budget and country code
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-start gap-3">
                  <Label htmlFor="number" className="text-right">
                    Amount of your budget
                  </Label>
                  <Input
                    id="number"
                    placeholder="Budget amount"
                    type="number"
                    className="col-span-3"
                    autoComplete="off"
                    disabled={formValue.isPending}
                    onChange={(e) =>
                      setFormValue({ ...formValue, amount: e.target.value })
                    }
                  />
                </div>
                <div className="w-full">
                  <Select
                    defaultValue={formValue.code}
                    disabled={formValue.isPending}
                    onValueChange={(value) =>
                      setFormValue({ ...formValue, code: value })
                    }
                  >
                    <SelectTrigger className="w-full text-gray-400">
                      <SelectValue placeholder="currency code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Currency</SelectLabel>
                        {useCountryCodes().map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="border border-gray-500 hover:bg-gray-800 hover:border-gray-700"
                  type="submit"
                  disabled={formValue.isPending}
                  onClick={uploadData}
                >
                  {formValue.isPending ? "Saving changes..." : "Save changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div id="budget_nexus">
            <h1 className="md:text-2xl lg:text-2xl text-lg font-medium">
              Budget: <span>{account.budget ? account.budget : null}</span>
            </h1>
          </div>
        </div>
        <div
          id="card"
          className="p-4 mt-8 w-full bg-cover md:h-full lg:h-full h-56 md:max-h-[300px] lg:max-h-[300px] md:max-w-[500px] lg:max-w-[500px] relative flex items-center justify-center rounded-lg shadow-md"
          style={{
            backgroundImage: `url('/credit card/${cardImage}')`,
            filter: "grayscale(100%)",
            transition: "transform 0.3s",
            transformStyle: "preserve-3d",
            transform: `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <div id="open_close" className="absolute top-2 left-5">
            {isHidden ? (
              <EyeOff
                className="cursor-pointer"
                onClick={() => setIsHidden(false)}
              />
            ) : (
              <Eye
                className="cursor-pointer"
                onClick={() => setIsHidden(true)}
              />
            )}
          </div>
          <div
            id="mcard"
            className="absolute top-2 right-5 cursor-pointer"
            onClick={randomCardImage}
          >
            <svg
              width="45"
              height="45"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="currentColor" fillRule="evenodd">
                <circle cx="7" cy="12" r="7" />
                <circle cx="17" cy="12" r="7" fillOpacity=".8" />
              </g>
            </svg>
          </div>
          <div id="card-info" className="mt-auto flex flex-col gap-4">
            <div id="top-info" className="flex justify-between">
              <h2 id="card-number" className="text-2xl font-medium select-none">
                {isHidden ? "XXXX-XXXX-XXXX-XXXX" : account.card_number}
              </h2>
              {isCopied ? (
                <ClipboardCheckIcon className="cursor-pointer w-4 h-4" />
              ) : (
                <Clipboard
                  className="cursor-pointer w-4 h-4"
                  onClick={copyText}
                />
              )}
            </div>
            <div
              id="bottom-info"
              className="flex justify-between"
              onClick={copyText}
            >
              <h3 id="card-holder-name" className="select-none">
                {account.card_name}
              </h3>
              <h3 id="card-expiry" className="select-none">
                {account.expiry}
              </h3>
            </div>
          </div>
        </div>
        <div id="expense-chart" className="mt-10">
          {expenseData.length < 1 && (
            <span className="flex items-center gap-1">
              No data available <Ban className="w-5 h-5" />
            </span>
          )}
          {expenseData.length > 0 && (
            <div
              id="container"
              className="w-full h-full bg-zinc-950 p-4 rounded-md border border-neutral-800 mt-3"
            >
              <div id="top-layer">
                <h3 className="text-xl font-medium">Expense count:</h3>
                <p className="text-sm text-gray-400">
                  View items that cost you more
                </p>
              </div>
              <Separator className="my-4 w-full h-px bg-neutral-800" />
              <div id="chart" className="w-full flex flex-col gap-4">
                {generateChartData(expenseData).map((item) => (
                  <div
                    id="progress-wrapper"
                    className="w-full overflow-hidden flex items-center justify-between gap-5"
                    key={item.name}
                  >
                    <div
                      id="progress"
                      style={{ width: `${item.value}%` }}
                      className={`h-2 bg-blue-600 whitespace-nowrap p-4 rounded-md flex items-center`}
                    >
                      <Label htmlFor="progress">{item.name}</Label>
                    </div>
                    <p>{item.value}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
