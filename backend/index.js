import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from "cors"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sahayaPath = join(__dirname, '..', 'sahaya');

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI)


async function connect() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

connect()

// Define Registration Schema
const registrationSchema = new mongoose.Schema({
  First_Name: String, 
  Last_Name: String,
  address: String,
});

// Create Registration Model
const Registration = mongoose.model("Registration", registrationSchema);

// Routes
app.get("/", (req, res) => {
    const filePath = join(sahayaPath, 'fifth.html');
    res.sendFile(filePath);;
});

app.post("/register", async (req, res) => {
  try {
    const { First_Name, Last_Name, address } = req.body;

    const registrationData = new Registration({
      First_Name,
      Last_Name,
      address,
    });

    await registrationData.save();
    res.json({ message: "Registration Successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Error Handling for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
