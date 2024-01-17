import { useCategories } from "@/hooks/use-categories";
import { useCountryCodes } from "@/hooks/country-codes";
import { CategoriesCN } from "@/app/types/categories";

import { Spinner } from "../../animation/Spinner";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
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

import { Wallet } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type TopSecProps = {
  setFormValue: Dispatch<
    SetStateAction<{
      title: string;
      category: string;
      price: string;
      code: string;
      isPending: boolean;
    }>
  >;
  formValue: {
    title: string;
    category: string;
    price: string;
    code: string;
    isPending: boolean;
  };
  uploadData: () => Promise<void>;
};

export function TopSection({
  setFormValue,
  formValue,
  uploadData,
}: TopSecProps) {
  return (
    <div id="top" className="flex flex-wrap justify-between">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="x bg-indigo-600 hover:bg-indigo-700 rounded flex gap-2">
            <Wallet /> Record Expense
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-zinc-950 border border-zinc-700">
          <DialogHeader>
            <DialogTitle>Record an expense</DialogTitle>
          </DialogHeader>
          {/* add separator */}
          <Separator className="my-1 bg-zinc-500" />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="name" className="">
                Title
              </Label>
              <Input
                id="name"
                autoComplete="off"
                type="text"
                value={formValue.title}
                placeholder="give your expense a name"
                className="col-span-3 placeholder:text-gray-400"
                disabled={formValue.isPending}
                onChange={(e) =>
                  setFormValue({ ...formValue, title: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="username" className="">
                Categories
              </Label>
              <Select
                defaultValue={formValue.category}
                disabled={formValue.isPending}
                onValueChange={(value) =>
                  setFormValue({ ...formValue, category: value })
                }
              >
                <SelectTrigger className="w-full text-gray-400">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {useCategories().map((category: CategoriesCN) => (
                    <SelectGroup key={category.key}>
                      <SelectLabel>{category.key}</SelectLabel>
                      {category.data.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="price" className="">
                Price
              </Label>
              <div className="flex md:flex-row lg:flex-row flex-col gap-4">
                <Input
                  id="price"
                  autoComplete="off"
                  type="number"
                  min="0"
                  value={formValue.price}
                  placeholder="cost of the expense"
                  className="col-span-3 placeholder:text-gray-400"
                  disabled={formValue.isPending}
                  onChange={(e) =>
                    setFormValue({ ...formValue, price: e.target.value })
                  }
                />
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
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-indigo-700 hover:bg-indigo-600 flex items-center gap-2 select-none"
              onClick={uploadData}
              disabled={formValue.isPending}
            >
              {formValue.isPending ? (
                <>
                  <Spinner /> <span>Please wait</span>
                </>
              ) : (
                "Upload data"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
