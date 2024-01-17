import dotenv from "dotenv";
dotenv.config();
import express, { Express, urlencoded, json } from "express";
import { Request, Response, NextFunction } from "express";

import { IncomingHttpHeaders } from "http";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import bodyParser from "body-parser";
import { UploadExpense } from "../function/expense/upload.js";
import { fetchExpenses } from "../function/expense/fetch.js";
import { deleteExpense } from "../function/expense/delete.js";
import { createBudget } from "../function/budget/create.js";
import { updateBudget } from "../function/budget/update.js";
import { getBudget } from "../function/budget/fetch.js";

const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS!);
const corsOptions = {
  origin: allowedOrigins,
};

const app: Express = express();

// middleware
app.use(cors(corsOptions));
app.use(json({ limit: "500kb" }));
app.use(urlencoded({ limit: "500kb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "500kb", extended: false }));
const port = process.env.PORT;

if (!port) throw new Error("Port not found");

type CustomHeaders = IncomingHttpHeaders & {
  apikey: string;
  userid: string;
};

const validateAPIKey = (req: Request, res: Response, next: NextFunction) => {
  const { apikey, userid } = req.headers as CustomHeaders;
  const serverKey = process.env.SERVER_APIKEY;
  if (apikey === serverKey || userid) next();
  else res.status(401).send({ error: "Unauthorized" });
};

const checkFieldValue = (req: Request, res: Response, next: NextFunction) => {
  const { title, category, price, code }: Item = req.body;

  if (!title || !category || !price || !code) {
    res.status(400).send({ error: "one or more fields are missing" });
  } else {
    next();
  }
};

const validateRecID = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) res.status(400).send({ error: "id is missing" });
  else next();
};

const validateUserAuth = (req: Request, res: Response, next: NextFunction) => {
  const { userid } = req.headers as CustomHeaders;

  if (!userid)
    res.status(401).send({ error: "Unauthorized! User does not exist" });
  else next();
};

const checkBudgetReq = (req: Request, res: Response, next: NextFunction) => {
  const { username, budget, code }: BudgetReq = req.body;

  if (!username || !budget || !code) {
    res.status(400).send({ error: "one or more fields are missing" });
  } else {
    next();
  }
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

type Item = {
  title: string;
  category: string;
  price: string;
  code: string;
};

app.post(
  "/api/upload",
  reqLimiter,
  validateAPIKey,
  checkFieldValue,
  async (req: Request, res: Response) => {
    const { title, category, price, code }: Item = req.body;
    const { userid } = req.headers as CustomHeaders;
    try {
      const data = await UploadExpense(userid, title, category, price, code);
      res.status(201).send({ data });
      console.log("data", { data });
    } catch (err: any) {
      res.status(500).send({ error: err.message });
      console.log("err", err);
    }
  }
);

app.get(
  "/api/expense",
  resLimiter,
  validateAPIKey,
  async (req: Request, res: Response) => {
    const { userid } = req.headers as CustomHeaders;

    try {
      const data = await fetchExpenses(userid);

      res.send(data);
    } catch (err: any) {
      console.log("err", err);
      res.status(500).send({ error: err.message });
    }
  }
);

app.delete(
  "/api/expense/:id",
  reqLimiter,
  validateAPIKey,
  validateRecID,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const data = await deleteExpense(id);
      console.log("delete", data);
      res.send({ data });
    } catch (err: any) {
      res.status(500).send({ error: err.message });
      console.log(err);
    }
  }
);

type BudgetReq = Item & {
  username: string;
  budget: string;
};

app.post(
  "/api/budget",
  reqLimiter,
  validateAPIKey,
  validateUserAuth,
  checkBudgetReq,
  async (req: Request, res: Response) => {
    const { userid } = req.headers as CustomHeaders;
    const { username, budget, code }: BudgetReq = req.body;

    try {
      // if budget data exist then update, else create
      const existingBudget = await getBudget(userid);
      if (existingBudget) {
        const updatedBudget = await updateBudget(userid, budget);
        res.status(200).send({ updatedBudget });
      }
      const createdBudget = await createBudget(userid, username, budget, code);
      res.status(201).send({ createdBudget });
    } catch (err) {
      console.log(err);
    }
  }
);

app.get(
  "/api/budget",
  resLimiter,
  validateAPIKey,
  validateUserAuth,
  async (req: Request, res: Response) => {
    const { userid } = req.headers as CustomHeaders;
    try {
      const data = await getBudget(userid);
      res.send({ data });
    } catch (error) {
      console.log(error);
    }
  }
);

app.listen(port, () => {
  console.log(
    `🟢 [server] Application is online and listening on port ${port}.`
  );
});
