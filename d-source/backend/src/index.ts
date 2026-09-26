import cors from "cors";
import express from "express";
import { env } from "./env.js";
import { accountRouter } from "./routes/account.js";
import { adminRouter } from "./routes/admin/index.js";
import { cartRouter } from "./routes/cart.js";
import { catalogueRouter } from "./routes/catalogue.js";
import { checkoutRouter } from "./routes/checkout.js";
import { enquiriesRouter } from "./routes/enquiries.js";
import { quotesRouter } from "./routes/quotes.js";
import { reviewsRouter } from "./routes/reviews.js";
import { surveysRouter } from "./routes/surveys.js";
import { trackRouter } from "./routes/track.js";
import { zonesRouter } from "./routes/zones.js";

const app = express();

app.use(
  cors({
    origin: env.allowedOrigins.length ? env.allowedOrigins : true,
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

// Storefront-facing (public + customer-authenticated)
app.use("/catalogue", catalogueRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);
app.use("/quotes", quotesRouter);
app.use("/account", accountRouter);
app.use("/reviews", reviewsRouter);
app.use("/surveys", surveysRouter);
app.use("/enquiries", enquiriesRouter);
app.use("/track", trackRouter);
app.use("/zones", zonesRouter);

// Staff-only (see auth/middleware.ts requireStaff + role_permissions)
app.use("/admin", adminRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof Error) {
    // zod validation errors and thrown Errors alike land here.
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Unexpected error" });
});

app.listen(env.port, () => {
  console.log(`D'Source API listening on :${env.port}`);
});
