import { useCountryCodes } from "@/hooks/country-codes";
import { Button } from "@/components/ui/button";
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
import { Dispatch, SetStateAction } from "react";

type AcntContedProp = {
  setFormValue: Dispatch<
    SetStateAction<{
      amount: string;
      code: string;
      isPending: boolean;
    }>
  >;
  formValue: {
    amount: string;
    code: string;
    isPending: boolean;
  };
  uploadData: () => Promise<void>;
  account: {
    card_name: string;
    card_number: string;
    expiry: string;
    cvv: string;
    budget: string;
    code: string;
    username: string;
  };
};

export function AccountContent({
  setFormValue,
  formValue,
  uploadData,
  account,
}: AcntContedProp) {
  return (
    <div
      id="top"
      className="flex md:gap-0 lg:gap-0 gap-3 px-2 flex-wrap items-center justify-between"
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
                value={formValue.amount}
                min="1"
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
          <span>{account.budget ? account.budget : "Loading amount..."}</span>
        </h1>
      </div>
    </div>
  );
}
