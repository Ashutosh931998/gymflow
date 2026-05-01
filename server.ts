import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  if (!MONGODB_URI) {
    console.error("CRITICAL ERROR: MONGODB_URI environment variable is not set.");
    return;
  }

  // Ensure a database name is specified if not present in URI
  let connectionUri = MONGODB_URI;
  if (!connectionUri.includes(".net/") && !connectionUri.includes(".net:27017/")) {
     // If the URI is like ...net/?appName... we insert 'gymflow'
     if (connectionUri.includes(".net/?")) {
       connectionUri = connectionUri.replace(".net/?", ".net/gymflow?");
     } else {
       connectionUri = connectionUri.split('?')[0] + "/gymflow" + (connectionUri.includes('?') ? '?' + connectionUri.split('?')[1] : '');
     }
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 5000, // Fail fast if Atlas is unreachable
    });
    isConnected = true;
    console.log(`Successfully connected to MongoDB Atlas (DB: ${mongoose.connection.name})`);
  } catch (err) {
    console.error("MongoDB connection error details:", err);
  }
};

// Initial connection attempt for long-running server
if (!process.env.NETLIFY) {
  connectDB();
}

// --- Schemas & Models ---

const GymSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  ownerEmail: String,
  permissions: {
    trainer: { pages: [String], actions: [String] },
    receptionist: { pages: [String], actions: [String] }
  }
});
const Gym = (mongoose.models.Gym as any) || mongoose.model("Gym", GymSchema);

const MemberSchema = new mongoose.Schema({
  gymName: { type: String, required: true },
  id: { type: String, required: true },
  name: String,
  email: String,
  phone: String,
  planId: String,
  status: String,
  joinDate: String,
  endDate: String
});
const Member = (mongoose.models.Member as any) || mongoose.model("Member", MemberSchema);

const PlanSchema = new mongoose.Schema({
  gymName: { type: String, required: true },
  id: { type: String, required: true },
  name: String,
  price: Number,
  duration: String,
  features: [String]
});
const Plan = (mongoose.models.Plan as any) || mongoose.model("Plan", PlanSchema);

const PaymentSchema = new mongoose.Schema({
  gymName: { type: String, required: true },
  id: { type: String, required: true },
  memberId: String,
  memberName: String,
  amount: Number,
  date: String,
  method: String,
  status: String
});
const Payment = (mongoose.models.Payment as any) || mongoose.model("Payment", PaymentSchema);

const AttendanceSchema = new mongoose.Schema({
  gymName: { type: String, required: true },
  id: { type: String, required: true },
  memberId: String,
  memberName: String,
  date: String,
  time: String,
  checkOutTime: String
});
const Attendance = (mongoose.models.Attendance as any) || mongoose.model("Attendance", AttendanceSchema);

const StaffSchema = new mongoose.Schema({
  gymName: { type: String, required: true },
  id: { type: String, required: true },
  name: String,
  email: { type: String, required: true },
  role: String
});
const Staff = (mongoose.models.Staff as any) || mongoose.model("Staff", StaffSchema);

const LeadSchema = new mongoose.Schema({
  gymName: { type: String, required: true },
  id: { type: String, required: true },
  name: String,
  phone: String,
  email: String,
  expectedJoinDate: String,
  status: String,
  notes: String,
  createdAt: String
});
const Lead = (mongoose.models.Lead as any) || mongoose.model("Lead", LeadSchema);

const RegistrySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: String,
  gymName: String,
  name: String
});
const Registry = (mongoose.models.Registry as any) || mongoose.model("Registry", RegistrySchema);

// --- API Routes ---
const router = express.Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));

// Registry/Auth Endpoints
router.get("/registry", async (req, res) => {
  try {
    const r = await Registry.find({});
    const registry: any = {};
    r.forEach(item => {
      registry[item.email] = {
        password: item.password,
        role: item.role,
        gymName: item.gymName,
        name: item.name
      };
    });
    res.json(registry);
  } catch (err) {
    res.status(500).json({ error: "Failed to load registry" });
  }
});

router.post("/registry", async (req, res) => {
  try {
    const { email, data } = req.body;
    await Registry.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { ...data, email: email.toLowerCase().trim() },
      { upsert: true }
    );
    res.json({ status: "success" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save to registry" });
  }
});

router.delete("/registry/:email", async (req, res) => {
  try {
    await Registry.deleteOne({ email: req.params.email.toLowerCase().trim() });
    res.json({ status: "success" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from registry" });
  }
});

// Load all data for a gym
router.get("/gym/:name", async (req, res) => {
  try {
    const gymName = req.params.name;
    const gym = await Gym.findOne({ name: gymName });
    const members = await Member.find({ gymName });
    const plans = await Plan.find({ gymName });
    const payments = await Payment.find({ gymName });
    const attendance = await Attendance.find({ gymName });
    const staff = await Staff.find({ gymName });
    const leads = await Lead.find({ gymName });

    res.json({
      meta: { gymName },
      permissions: gym?.permissions,
      members,
      plans,
      payments,
      attendance,
      staff,
      leads
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load gym data" });
  }
});

// Save/Sync all data (Bulk update)
router.post("/gym/:name/sync", async (req, res) => {
  try {
    const gymName = req.params.name;
    const { members, plans, payments, attendance, staff, leads, permissions } = req.body;

    // Update Gym Permissions
    await Gym.findOneAndUpdate(
      { name: gymName },
      { name: gymName, permissions },
      { upsert: true }
    );

    // Sync Collections
    await Member.deleteMany({ gymName });
    if (members?.length) await Member.insertMany(members.map((m: any) => ({ ...m, gymName })));

    await Plan.deleteMany({ gymName });
    if (plans?.length) await Plan.insertMany(plans.map((p: any) => ({ ...p, gymName })));

    await Payment.deleteMany({ gymName });
    if (payments?.length) await Payment.insertMany(payments.map((p: any) => ({ ...p, gymName })));

    await Attendance.deleteMany({ gymName });
    if (attendance?.length) await Attendance.insertMany(attendance.map((a: any) => ({ ...a, gymName })));

    await Staff.deleteMany({ gymName });
    if (staff?.length) await Staff.insertMany(staff.map((s: any) => ({ ...s, gymName })));

    await Lead.deleteMany({ gymName });
    if (leads?.length) await Lead.insertMany(leads.map((l: any) => ({ ...l, gymName })));

    res.json({ status: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to sync data" });
  }
});

// Mount the router
app.use("/api", router);
app.use("/", router); // Fallback for Netlify functions where /api might be stripped

// --- Vite & Static Serves ---

if (!process.env.NETLIFY) {
  if (process.env.NODE_ENV !== "production") {
    // Only attempt to load Vite in local development
    // Using simple logic to avoid bundler analysis if possible
    const setupVite = async () => {
      try {
        const { createServer: createViteServer } = await import("vite");
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: "spa",
        });
        app.use(vite.middlewares);
        app.listen(PORT, "0.0.0.0", () => {
          console.log(`Development server running on http://localhost:${PORT}`);
        });
      } catch (err) {
        console.error("Failed to start Vite dev server:", err);
      }
    };
    setupVite();
  } else {
    // Local production serving (not needed on Netlify)
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Production preview server running on http://localhost:${PORT}`);
    });
  }
}

export default app;
