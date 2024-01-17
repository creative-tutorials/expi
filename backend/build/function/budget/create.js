import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
dotenv.config();
import { getXataClient } from "../../database/xata.js";
const xata = getXataClient();
function generateUniqueCreditCardNumber(holder) {
    const number = faker.finance.creditCardNumber({
        issuer: "42[5-9]#-####-####-###L",
    });
    const name = holder;
    const cvv = faker.finance.creditCardCVV();
    const expiryDate = faker.date.future();
    // only return the month and day of the expiry date
    const expiryMonth = expiryDate.getMonth() + 1;
    const formattedMonth = expiryMonth.toString().padStart(2, "0");
    const expiryDay = expiryDate.getDate();
    const formattedDay = expiryDay.toString().padStart(2, "0");
    const expiry = `${formattedMonth}/${formattedDay}`;
    return { name, number, expiry, cvv };
}
export async function createBudget(userid, username, budget, code) {
    try {
        // const data = await getBudget(userid);
        const account = await xata.db.account.create(userid, {
            userid: userid,
            username: username,
            card_name: generateUniqueCreditCardNumber(username).name,
            card_number: generateUniqueCreditCardNumber(username).number,
            expiry: generateUniqueCreditCardNumber(username).expiry,
            cvv: generateUniqueCreditCardNumber(username).cvv,
            budget: budget,
            code: code,
        });
        if (!account) {
            throw new Error("Error occurred while intializing budget data");
        }
        return "Budget created";
    }
    catch (err) {
        console.log(err);
        throw new Error("Error occurred while intializing budget data");
    }
}
//# sourceMappingURL=create.js.map