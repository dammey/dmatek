import "express-async-errors";
import cors from "cors";
import express from "express";
import { ZodError } from "zod";
import { env } from "./env.js";
import { accountRouter } from "./routes/account.js";
import { adminRouter } from "./routes/admin/index.js";
import { cartRouter } from "./routes/cart.js";
import { catalogueRouter } from "./routes/catalogue.js";
import { checkoutRouter } from "./routes/checkout.js";
import { contentRouter } from "./routes/content.js";
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
app.use("/content", contentRouter);

// Staff-only (see auth/middleware.ts requireStaff + role_permissions)
app.use("/admin", adminRouter);

// express-async-errors (imported above) makes every async route handler's
// rejections land here too, not just synchronous throws.
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: err.issues.map((i) => i.message).join("; ") });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(env.port, () => {
  console.log(`D'Source API listening on :${env.port}`);
});
