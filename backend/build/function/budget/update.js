import dotenv from "dotenv";
dotenv.config();
import { getXataClient } from "../../database/xata.js";
const xata = getXataClient();
export async function updateBudget(id, amount) {
    try {
        const account = await xata.db.account.update(id, {
            budget: amount,
        });
        if (!account) {
            throw new Error("Failed to update budget");
        }
        return "Budget updated";
    }
    catch (err) {
        console.log("updateBudget", err);
        throw new Error("Failed to update budget");
    }
}
//# sourceMappingURL=update.js.map