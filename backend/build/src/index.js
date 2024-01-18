import dotenv from "dotenv";
dotenv.config();
import express, { urlencoded, json } from "express";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import bodyParser from "body-parser";
import { UploadExpense } from "../function/expense/upload.js";
import { fetchExpenses } from "../function/expense/fetch.js";
import { deleteExpense } from "../function/expense/delete.js";
import { createBudget } from "../function/budget/create.js";
import { updateBudget } from "../function/budget/update.js";
import { getBudget } from "../function/budget/fetch.js";
const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS);
const corsOptions = {
    origin: allowedOrigins,
};
const app = express();
// middleware
app.use(cors(corsOptions));
app.use(json({ limit: "500kb" }));
app.use(urlencoded({ limit: "500kb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "500kb", extended: false }));
const port = process.env.PORT;
if (!port)
    throw new Error("Port not found");
const validateAPIKey = (req, res, next) => {
    const { apikey, userid } = req.headers;
    const serverKey = process.env.SERVER_APIKEY;
    if (apikey === serverKey || userid)
        next();
    else
        res.status(401).send({ error: "Unauthorized" });
};
const regex = /^[a-zA-Z0-9]+$/;
const checkFieldValue = (req, res, next) => {
    const { title, category, price, code } = req.body;
    if (!title || !category || !price || !code) {
        return res.status(400).send({ error: "one or more fields are missing" });
    }
    if (price <= "0") {
        // price cannot be negative or equal to 0
        return res
            .status(400)
            .send({ error: "price cannot be negative or equal to 0" });
    }
    if (!regex.test(price)) {
        // price cannot contain special characters
        return res
            .status(400)
            .send({ error: "price cannot contain special characters" });
    }
    return next();
};
const validateRecID = (req, res, next) => {
    const { id } = req.params;
    if (!id)
        res.status(400).send({ error: "id is missing" });
    else
        next();
};
const validateUserAuth = (req, res, next) => {
    const { userid } = req.headers;
    if (!userid)
        res.status(401).send({ error: "Unauthorized! User does not exist" });
    else
        next();
};
const validateBudgetReq = (req, res, next) => {
    const { username, budget, code } = req.body;
    if (!username || !budget || !code) {
        return res.status(400).send({ error: "one or more fields are missing" });
    }
    if (budget <= "0") {
        // budget cannot be negative or equal to 0
        return res
            .status(400)
            .send({ error: "budget cannot be negative or equal to 0" });
    }
    if (!regex.test(budget)) {
        // budget cannot contain special characters
        return res
            .status(400)
            .send({ error: "budget cannot contain special characters" });
    }
    return next();
};
const reqLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes api rate limit
    limit: 20, // limit each IP to 20 requests per windowMs
    message: { error: "Too many requests, please try again after 10 minutes." },
    standardHeaders: "draft-7",
    legacyHeaders: false,
});
const resLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes api rate limit
    limit: 20, // limit each IP to 20 requests per windowMs
    message: { error: "Too many requests, please try again after 5 minutes." },
    standardHeaders: "draft-7",
    legacyHeaders: false,
});
// app.use(resLimiter); // apply rate limiting to all requests
app.get("/status", async (_, res) => {
    res.send("OK");
});
app.post("/api/upload", reqLimiter, validateAPIKey, checkFieldValue, async (req, res) => {
    const { title, category, price, code } = req.body;
    const { userid } = req.headers;
    try {
        const data = await UploadExpense(userid, title, category, price, code);
        res.status(201).send({ data });
        console.log("data", { data });
    }
    catch (err) {
        res.status(500).send({ error: err.message });
        console.log("err", err);
    }
});
app.get("/api/expense", resLimiter, validateAPIKey, async (req, res) => {
    const { userid } = req.headers;
    try {
        const data = await fetchExpenses(userid);
        res.send(data);
    }
    catch (err) {
        console.log("err", err);
        res.status(500).send({ error: err.message });
    }
});
app.delete("/api/expense/:id", reqLimiter, validateAPIKey, validateRecID, async (req, res) => {
    const { id } = req.params;
    try {
        const data = await deleteExpense(id);
        console.log("delete", data);
        res.send({ data });
    }
    catch (err) {
        res.status(500).send({ error: err.message });
        console.log(err);
    }
});
app.post("/api/budget", reqLimiter, validateAPIKey, validateUserAuth, validateBudgetReq, async (req, res) => {
    const { userid } = req.headers;
    const { username, budget, code } = req.body;
    try {
        // if budget data exist then update, else create
        const existingBudget = await getBudget(userid);
        if (existingBudget) {
            const updatedBudget = await updateBudget(userid, budget);
            res.status(200).send({ updatedBudget });
        }
        const createdBudget = await createBudget(userid, username, budget, code);
        res.status(201).send({ createdBudget });
    }
    catch (err) {
        res.status(500).send({ error: err.message });
        console.log(err);
    }
});
app.get("/api/budget", resLimiter, validateAPIKey, validateUserAuth, async (req, res) => {
    const { userid } = req.headers;
    try {
        const data = await getBudget(userid);
        res.send({ data });
    }
    catch (err) {
        res.status(500).send({ error: err.message });
        console.log(err);
    }
});
app.listen(port, () => {
    console.log(`🟢 [server] Application is online and listening on port ${port}.`);
});
//# sourceMappingURL=index.js.map