# Feature Walkthrough: Dynamic Packages & Pick Up Location

We have successfully implemented the requested features to allow dynamic package selection inside the DocuSign contract, along with a custom Pick Up Location field. We also created the foundational Package Management system and the ability to save the default template into MongoDB for Admin editing.

Here is a breakdown of what was accomplished and how to verify it.

## 1. Package Management

**What was done:**
Created a new `Package` model in MongoDB to store available hunt packages. We implemented full CRUD APIs for the Admin to manage these packages.

**How to verify:**
You can test these endpoints using Postman or your frontend app (once connected):
- `GET /api/packages` - Fetch all packages.
- `POST /api/packages` - Create a new package.
  - Body: `{ "name": "Gold Package", "details": "Premium Hunt Experience", "price": 2500 }`
- `PUT /api/packages/:id` - Update a package.
- `DELETE /api/packages/:id` - Delete a package.

## 2. Default Contract Template Seeding

**What was done:**
Previously, the default contract template was a hardcoded HTML string in [contract.service.js](file:///c:/Users/Hp/Documents/work/Developer%20Tag/Projects/velt/backend/services/contract.service.js). We created a utility endpoint that reads this string and saves it as a real Document in the `ContractTemplate` MongoDB collection.

**How to verify:**
1. Send a POST request to `/api/contract-templates/seed-default`.
2. This will securely save the baseline default template to MongoDB.
3. The Admin can now use the existing `PUT /api/contract-templates/:id` to modify the contract text as desired without changing the codebase.

## 3. DocuSign Dynamic Integration

**What was done:**
We updated both the string in [contract.service.js](file:///c:/Users/Hp/Documents/work/Developer%20Tag/Projects/velt/backend/services/contract.service.js) (which gets seeded) and the DocuSign integration logic ([docusign.service.js](file:///c:/Users/Hp/Documents/work/Developer%20Tag/Projects/velt/backend/services/docusign.service.js)) to support dynamic fields placed directly on the PDF:

* **Package Dropdown (`/package_dropdown/`)**: When the admin sends a contract, the backend fetches all Packages from the database and constructs a DocuSign `ListTab` (Dropdown). The signer must select a package.
* **Dynamic Price (`/dynamic_price/`)**: A DocuSign `FormulaTab` automatically calculates and displays the price of the package selected in the dropdown.
* **Pick Up Location (`/pickup_location/`)**: A DocuSign `TextTab` (Textarea) is rendered for the user to physically type in their desired pick up location.

**How to verify:**
1. Make sure you have created at least one Package via `POST /api/packages`.
2. Ensure you have seeded the default template (or the template being used has the new anchor tags).
3. Send a contract via `POST /api/bookings/:id/send-contract`.
4. Open the DocuSign Envelope as the signer. You should see a dropdown menu populated with the packages from your database, a price that updates based on selection, and a text box for the Pick Up Location.

## 4. Database Verification
**What was done:**
We manually verified that the backend successfully connects to the MongoDB database using the credentials in the [.env](file:///c:/Users/Hp/Documents/work/Developer%20Tag/Projects/velt/backend/.env) file.

## Code Changes Reference
```diff:app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/error.js";
import ConnectDb from "./database/connection.js";
import LeadRoutes from "./routes/leads.routes.js";
import AuthRoutes from "./routes/auth.routes.js";
import BookingRoutes from "./routes/booking.routes.js";
import WebhookRoutes from "./routes/webhook.routes.js";
import ContractTemplateRoutes from "./routes/contractTemplate.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Connect to DB before handling any request (works for both local and serverless)
app.use(async (req, res, next) => {
  try {
    await ConnectDb();
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/api/leads", LeadRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/webhooks", WebhookRoutes);
app.use("/api/contract-templates", ContractTemplateRoutes);

app.get("/", (req, res) => {
  res.json("Api is running");
});

app.use(ErrorMiddleware);

export default app;
===
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/error.js";
import ConnectDb from "./database/connection.js";
import LeadRoutes from "./routes/leads.routes.js";
import AuthRoutes from "./routes/auth.routes.js";
import BookingRoutes from "./routes/booking.routes.js";
import WebhookRoutes from "./routes/webhook.routes.js";
import ContractTemplateRoutes from "./routes/contractTemplate.routes.js";
import PackageRoutes from "./routes/package.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Connect to DB before handling any request (works for both local and serverless)
app.use(async (req, res, next) => {
  try {
    await ConnectDb();
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/api/leads", LeadRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/webhooks", WebhookRoutes);
app.use("/api/contract-templates", ContractTemplateRoutes);
app.use("/api/packages", PackageRoutes);

app.get("/", (req, res) => {
  res.json("Api is running");
});

app.use(ErrorMiddleware);

export default app;
```
```diff:package.controller.js
===
import catchAsyncError from "../middleware/catchAsyncError.js";
import Package from "../models/package.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * GET /packages
 * Get all packages.
 */
export const handleGetPackages = catchAsyncError(async (req, res, next) => {
  const packages = await Package.find().sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, packages, "Packages retrieved successfully")
  );
});

/**
 * GET /packages/:id
 * Get a single package by ID.
 */
export const handleGetPackage = catchAsyncError(async (req, res, next) => {
  const pkg = await Package.findById(req.params.id);

  if (!pkg) {
    return next(new ErrorHandler("Package not found", 404));
  }

  res.status(200).json(
    new ApiResponse(200, pkg, "Package retrieved successfully")
  );
});

/**
 * POST /packages
 * Create a new package.
 */
export const handleCreatePackage = catchAsyncError(async (req, res, next) => {
  const { name, details, price } = req.body;

  if (!name || !details || price === undefined) {
    return res.status(400).json(
      new ApiResponse(400, null, "Name, details, and price are required")
    );
  }

  const pkg = await Package.create({
    name,
    details,
    price,
  });

  res.status(201).json(
    new ApiResponse(201, pkg, "Package created successfully")
  );
});

/**
 * PUT /packages/:id
 * Update an existing package.
 */
export const handleUpdatePackage = catchAsyncError(async (req, res, next) => {
  const pkg = await Package.findById(req.params.id);

  if (!pkg) {
    return next(new ErrorHandler("Package not found", 404));
  }

  if (req.body.name !== undefined) pkg.name = req.body.name;
  if (req.body.details !== undefined) pkg.details = req.body.details;
  if (req.body.price !== undefined) pkg.price = req.body.price;

  await pkg.save();

  res.status(200).json(
    new ApiResponse(200, pkg, "Package updated successfully")
  );
});

/**
 * DELETE /packages/:id
 * Delete a package.
 */
export const handleDeletePackage = catchAsyncError(async (req, res, next) => {
  const pkg = await Package.findById(req.params.id);

  if (!pkg) {
    return next(new ErrorHandler("Package not found", 404));
  }

  await pkg.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, "Package deleted successfully")
  );
});
```
```diff:package.routes.js
===
import express from "express";
import {
  handleGetPackages,
  handleGetPackage,
  handleCreatePackage,
  handleUpdatePackage,
  handleDeletePackage,
} from "../controllers/package.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, handleGetPackages);
router.get("/:id", authMiddleware, handleGetPackage);
router.post("/", authMiddleware, handleCreatePackage);
router.put("/:id", authMiddleware, handleUpdatePackage);
router.delete("/:id", authMiddleware, handleDeletePackage);

export default router;
```
```diff:package.model.js
===
import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
```
```diff:contractTemplate.controller.js
import catchAsyncError from "../middleware/catchAsyncError.js";
import ContractTemplate from "../models/contractTemplate.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * GET /contract-templates
 * List all contract templates.
 */
export const handleGetTemplates = catchAsyncError(async (req, res, next) => {
  const templates = await ContractTemplate.find()
    .select("-content")
    .sort({ isDefault: -1, createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, templates, "Templates retrieved"),
  );
});

/**
 * GET /contract-templates/:id
 * Get a single template with full content.
 */
export const handleGetTemplate = catchAsyncError(async (req, res, next) => {
  const template = await ContractTemplate.findById(req.params.id);

  if (!template) {
    return next(new ErrorHandler("Template not found", 404));
  }

  res.status(200).json(
    new ApiResponse(200, template, "Template retrieved"),
  );
});

/**
 * POST /contract-templates
 * Create a new contract template.
 *
 * The `content` field is HTML with {{placeholders}} that get replaced
 * with booking data when a contract is generated.
 *
 * Available placeholders:
 *   {{clientName}}, {{clientEmail}}, {{clientPhone}}, {{clientCountry}},
 *   {{company}}, {{huntDate}}, {{huntInterest}}, {{packageType}},
 *   {{addOns}}, {{firearmOptions}}, {{totalAmount}}, {{currentDate}},
 *   {{paymentSchedule}}, {{customFields}}
 *
 * Signature anchors (DocuSign picks these up automatically):
 *   /sig1/  — client signature placement
 *   /date1/ — date signed placement
 */
export const handleCreateTemplate = catchAsyncError(async (req, res, next) => {
  const { name, content, isDefault } = req.body;

  if (!name || !content) {
    return res.status(400).json(
      new ApiResponse(400, null, "Name and content are required"),
    );
  }

  const template = await ContractTemplate.create({
    name,
    content,
    isDefault: isDefault || false,
  });

  res.status(201).json(
    new ApiResponse(201, template, "Template created successfully"),
  );
});

/**
 * PUT /contract-templates/:id
 * Update an existing template.
 */
export const handleUpdateTemplate = catchAsyncError(async (req, res, next) => {
  const template = await ContractTemplate.findById(req.params.id);

  if (!template) {
    return next(new ErrorHandler("Template not found", 404));
  }

  if (req.body.name !== undefined) template.name = req.body.name;
  if (req.body.content !== undefined) template.content = req.body.content;
  if (req.body.isDefault !== undefined) template.isDefault = req.body.isDefault;

  await template.save();

  res.status(200).json(
    new ApiResponse(200, template, "Template updated successfully"),
  );
});

/**
 * DELETE /contract-templates/:id
 * Delete a template.
 */
export const handleDeleteTemplate = catchAsyncError(async (req, res, next) => {
  const template = await ContractTemplate.findById(req.params.id);

  if (!template) {
    return next(new ErrorHandler("Template not found", 404));
  }

  await template.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, "Template deleted successfully"),
  );
});
===
import catchAsyncError from "../middleware/catchAsyncError.js";
import ContractTemplate from "../models/contractTemplate.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * GET /contract-templates
 * List all contract templates.
 */
export const handleGetTemplates = catchAsyncError(async (req, res, next) => {
  const templates = await ContractTemplate.find()
    .select("-content")
    .sort({ isDefault: -1, createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, templates, "Templates retrieved"),
  );
});

/**
 * GET /contract-templates/:id
 * Get a single template with full content.
 */
export const handleGetTemplate = catchAsyncError(async (req, res, next) => {
  const template = await ContractTemplate.findById(req.params.id);

  if (!template) {
    return next(new ErrorHandler("Template not found", 404));
  }

  res.status(200).json(
    new ApiResponse(200, template, "Template retrieved"),
  );
});

/**
 * POST /contract-templates
 * Create a new contract template.
 *
 * The `content` field is HTML with {{placeholders}} that get replaced
 * with booking data when a contract is generated.
 *
 * Available placeholders:
 *   {{clientName}}, {{clientEmail}}, {{clientPhone}}, {{clientCountry}},
 *   {{company}}, {{huntDate}}, {{huntInterest}}, {{packageType}},
 *   {{addOns}}, {{firearmOptions}}, {{totalAmount}}, {{currentDate}},
 *   {{paymentSchedule}}, {{customFields}}
 *
 * Signature anchors (DocuSign picks these up automatically):
 *   /sig1/  — client signature placement
 *   /date1/ — date signed placement
 */
export const handleCreateTemplate = catchAsyncError(async (req, res, next) => {
  const { name, content, isDefault } = req.body;

  if (!name || !content) {
    return res.status(400).json(
      new ApiResponse(400, null, "Name and content are required"),
    );
  }

  const template = await ContractTemplate.create({
    name,
    content,
    isDefault: isDefault || false,
  });

  res.status(201).json(
    new ApiResponse(201, template, "Template created successfully"),
  );
});

/**
 * PUT /contract-templates/:id
 * Update an existing template.
 */
export const handleUpdateTemplate = catchAsyncError(async (req, res, next) => {
  const template = await ContractTemplate.findById(req.params.id);

  if (!template) {
    return next(new ErrorHandler("Template not found", 404));
  }

  if (req.body.name !== undefined) template.name = req.body.name;
  if (req.body.content !== undefined) template.content = req.body.content;
  if (req.body.isDefault !== undefined) template.isDefault = req.body.isDefault;

  await template.save();

  res.status(200).json(
    new ApiResponse(200, template, "Template updated successfully"),
  );
});

/**
 * DELETE /contract-templates/:id
 * Delete a template.
 */
export const handleDeleteTemplate = catchAsyncError(async (req, res, next) => {
  const template = await ContractTemplate.findById(req.params.id);

  if (!template) {
    return next(new ErrorHandler("Template not found", 404));
  }

  await template.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, "Template deleted successfully"),
  );
});

import { getDefaultTemplate } from "../services/contract.service.js";

/**
 * POST /contract-templates/seed-default
 * Utility endpoint to save the hardcoded default template into the database so it can be edited by Admin.
 */
export const handleSeedDefaultTemplate = catchAsyncError(async (req, res, next) => {
  let template = await ContractTemplate.findOne({ isDefault: true });

  if (!template) {
    template = await ContractTemplate.create({
      name: "Default Hunt Contract",
      content: getDefaultTemplate(),
      isDefault: true,
    });
    
    return res.status(201).json(
      new ApiResponse(201, template, "Default template seeded successfully")
    );
  }

  res.status(200).json(
    new ApiResponse(200, template, "Default template already exists in database")
  );
});
```
```diff:contractTemplate.routes.js
import express from "express";
import {
  handleGetTemplates,
  handleGetTemplate,
  handleCreateTemplate,
  handleUpdateTemplate,
  handleDeleteTemplate,
} from "../controllers/contractTemplate.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, handleGetTemplates);
router.get("/:id", authMiddleware, handleGetTemplate);
router.post("/", authMiddleware, handleCreateTemplate);
router.put("/:id", authMiddleware, handleUpdateTemplate);
router.delete("/:id", authMiddleware, handleDeleteTemplate);

export default router;
===
import express from "express";
import {
  handleGetTemplates,
  handleGetTemplate,
  handleCreateTemplate,
  handleUpdateTemplate,
  handleDeleteTemplate,
  handleSeedDefaultTemplate,
} from "../controllers/contractTemplate.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, handleGetTemplates);
router.get("/:id", authMiddleware, handleGetTemplate);
router.post("/", authMiddleware, handleCreateTemplate);
router.post("/seed-default", authMiddleware, handleSeedDefaultTemplate);
router.put("/:id", authMiddleware, handleUpdateTemplate);
router.delete("/:id", authMiddleware, handleDeleteTemplate);

export default router;
```
```diff:contract.service.js
import ContractTemplate from "../models/contractTemplate.model.js";

/**
 * Generate contract HTML by replacing {{placeholders}} in a template
 * with actual booking data, custom fields, and payment schedule.
 *
 * Available placeholders:
 *   {{clientName}}, {{clientEmail}}, {{clientPhone}}, {{clientCountry}},
 *   {{huntDate}}, {{huntInterest}}, {{packageType}}, {{addOns}},
 *   {{firearmOptions}}, {{totalAmount}},
 *   {{company}}, {{customFields}}, {{paymentSchedule}}
 */
export const generateContractHtml = async (booking, templateId = null) => {
  let template;

  if (templateId) {
    template = await ContractTemplate.findById(templateId);
  } else {
    template = await ContractTemplate.findOne({ isDefault: true });
  }

  if (!template) {
    template = { content: getDefaultTemplate() };
  }

  let html = template.content;

  // Replace standard placeholders
  const replacements = {
    "{{clientName}}": booking.name || "",
    "{{clientEmail}}": booking.email || "",
    "{{clientPhone}}": booking.phone || "",
    "{{clientCountry}}": booking.country || "",
    "{{company}}": booking.company || "",
    "{{huntDate}}": booking.huntDate
      ? new Date(booking.huntDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    "{{huntInterest}}": booking.huntInterest || "",
    "{{packageType}}": booking.packageType || "Standard",
    "{{addOns}}": Array.isArray(booking.addOns)
      ? booking.addOns.join(", ")
      : "",
    "{{firearmOptions}}": booking.firearmOptions || "",
    "{{totalAmount}}": booking.totalAmount
      ? `$${booking.totalAmount.toLocaleString()}`
      : "TBD",
    "{{currentDate}}": new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.replaceAll(placeholder, value);
  }

  // Build payment schedule section
  if (booking.paymentSchedule && booking.paymentSchedule.length > 0) {
    const totalScheduled = booking.paymentSchedule.reduce(
      (sum, p) => sum + p.amount,
      0,
    );

    const rows = booking.paymentSchedule
      .map(
        (p, i) =>
          `<tr>
            <td style="padding:10px;border:1px solid #ddd;">${i + 1}</td>
            <td style="padding:10px;border:1px solid #ddd;">${p.label}</td>
            <td style="padding:10px;border:1px solid #ddd;">$${p.amount.toLocaleString()}</td>
            <td style="padding:10px;border:1px solid #ddd;">${new Date(p.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
          </tr>`,
      )
      .join("");

    const scheduleHtml = `
      <table style="width:100%;border-collapse:collapse;margin:15px 0;">
        <thead>
          <tr style="background:#16213e;color:#fff;">
            <th style="padding:10px;border:1px solid #ddd;text-align:left;">#</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Description</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Amount</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Due Date</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr style="background:#f8f9fa;font-weight:bold;">
            <td colspan="2" style="padding:10px;border:1px solid #ddd;">Total</td>
            <td colspan="2" style="padding:10px;border:1px solid #ddd;">$${totalScheduled.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>`;

    html = html.replaceAll("{{paymentSchedule}}", scheduleHtml);
  } else {
    html = html.replaceAll("{{paymentSchedule}}", "<p>Payment schedule to be determined.</p>");
  }

  // Build custom fields section
  if (booking.customFields && booking.customFields.length > 0) {
    const customFieldsHtml = booking.customFields
      .map(
        (field) =>
          `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">${field.label}</td><td style="padding:8px;border:1px solid #ddd;">${field.value}</td></tr>`,
      )
      .join("");

    html = html.replaceAll(
      "{{customFields}}",
      `<table style="width:100%;border-collapse:collapse;margin:10px 0;"><tbody>${customFieldsHtml}</tbody></table>`,
    );
  } else {
    html = html.replaceAll("{{customFields}}", "");
  }

  return html;
};

/**
 * Default contract HTML template.
 * Includes /sig1/ and /date1/ anchor tags for DocuSign signature placement.
 */
function getDefaultTemplate() {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
    h1 { color: #1a1a2e; border-bottom: 2px solid #16213e; padding-bottom: 10px; }
    h2 { color: #16213e; margin-top: 30px; }
    .header { text-align: center; margin-bottom: 40px; }
    .section { margin: 20px 0; }
    .details-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .details-table td { padding: 10px; border: 1px solid #ddd; }
    .details-table td:first-child { font-weight: bold; background: #f8f9fa; width: 35%; }
    .terms { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
    .signature-block { margin-top: 60px; page-break-inside: avoid; }
  </style>
</head>
<body>
  <div class="header">
    <h1>HUNT BOOKING CONTRACT</h1>
    <p>Date: {{currentDate}}</p>
  </div>

  <div class="section">
    <h2>Client Information</h2>
    <table class="details-table">
      <tr><td>Full Name</td><td>{{clientName}}</td></tr>
      <tr><td>Email</td><td>{{clientEmail}}</td></tr>
      <tr><td>Phone</td><td>{{clientPhone}}</td></tr>
      <tr><td>Company</td><td>{{company}}</td></tr>
      <tr><td>Country</td><td>{{clientCountry}}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Booking Details</h2>
    <table class="details-table">
      <tr><td>Hunt Type</td><td>{{huntInterest}}</td></tr>
      <tr><td>Hunt Date</td><td>{{huntDate}}</td></tr>
      <tr><td>Package Type</td><td>{{packageType}}</td></tr>
      <tr><td>Add-Ons</td><td>{{addOns}}</td></tr>
      <tr><td>Firearm Choice</td><td>{{firearmOptions}}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Payment Schedule</h2>
    <p><strong>Total Amount: {{totalAmount}}</strong></p>
    {{paymentSchedule}}
  </div>

  {{customFields}}

  <div class="terms">
    <h2>Terms & Conditions</h2>
    <ol>
      <li>The initial deposit is non-refundable once the contract is signed.</li>
      <li>All payments must be received by their respective due dates.</li>
      <li>The final payment must be received no later than 60 days before the scheduled hunt date.</li>
      <li>Cancellations made less than 60 days before the hunt date will forfeit all payments made.</li>
      <li>The company reserves the right to modify hunt schedules due to weather or safety concerns.</li>
      <li>All participants must comply with local hunting regulations and licensing requirements.</li>
      <li>The client is responsible for obtaining all necessary travel documents and permits.</li>
    </ol>
  </div>

  <div class="signature-block">
    <h2>Signature</h2>
    <p>By signing below, I agree to the terms and conditions outlined in this contract, including the payment schedule above.</p>

    <p><strong>Client Signature:</strong></p>
    <p>/sig1/</p>

    <p><strong>Date Signed:</strong></p>
    <p>/date1/</p>
  </div>
</body>
</html>`;
}
===
import ContractTemplate from "../models/contractTemplate.model.js";

/**
 * Generate contract HTML by replacing {{placeholders}} in a template
 * with actual booking data, custom fields, and payment schedule.
 *
 * Available placeholders:
 *   {{clientName}}, {{clientEmail}}, {{clientPhone}}, {{clientCountry}},
 *   {{huntDate}}, {{huntInterest}}, {{packageType}}, {{addOns}},
 *   {{firearmOptions}}, {{totalAmount}},
 *   {{company}}, {{customFields}}, {{paymentSchedule}}
 */
export const generateContractHtml = async (booking, templateId = null) => {
  let template;

  if (templateId) {
    template = await ContractTemplate.findById(templateId);
  } else {
    template = await ContractTemplate.findOne({ isDefault: true });
  }

  if (!template) {
    template = { content: getDefaultTemplate() };
  }

  let html = template.content;

  // Replace standard placeholders
  const replacements = {
    "{{clientName}}": booking.name || "",
    "{{clientEmail}}": booking.email || "",
    "{{clientPhone}}": booking.phone || "",
    "{{clientCountry}}": booking.country || "",
    "{{company}}": booking.company || "",
    "{{huntDate}}": booking.huntDate
      ? new Date(booking.huntDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    "{{huntInterest}}": booking.huntInterest || "",
    "{{packageType}}": booking.packageType || "Standard",
    "{{addOns}}": Array.isArray(booking.addOns)
      ? booking.addOns.join(", ")
      : "",
    "{{firearmOptions}}": booking.firearmOptions || "",
    "{{totalAmount}}": booking.totalAmount
      ? `$${booking.totalAmount.toLocaleString()}`
      : "TBD",
    "{{currentDate}}": new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.replaceAll(placeholder, value);
  }

  // Build payment schedule section
  if (booking.paymentSchedule && booking.paymentSchedule.length > 0) {
    const totalScheduled = booking.paymentSchedule.reduce(
      (sum, p) => sum + p.amount,
      0,
    );

    const rows = booking.paymentSchedule
      .map(
        (p, i) =>
          `<tr>
            <td style="padding:10px;border:1px solid #ddd;">${i + 1}</td>
            <td style="padding:10px;border:1px solid #ddd;">${p.label}</td>
            <td style="padding:10px;border:1px solid #ddd;">$${p.amount.toLocaleString()}</td>
            <td style="padding:10px;border:1px solid #ddd;">${new Date(p.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
          </tr>`,
      )
      .join("");

    const scheduleHtml = `
      <table style="width:100%;border-collapse:collapse;margin:15px 0;">
        <thead>
          <tr style="background:#16213e;color:#fff;">
            <th style="padding:10px;border:1px solid #ddd;text-align:left;">#</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Description</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Amount</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Due Date</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr style="background:#f8f9fa;font-weight:bold;">
            <td colspan="2" style="padding:10px;border:1px solid #ddd;">Total</td>
            <td colspan="2" style="padding:10px;border:1px solid #ddd;">$${totalScheduled.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>`;

    html = html.replaceAll("{{paymentSchedule}}", scheduleHtml);
  } else {
    html = html.replaceAll("{{paymentSchedule}}", "<p>Payment schedule to be determined.</p>");
  }

  // Build custom fields section
  if (booking.customFields && booking.customFields.length > 0) {
    const customFieldsHtml = booking.customFields
      .map(
        (field) =>
          `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">${field.label}</td><td style="padding:8px;border:1px solid #ddd;">${field.value}</td></tr>`,
      )
      .join("");

    html = html.replaceAll(
      "{{customFields}}",
      `<table style="width:100%;border-collapse:collapse;margin:10px 0;"><tbody>${customFieldsHtml}</tbody></table>`,
    );
  } else {
    html = html.replaceAll("{{customFields}}", "");
  }

  return html;
};

/**
 * Default contract HTML template.
 * Includes /sig1/ and /date1/ anchor tags for DocuSign signature placement.
 */
export function getDefaultTemplate() {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
    h1 { color: #1a1a2e; border-bottom: 2px solid #16213e; padding-bottom: 10px; }
    h2 { color: #16213e; margin-top: 30px; }
    .header { text-align: center; margin-bottom: 40px; }
    .section { margin: 20px 0; }
    .details-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .details-table td { padding: 10px; border: 1px solid #ddd; }
    .details-table td:first-child { font-weight: bold; background: #f8f9fa; width: 35%; }
    .terms { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
    .signature-block { margin-top: 60px; page-break-inside: avoid; }
  </style>
</head>
<body>
  <div class="header">
    <h1>HUNT BOOKING CONTRACT</h1>
    <p>Date: {{currentDate}}</p>
  </div>

  <div class="section">
    <h2>Client Information</h2>
    <table class="details-table">
      <tr><td>Full Name</td><td>{{clientName}}</td></tr>
      <tr><td>Email</td><td>{{clientEmail}}</td></tr>
      <tr><td>Phone</td><td>{{clientPhone}}</td></tr>
      <tr><td>Company</td><td>{{company}}</td></tr>
      <tr><td>Country</td><td>{{clientCountry}}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Booking Details</h2>
    <table class="details-table">
      <tr><td>Hunt Type</td><td>{{huntInterest}}</td></tr>
      <tr><td>Hunt Date</td><td>{{huntDate}}</td></tr>
      <tr><td>Package Type</td><td>{{packageType}}</td></tr>
      <tr><td>Add-Ons</td><td>{{addOns}}</td></tr>
      <tr><td>Firearm Choice</td><td>{{firearmOptions}}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Dynamic Package Selection</h2>
    <p>Please select your preferred package from the dropdown below:</p>
    <p>/package_dropdown/</p>
    
    <p><strong>Package Specific Details:</strong><br>
    The details for the selected package will appear in the contract automatically.</p>

    <p><strong>Package Price:</strong> $<span style="color:white">/dynamic_price/</span></p>
  </div>

  <div class="section">
    <h2>Pick Up Location</h2>
    <p>Please enter your desired pick up location for the hunt:</p>
    <p>/pickup_location/</p>
  </div>

  <div class="section">
    <h2>Payment Schedule</h2>
    <p><strong>Total Amount: {{totalAmount}}</strong></p>
    {{paymentSchedule}}
  </div>

  {{customFields}}

  <div class="terms">
    <h2>Terms & Conditions</h2>
    <ol>
      <li>The initial deposit is non-refundable once the contract is signed.</li>
      <li>All payments must be received by their respective due dates.</li>
      <li>The final payment must be received no later than 60 days before the scheduled hunt date.</li>
      <li>Cancellations made less than 60 days before the hunt date will forfeit all payments made.</li>
      <li>The company reserves the right to modify hunt schedules due to weather or safety concerns.</li>
      <li>All participants must comply with local hunting regulations and licensing requirements.</li>
      <li>The client is responsible for obtaining all necessary travel documents and permits.</li>
    </ol>
  </div>

  <div class="signature-block">
    <h2>Signature</h2>
    <p>By signing below, I agree to the terms and conditions outlined in this contract, including the payment schedule above.</p>

    <p><strong>Client Signature:</strong></p>
    <p>/sig1/</p>

    <p><strong>Date Signed:</strong></p>
    <p>/date1/</p>
  </div>
</body>
</html>`;
}
```
```diff:docusign.controller.js
import catchAsyncError from "../middleware/catchAsyncError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Booking from "../models/booking.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {
  sendEnvelope,
  getEnvelopeDocument,
  getEnvelopeStatus,
  validateWebhookHMAC,
} from "../services/docusign.service.js";
import { generateContractHtml } from "../services/contract.service.js";

/**
 * POST /bookings/:id/send-contract
 * Admin generates contract from booking data and sends via DocuSign.
 * Booking status: DRAFT → TENTATIVE
 */
export const handleSendContract = catchAsyncError(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  if (!["Draft", "Tentative", "Declined"].includes(booking.status)) {
    return res.status(400).json(
      new ApiResponse(400, null, `Cannot send contract for booking with status "${booking.status}". Only "Draft", "Tentative", or "Declined" bookings can be sent.`),
    );
  }

  // Generate contract HTML from template + booking data
  const templateId = req.body.templateId || null;
  const contractHtml = await generateContractHtml(booking, templateId);

  // Save the generated contract in the booking for reference
  booking.contractHtml = contractHtml;

  // Send to DocuSign
  const result = await sendEnvelope(booking, contractHtml);

  // Update booking
  booking.status = "Tentative";
  booking.docusign = {
    envelopeId: result.envelopeId,
    envelopeStatus: result.status,
    sentAt: result.sentAt,
  };

  booking.notifications.push({
    type: "contract_sent",
    message: `Contract sent to ${booking.email} for signing.`,
  });

  await booking.save();

  res.status(200).json(
    new ApiResponse(200, {
      envelopeId: result.envelopeId,
      status: booking.status,
      sentTo: booking.email,
    }, "Contract sent successfully via DocuSign"),
  );
});

/**
 * POST /webhooks/docusign
 * DocuSign Connect webhook — fires when envelope status changes.
 * When completed (signed): booking status → SIGNED + admin notification.
 */
export const handleDocuSignWebhook = catchAsyncError(async (req, res, next) => {
  // Validate HMAC signature
  const signature = req.headers["x-docusign-signature-1"];
  const rawBody = JSON.stringify(req.body);

  if (process.env.DOCUSIGN_HMAC_KEY && signature) {
    const isValid = validateWebhookHMAC(rawBody, signature);
    if (!isValid) {
      return res.status(401).json(
        new ApiResponse(401, null, "Invalid webhook signature"),
      );
    }
  }

  const event = req.body;
  const envelopeId = event?.data?.envelopeId || event?.envelopeId;
  const envelopeStatus = event?.data?.envelopeSummary?.status || event?.event;

  if (!envelopeId) {
    return res.status(200).json(new ApiResponse(200, null, "No envelope ID"));
  }

  const booking = await Booking.findOne({
    "docusign.envelopeId": envelopeId,
  });

  if (!booking) {
    // Not our envelope — acknowledge anyway
    return res.status(200).json(new ApiResponse(200, null, "Envelope not found"));
  }

  // Update envelope status
  booking.docusign.envelopeStatus = envelopeStatus;

  if (envelopeStatus === "completed" || envelopeStatus === "signing_complete") {
    booking.status = "Signed";
    booking.docusign.signedAt = new Date();

    booking.notifications.push({
      type: "contract_signed",
      message: `Contract signed by ${booking.name} (${booking.email}). The booking is now awaiting confirmation.`,
    });
  } else if (envelopeStatus === "declined") {
    booking.status = "Declined";
    booking.notifications.push({
      type: "contract_declined",
      message: `Contract was declined by ${booking.name} (${booking.email}).`,
    });
  } else if (envelopeStatus === "voided") {
    booking.status = "Cancelled";
    booking.notifications.push({
      type: "contract_voided",
      message: `Contract for ${booking.name} was voided.`,
    });
  }

  await booking.save();

  // Always respond 200 to acknowledge the webhook
  res.status(200).json(new ApiResponse(200, null, "Webhook processed"));
});

/**
 * GET /bookings/:id/contract-status
 * Fetches real-time envelope status from DocuSign.
 */
export const handleGetContractStatus = catchAsyncError(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  if (!booking.docusign?.envelopeId) {
    return res.status(400).json(
      new ApiResponse(400, null, "No contract has been sent for this booking"),
    );
  }

  const status = await getEnvelopeStatus(booking.docusign.envelopeId);

  res.status(200).json(
    new ApiResponse(200, {
      bookingStatus: booking.status,
      docusignStatus: status,
    }, "Contract status retrieved"),
  );
});

/**
 * GET /bookings/:id/contract
 * Fetches the signed document from DocuSign on-demand and streams to client.
 */
export const handleDownloadContract = catchAsyncError(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  if (!booking.docusign?.envelopeId) {
    return res.status(400).json(
      new ApiResponse(400, null, "No contract has been sent for this booking"),
    );
  }

  const document = await getEnvelopeDocument(booking.docusign.envelopeId);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="contract-${booking.name.replace(/\s+/g, "_")}.pdf"`,
  );

  // Stream the document buffer to the response
  if (Buffer.isBuffer(document)) {
    res.send(document);
  } else {
    document.pipe(res);
  }
});

/**
 * GET /bookings/notifications/all
 * Returns all unread notifications across all bookings.
 */
export const handleGetNotifications = catchAsyncError(async (req, res, next) => {
  const bookings = await Booking.find(
    { "notifications.read": false },
    { name: 1, email: 1, notifications: 1 },
  );

  const notifications = [];
  for (const booking of bookings) {
    for (const notif of booking.notifications) {
      if (!notif.read) {
        notifications.push({
          _id: notif._id,
          bookingId: booking._id,
          bookingName: booking.name,
          type: notif.type,
          message: notif.message,
          createdAt: notif.createdAt,
        });
      }
    }
  }

  // Sort by most recent first
  notifications.sort((a, b) => b.createdAt - a.createdAt);

  res.status(200).json(
    new ApiResponse(200, { notifications, count: notifications.length }, "Notifications retrieved"),
  );
});

/**
 * PUT /bookings/notifications/:notificationId/read
 * Mark a specific notification as read.
 */
export const handleMarkNotificationRead = catchAsyncError(async (req, res, next) => {
  const { notificationId } = req.params;

  const booking = await Booking.findOne(
    { "notifications._id": notificationId },
  );

  if (!booking) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  const notification = booking.notifications.id(notificationId);
  notification.read = true;
  await booking.save();

  res.status(200).json(
    new ApiResponse(200, null, "Notification marked as read"),
  );
});

/**
 * GET /bookings/sync-statuses
 * Fetches all pending contract statuses from DocuSign and updates MongoDB.
 * Called when admin opens the app to catch any missed webhook events.
 */
export const handleSyncStatuses = catchAsyncError(async (req, res, next) => {
  // Find all bookings that have a DocuSign envelope and are still "Tentative"
  const pendingBookings = await Booking.find({
    status: { $in: ["Tentative", "Declined"] },
    "docusign.envelopeId": { $exists: true, $ne: null },
  });

  if (pendingBookings.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, { synced: 0, updated: [] }, "No pending contracts to sync"),
    );
  }

  const updated = [];

  for (const booking of pendingBookings) {
    try {
      const dsStatus = await getEnvelopeStatus(booking.docusign.envelopeId);

      // Only update if status has actually changed
      if (dsStatus.status === booking.docusign.envelopeStatus) {
        continue;
      }

      booking.docusign.envelopeStatus = dsStatus.status;

      if (dsStatus.status === "completed") {
        booking.status = "Signed";
        booking.docusign.signedAt = dsStatus.completedDateTime
          ? new Date(dsStatus.completedDateTime)
          : new Date();

        booking.notifications.push({
          type: "contract_signed",
          message: `Contract signed by ${booking.name} (${booking.email}). The booking is now awaiting confirmation.`,
        });

        updated.push({
          bookingId: booking._id,
          name: booking.name,
          previousStatus: "Tentative",
          newStatus: "Signed",
          signedAt: booking.docusign.signedAt,
        });
      } else if (dsStatus.status === "declined") {
        booking.status = "Declined";
        booking.notifications.push({
          type: "contract_declined",
          message: `Contract was declined by ${booking.name} (${booking.email}).`,
        });

        updated.push({
          bookingId: booking._id,
          name: booking.name,
          previousStatus: "Tentative",
          newStatus: "Declined",
        });
      } else if (dsStatus.status === "voided") {
        booking.status = "Cancelled";
        booking.notifications.push({
          type: "contract_voided",
          message: `Contract for ${booking.name} was voided.`,
        });

        updated.push({
          bookingId: booking._id,
          name: booking.name,
          previousStatus: "Tentative",
          newStatus: "Cancelled",
        });
      }

      await booking.save();
    } catch (err) {
      // Log error but continue syncing other bookings
      console.error(`Failed to sync booking ${booking._id}:`, err.message);
    }
  }

  res.status(200).json(
    new ApiResponse(200, {
      checked: pendingBookings.length,
      synced: updated.length,
      updated,
    }, `Synced ${updated.length} of ${pendingBookings.length} pending contracts`),
  );
});
===
import catchAsyncError from "../middleware/catchAsyncError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Booking from "../models/booking.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {
  sendEnvelope,
  getEnvelopeDocument,
  getEnvelopeStatus,
  validateWebhookHMAC,
} from "../services/docusign.service.js";
import { generateContractHtml } from "../services/contract.service.js";
import Package from "../models/package.model.js";

/**
 * POST /bookings/:id/send-contract
 * Admin generates contract from booking data and sends via DocuSign.
 * Booking status: DRAFT → TENTATIVE
 */
export const handleSendContract = catchAsyncError(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  if (!["Draft", "Tentative", "Declined"].includes(booking.status)) {
    return res.status(400).json(
      new ApiResponse(400, null, `Cannot send contract for booking with status "${booking.status}". Only "Draft", "Tentative", or "Declined" bookings can be sent.`),
    );
  }

  // Generate contract HTML from template + booking data
  const templateId = req.body.templateId || null;
  const contractHtml = await generateContractHtml(booking, templateId);

  // Save the generated contract in the booking for reference
  booking.contractHtml = contractHtml;

  // Fetch available packages for the dropdown
  const packages = await Package.find().sort({ price: 1 });

  // Send to DocuSign
  const result = await sendEnvelope(booking, contractHtml, packages);

  // Update booking
  booking.status = "Tentative";
  booking.docusign = {
    envelopeId: result.envelopeId,
    envelopeStatus: result.status,
    sentAt: result.sentAt,
  };

  booking.notifications.push({
    type: "contract_sent",
    message: `Contract sent to ${booking.email} for signing.`,
  });

  await booking.save();

  res.status(200).json(
    new ApiResponse(200, {
      envelopeId: result.envelopeId,
      status: booking.status,
      sentTo: booking.email,
    }, "Contract sent successfully via DocuSign"),
  );
});

/**
 * POST /webhooks/docusign
 * DocuSign Connect webhook — fires when envelope status changes.
 * When completed (signed): booking status → SIGNED + admin notification.
 */
export const handleDocuSignWebhook = catchAsyncError(async (req, res, next) => {
  // Validate HMAC signature
  const signature = req.headers["x-docusign-signature-1"];
  const rawBody = JSON.stringify(req.body);

  if (process.env.DOCUSIGN_HMAC_KEY && signature) {
    const isValid = validateWebhookHMAC(rawBody, signature);
    if (!isValid) {
      return res.status(401).json(
        new ApiResponse(401, null, "Invalid webhook signature"),
      );
    }
  }

  const event = req.body;
  const envelopeId = event?.data?.envelopeId || event?.envelopeId;
  const envelopeStatus = event?.data?.envelopeSummary?.status || event?.event;

  if (!envelopeId) {
    return res.status(200).json(new ApiResponse(200, null, "No envelope ID"));
  }

  const booking = await Booking.findOne({
    "docusign.envelopeId": envelopeId,
  });

  if (!booking) {
    // Not our envelope — acknowledge anyway
    return res.status(200).json(new ApiResponse(200, null, "Envelope not found"));
  }

  // Update envelope status
  booking.docusign.envelopeStatus = envelopeStatus;

  if (envelopeStatus === "completed" || envelopeStatus === "signing_complete") {
    booking.status = "Signed";
    booking.docusign.signedAt = new Date();

    booking.notifications.push({
      type: "contract_signed",
      message: `Contract signed by ${booking.name} (${booking.email}). The booking is now awaiting confirmation.`,
    });
  } else if (envelopeStatus === "declined") {
    booking.status = "Declined";
    booking.notifications.push({
      type: "contract_declined",
      message: `Contract was declined by ${booking.name} (${booking.email}).`,
    });
  } else if (envelopeStatus === "voided") {
    booking.status = "Cancelled";
    booking.notifications.push({
      type: "contract_voided",
      message: `Contract for ${booking.name} was voided.`,
    });
  }

  await booking.save();

  // Always respond 200 to acknowledge the webhook
  res.status(200).json(new ApiResponse(200, null, "Webhook processed"));
});

/**
 * GET /bookings/:id/contract-status
 * Fetches real-time envelope status from DocuSign.
 */
export const handleGetContractStatus = catchAsyncError(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  if (!booking.docusign?.envelopeId) {
    return res.status(400).json(
      new ApiResponse(400, null, "No contract has been sent for this booking"),
    );
  }

  const status = await getEnvelopeStatus(booking.docusign.envelopeId);

  res.status(200).json(
    new ApiResponse(200, {
      bookingStatus: booking.status,
      docusignStatus: status,
    }, "Contract status retrieved"),
  );
});

/**
 * GET /bookings/:id/contract
 * Fetches the signed document from DocuSign on-demand and streams to client.
 */
export const handleDownloadContract = catchAsyncError(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  if (!booking.docusign?.envelopeId) {
    return res.status(400).json(
      new ApiResponse(400, null, "No contract has been sent for this booking"),
    );
  }

  const document = await getEnvelopeDocument(booking.docusign.envelopeId);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="contract-${booking.name.replace(/\s+/g, "_")}.pdf"`,
  );

  // Stream the document buffer to the response
  if (Buffer.isBuffer(document)) {
    res.send(document);
  } else {
    document.pipe(res);
  }
});

/**
 * GET /bookings/notifications/all
 * Returns all unread notifications across all bookings.
 */
export const handleGetNotifications = catchAsyncError(async (req, res, next) => {
  const bookings = await Booking.find(
    { "notifications.read": false },
    { name: 1, email: 1, notifications: 1 },
  );

  const notifications = [];
  for (const booking of bookings) {
    for (const notif of booking.notifications) {
      if (!notif.read) {
        notifications.push({
          _id: notif._id,
          bookingId: booking._id,
          bookingName: booking.name,
          type: notif.type,
          message: notif.message,
          createdAt: notif.createdAt,
        });
      }
    }
  }

  // Sort by most recent first
  notifications.sort((a, b) => b.createdAt - a.createdAt);

  res.status(200).json(
    new ApiResponse(200, { notifications, count: notifications.length }, "Notifications retrieved"),
  );
});

/**
 * PUT /bookings/notifications/:notificationId/read
 * Mark a specific notification as read.
 */
export const handleMarkNotificationRead = catchAsyncError(async (req, res, next) => {
  const { notificationId } = req.params;

  const booking = await Booking.findOne(
    { "notifications._id": notificationId },
  );

  if (!booking) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  const notification = booking.notifications.id(notificationId);
  notification.read = true;
  await booking.save();

  res.status(200).json(
    new ApiResponse(200, null, "Notification marked as read"),
  );
});

/**
 * GET /bookings/sync-statuses
 * Fetches all pending contract statuses from DocuSign and updates MongoDB.
 * Called when admin opens the app to catch any missed webhook events.
 */
export const handleSyncStatuses = catchAsyncError(async (req, res, next) => {
  // Find all bookings that have a DocuSign envelope and are still "Tentative"
  const pendingBookings = await Booking.find({
    status: { $in: ["Tentative", "Declined"] },
    "docusign.envelopeId": { $exists: true, $ne: null },
  });

  if (pendingBookings.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, { synced: 0, updated: [] }, "No pending contracts to sync"),
    );
  }

  const updated = [];

  for (const booking of pendingBookings) {
    try {
      const dsStatus = await getEnvelopeStatus(booking.docusign.envelopeId);

      // Only update if status has actually changed
      if (dsStatus.status === booking.docusign.envelopeStatus) {
        continue;
      }

      booking.docusign.envelopeStatus = dsStatus.status;

      if (dsStatus.status === "completed") {
        booking.status = "Signed";
        booking.docusign.signedAt = dsStatus.completedDateTime
          ? new Date(dsStatus.completedDateTime)
          : new Date();

        booking.notifications.push({
          type: "contract_signed",
          message: `Contract signed by ${booking.name} (${booking.email}). The booking is now awaiting confirmation.`,
        });

        updated.push({
          bookingId: booking._id,
          name: booking.name,
          previousStatus: "Tentative",
          newStatus: "Signed",
          signedAt: booking.docusign.signedAt,
        });
      } else if (dsStatus.status === "declined") {
        booking.status = "Declined";
        booking.notifications.push({
          type: "contract_declined",
          message: `Contract was declined by ${booking.name} (${booking.email}).`,
        });

        updated.push({
          bookingId: booking._id,
          name: booking.name,
          previousStatus: "Tentative",
          newStatus: "Declined",
        });
      } else if (dsStatus.status === "voided") {
        booking.status = "Cancelled";
        booking.notifications.push({
          type: "contract_voided",
          message: `Contract for ${booking.name} was voided.`,
        });

        updated.push({
          bookingId: booking._id,
          name: booking.name,
          previousStatus: "Tentative",
          newStatus: "Cancelled",
        });
      }

      await booking.save();
    } catch (err) {
      // Log error but continue syncing other bookings
      console.error(`Failed to sync booking ${booking._id}:`, err.message);
    }
  }

  res.status(200).json(
    new ApiResponse(200, {
      checked: pendingBookings.length,
      synced: updated.length,
      updated,
    }, `Synced ${updated.length} of ${pendingBookings.length} pending contracts`),
  );
});
```
```diff:docusign.service.js
import docusign from "docusign-esign";
import fs from "fs";
import crypto from "crypto";

let cachedToken = null;
let tokenExpiry = 0;

/**
 * Get a DocuSign access token using JWT Grant.
 * Caches the token for ~55 minutes to avoid re-authenticating on every call.
 */
export const getAccessToken = async () => {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath(process.env.DOCUSIGN_AUTH_SERVER);

  // Support 3 approaches:
  //   1. File path (local dev):  DOCUSIGN_PRIVATE_KEY=./config/docusign_private.pem
  //   2. Raw PEM key (env/Vercel): DOCUSIGN_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
  //   3. Base64 encoded (env/Vercel): DOCUSIGN_PRIVATE_KEY=MIIEowIBAAK...
  let privateKey;
  const keyValue = process.env.DOCUSIGN_PRIVATE_KEY;

  if (keyValue.includes("PRIVATE KEY")) {
    // Raw PEM key pasted directly in env var
    privateKey = Buffer.from(keyValue);
  } else if (keyValue.startsWith("./") || keyValue.startsWith("/") || keyValue.includes("\\")) {
    // File path
    privateKey = fs.readFileSync(keyValue);
  } else {
    // Base64 encoded
    privateKey = Buffer.from(keyValue, "base64");
  }

  const results = await apiClient.requestJWTUserToken(
    process.env.DOCUSIGN_INTEGRATION_KEY,
    process.env.DOCUSIGN_USER_ID,
    ["signature", "impersonation"],
    privateKey,
    3600, // 1 hour expiry
  );

  cachedToken = results.body.access_token;
  tokenExpiry = Date.now() + 55 * 60 * 1000; // refresh 5 min early

  return cachedToken;
};

/**
 * Create and send an envelope to DocuSign with the contract HTML.
 * DocuSign converts the HTML to a PDF internally.
 */
export const sendEnvelope = async (booking, contractHtml) => {
  const accessToken = await getAccessToken();

  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(process.env.DOCUSIGN_BASE_URL);
  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  // Create the document from HTML
  const document = new docusign.Document();
  document.documentBase64 = Buffer.from(contractHtml).toString("base64");
  document.name = `Contract - ${booking.name}`;
  document.fileExtension = "html";
  document.documentId = "1";

  // Define the signer
  const signer = new docusign.Signer();
  signer.email = booking.email;
  signer.name = booking.name;
  signer.recipientId = "1";
  signer.routingOrder = "1";

  // Add signature tab (positioned at the bottom of the contract)
  const signHere = new docusign.SignHere();
  signHere.anchorString = "/sig1/";
  signHere.anchorUnits = "pixels";
  signHere.anchorXOffset = "20";
  signHere.anchorYOffset = "10";

  // Add date signed tab
  const dateSigned = new docusign.DateSigned();
  dateSigned.anchorString = "/date1/";
  dateSigned.anchorUnits = "pixels";
  dateSigned.anchorXOffset = "20";
  dateSigned.anchorYOffset = "10";

  const tabs = new docusign.Tabs();
  tabs.signHereTabs = [signHere];
  tabs.dateSignedTabs = [dateSigned];
  signer.tabs = tabs;

  const recipients = new docusign.Recipients();
  recipients.signers = [signer];

  // Build the envelope
  const envelopeDefinition = new docusign.EnvelopeDefinition();
  envelopeDefinition.emailSubject = `Contract for Review - ${booking.huntInterest}`;
  envelopeDefinition.emailBlurb =
    `Dear ${booking.name},\n\nPlease review and sign the attached contract for your upcoming hunt booking.\n\nBest regards,\nThe Team`;
  envelopeDefinition.documents = [document];
  envelopeDefinition.recipients = recipients;
  envelopeDefinition.status = "sent"; // Send immediately

  const result = await envelopesApi.createEnvelope(
    process.env.DOCUSIGN_ACCOUNT_ID,
    { envelopeDefinition },
  );

  return {
    envelopeId: result.envelopeId,
    status: result.status,
    sentAt: new Date(),
  };
};

/**
 * Fetch signed document from DocuSign on-demand.
 * Returns a Buffer containing the PDF.
 */
export const getEnvelopeDocument = async (envelopeId) => {
  const accessToken = await getAccessToken();

  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(process.env.DOCUSIGN_BASE_URL);
  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  const document = await envelopesApi.getDocument(
    process.env.DOCUSIGN_ACCOUNT_ID,
    envelopeId,
    "combined", // Gets all documents in the envelope as a single PDF
  );

  return document;
};

/**
 * Get the current status of an envelope from DocuSign.
 */
export const getEnvelopeStatus = async (envelopeId) => {
  const accessToken = await getAccessToken();

  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(process.env.DOCUSIGN_BASE_URL);
  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  const envelope = await envelopesApi.getEnvelope(
    process.env.DOCUSIGN_ACCOUNT_ID,
    envelopeId,
  );

  return {
    status: envelope.status,
    sentDateTime: envelope.sentDateTime,
    completedDateTime: envelope.completedDateTime,
    declinedDateTime: envelope.declinedDateTime,
    voidedDateTime: envelope.voidedDateTime,
  };
};

/**
 * Validate incoming DocuSign webhook payload using HMAC-SHA256.
 */
export const validateWebhookHMAC = (payload, signature) => {
  const hmac = crypto.createHmac("sha256", process.env.DOCUSIGN_HMAC_KEY);
  hmac.update(payload);
  const computedHash = hmac.digest("base64");
  return computedHash === signature;
};
===
import docusign from "docusign-esign";
import fs from "fs";
import crypto from "crypto";

let cachedToken = null;
let tokenExpiry = 0;

/**
 * Get a DocuSign access token using JWT Grant.
 * Caches the token for ~55 minutes to avoid re-authenticating on every call.
 */
export const getAccessToken = async () => {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath(process.env.DOCUSIGN_AUTH_SERVER);

  // Support 3 approaches:
  //   1. File path (local dev):  DOCUSIGN_PRIVATE_KEY=./config/docusign_private.pem
  //   2. Raw PEM key (env/Vercel): DOCUSIGN_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
  //   3. Base64 encoded (env/Vercel): DOCUSIGN_PRIVATE_KEY=MIIEowIBAAK...
  let privateKey;
  const keyValue = process.env.DOCUSIGN_PRIVATE_KEY;

  if (keyValue.includes("PRIVATE KEY")) {
    // Raw PEM key pasted directly in env var
    privateKey = Buffer.from(keyValue);
  } else if (keyValue.startsWith("./") || keyValue.startsWith("/") || keyValue.includes("\\")) {
    // File path
    privateKey = fs.readFileSync(keyValue);
  } else {
    // Base64 encoded
    privateKey = Buffer.from(keyValue, "base64");
  }

  const results = await apiClient.requestJWTUserToken(
    process.env.DOCUSIGN_INTEGRATION_KEY,
    process.env.DOCUSIGN_USER_ID,
    ["signature", "impersonation"],
    privateKey,
    3600, // 1 hour expiry
  );

  cachedToken = results.body.access_token;
  tokenExpiry = Date.now() + 55 * 60 * 1000; // refresh 5 min early

  return cachedToken;
};

/**
 * Create and send an envelope to DocuSign with the contract HTML.
 * DocuSign converts the HTML to a PDF internally.
 */
export const sendEnvelope = async (booking, contractHtml, packages = []) => {
  const accessToken = await getAccessToken();

  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(process.env.DOCUSIGN_BASE_URL);
  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  // Create the document from HTML
  const document = new docusign.Document();
  document.documentBase64 = Buffer.from(contractHtml).toString("base64");
  document.name = `Contract - ${booking.name}`;
  document.fileExtension = "html";
  document.documentId = "1";

  // Define the signer
  const signer = new docusign.Signer();
  signer.email = booking.email;
  signer.name = booking.name;
  signer.recipientId = "1";
  signer.routingOrder = "1";

  // Add signature tab (positioned at the bottom of the contract)
  const signHere = new docusign.SignHere();
  signHere.anchorString = "/sig1/";
  signHere.anchorUnits = "pixels";
  signHere.anchorXOffset = "20";
  signHere.anchorYOffset = "10";

  // Add date signed tab
  const dateSigned = new docusign.DateSigned();
  dateSigned.anchorString = "/date1/";
  dateSigned.anchorUnits = "pixels";
  dateSigned.anchorXOffset = "20";
  dateSigned.anchorYOffset = "10";

  const tabs = new docusign.Tabs();
  tabs.signHereTabs = [signHere];
  tabs.dateSignedTabs = [dateSigned];

  // If there are packages, add the dropdown and formula tabs
  if (packages.length > 0) {
    const listTab = new docusign.List();
    listTab.anchorString = "/package_dropdown/";
    listTab.anchorUnits = "pixels";
    listTab.anchorXOffset = "0";
    listTab.anchorYOffset = "5";
    listTab.documentId = "1";
    listTab.pageNumber = "1";
    listTab.recipientId = "1";
    listTab.tabLabel = "PackageSelection";
    listTab.required = "true";

    // Map DB packages to DocuSign List Items
    listTab.listItems = packages.map((pkg) => {
      const item = new docusign.ListItem();
      item.text = `${pkg.name} - $${pkg.price} (${pkg.details})`;
      item.value = pkg.price.toString();
      return item;
    });

    // Formula Tab mapping to the Dropdown's value
    const formulaTab = new docusign.FormulaTab();
    formulaTab.anchorString = "/dynamic_price/";
    formulaTab.anchorUnits = "pixels";
    formulaTab.anchorXOffset = "0";
    formulaTab.anchorYOffset = "-5";
    formulaTab.documentId = "1";
    formulaTab.pageNumber = "1";
    formulaTab.recipientId = "1";
    formulaTab.tabLabel = "DynamicPackagePrice";
    formulaTab.formula = "([PackageSelection])";
    formulaTab.roundDecimalPlaces = "2";
    formulaTab.required = "false";
    formulaTab.locked = "true";
    formulaTab.font = "Helvetica";
    formulaTab.fontSize = "size12";

    tabs.listTabs = [listTab];
    tabs.formulaTabs = [formulaTab];
  }

  // Text tab for Pick Up Location textarea
  const pickupLocationTab = new docusign.Text();
  pickupLocationTab.anchorString = "/pickup_location/";
  pickupLocationTab.anchorUnits = "pixels";
  pickupLocationTab.anchorXOffset = "0";
  pickupLocationTab.anchorYOffset = "10";
  pickupLocationTab.documentId = "1";
  pickupLocationTab.pageNumber = "1";
  pickupLocationTab.recipientId = "1";
  pickupLocationTab.tabLabel = "PickUpLocation";
  pickupLocationTab.height = "60"; // Increased height for textarea
  pickupLocationTab.width = "400";
  pickupLocationTab.required = "false";
  
  tabs.textTabs = [pickupLocationTab];

  signer.tabs = tabs;

  const recipients = new docusign.Recipients();
  recipients.signers = [signer];

  // Build the envelope
  const envelopeDefinition = new docusign.EnvelopeDefinition();
  envelopeDefinition.emailSubject = `Contract for Review - ${booking.huntInterest}`;
  envelopeDefinition.emailBlurb =
    `Dear ${booking.name},\n\nPlease review and sign the attached contract for your upcoming hunt booking.\n\nBest regards,\nThe Team`;
  envelopeDefinition.documents = [document];
  envelopeDefinition.recipients = recipients;
  envelopeDefinition.status = "sent"; // Send immediately

  const result = await envelopesApi.createEnvelope(
    process.env.DOCUSIGN_ACCOUNT_ID,
    { envelopeDefinition },
  );

  return {
    envelopeId: result.envelopeId,
    status: result.status,
    sentAt: new Date(),
  };
};

/**
 * Fetch signed document from DocuSign on-demand.
 * Returns a Buffer containing the PDF.
 */
export const getEnvelopeDocument = async (envelopeId) => {
  const accessToken = await getAccessToken();

  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(process.env.DOCUSIGN_BASE_URL);
  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  const document = await envelopesApi.getDocument(
    process.env.DOCUSIGN_ACCOUNT_ID,
    envelopeId,
    "combined", // Gets all documents in the envelope as a single PDF
  );

  return document;
};

/**
 * Get the current status of an envelope from DocuSign.
 */
export const getEnvelopeStatus = async (envelopeId) => {
  const accessToken = await getAccessToken();

  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(process.env.DOCUSIGN_BASE_URL);
  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  const envelope = await envelopesApi.getEnvelope(
    process.env.DOCUSIGN_ACCOUNT_ID,
    envelopeId,
  );

  return {
    status: envelope.status,
    sentDateTime: envelope.sentDateTime,
    completedDateTime: envelope.completedDateTime,
    declinedDateTime: envelope.declinedDateTime,
    voidedDateTime: envelope.voidedDateTime,
  };
};

/**
 * Validate incoming DocuSign webhook payload using HMAC-SHA256.
 */
export const validateWebhookHMAC = (payload, signature) => {
  const hmac = crypto.createHmac("sha256", process.env.DOCUSIGN_HMAC_KEY);
  hmac.update(payload);
  const computedHash = hmac.digest("base64");
  return computedHash === signature;
};
```
