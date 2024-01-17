import dotenv from "dotenv";
dotenv.config();
import { getXataClient } from "../../database/xata.js";

const xata = getXataClient();

export async function getBudget(id: string) {
  try {
    const data = await xata.db.account.read(id);

    if (!data) {
      throw new Error("No data found");
    }
    return data;
  } catch (err) {
    console.log(err);
  }
}
