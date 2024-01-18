"use client";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { getAPIURL } from "@/hooks/api-url";

import { AccountContent } from "@/components/layout/main/account/account-content";
import { AccountInfo } from "@/app/types/account";
import { Sidebar } from "@/components/layout/main/account/sidebar";
import { Footer } from "@/components/layout/main/account/footer";

import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Ban } from "lucide-react";
import { useState, useEffect } from "react";
import { CreditCard } from "@/components/layout/main/account/credit-card";

import { Label } from "@/components/ui/label";

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
        const error = err.response.data.error;
        setFormValue((prev) => ({ ...prev, isPending: false }));
        toast.error(error, {
          action: {
            label: "Close",
            onClick: () => console.info("Toast closed"),
          },
        });
      });
  };

  return (
    <main className="w-full h-screen md:flex lg:flex">
      <Sidebar title={"Budget"} />
      <div
        id="page"
        className="md:p-10 lg:p-10 p-2 w-full h-screen max-h-min overflow-auto"
      >
        <AccountContent
          setFormValue={setFormValue}
          formValue={formValue}
          uploadData={uploadData}
          account={account}
        />
        <CreditCard account={account} />
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
                      className={`h-2 bg-blue-600 whitespace-nowrap md:p-4 lg:p-4 p-3 rounded-md flex items-center`}
                    >
                      <Label
                        htmlFor="progress"
                        className="md:text-base lg:text-base text-sm"
                      >
                        {item.name}
                      </Label>
                    </div>
                    <p className="md:text-base lg:text-base text-sm">
                      {item.value}%
                    </p>
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
