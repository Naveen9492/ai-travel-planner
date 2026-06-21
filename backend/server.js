const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("./db/connectDB");
const auth = require("./middleware/auth");

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.VERCEL_URL,
  credentials: true,
}));
app.use(express.json());

connectDB();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateTripPlan = async (
  destination,
  days,
  budgetType,
  interests
) => {
  const prompt = `
You are an expert travel planner.

Create a detailed ${days}-day travel itinerary.

Destination: ${destination}
Budget Type: ${budgetType}
Interests: ${interests.join(", ")}

Return ONLY valid JSON.

{
  "tripTitle": "",
  "bestTimeToVisit": "",
  "localTips": [
    ""
  ],
  "itinerary": [
    {
      "day": 1,
      "activities": [
        ""
      ]
    }
  ],
  "budgetEstimate": {
    "flights": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "total": 0
  },
  "hotels": [
    "Hotel Name - Budget",
    "Hotel Name - Mid Range",
    "Hotel Name - Luxury"
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text;

  const cleanedText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.log("Gemini Response:");
    console.log(cleanedText);

    throw new Error(
      "Gemini returned invalid JSON"
    );
  }
};

/* =========================
   USER SCHEMA
========================= */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

/* =========================
   TRIP SCHEMA
========================= */

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    days: {
      type: Number,
      required: true,
    },

    budgetType: {
      type: String,
      required: true,
    },

    interests: [String],

    itinerary: [
      {
        day: Number,
        activities: [String],
      },
    ],

    budgetEstimate: {
      flights: Number,
      accommodation: Number,
      food: Number,
      activities: Number,
      total: Number,
    },

    hotels: [String],
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Travel Planner API Running",
  });
});

/* =========================
   REGISTER
========================= */

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name && !email && !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   LOGIN
========================= */

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if(email===""&&password===""){
      return res.status(400).json({
        success:false,
        message:"email and password required",
      });
    }

    if(email===""){
      return res.status(400).json({
        success:false,
        message:"email required",
      });
    }
    if(password===""){
      return res.status(400).json({
        success:false,
        message:"password required",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   PROFILE
========================= */

app.get("/api/profile", auth, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

/* =========================
   GENERATE TRIP
========================= */

app.post(
  "/api/trips/generate",
  auth,
  async (req, res) => {
    try {
      const {
        destination,
        days,
        budgetType,
        interests,
      } = req.body;

      if (
        !destination ||
        !days ||
        !budgetType ||
        !interests
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const aiData =
        await generateTripPlan(
          destination,
          days,
          budgetType,
          interests
        );

      const trip =
        await Trip.create({
          userId: req.user.id,

          destination,
          days,
          budgetType,
          interests,

          itinerary:
            aiData.itinerary || [],

          budgetEstimate:
            aiData.budgetEstimate || {},

          hotels:
            aiData.hotels || [],
        });

      res.status(201).json({
        success: true,
        trip,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================
   GET ALL TRIPS
========================= */

app.get("/api/trips", auth, async (req, res) => {
  try {
    const trips = await Trip.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   GET SINGLE TRIP
========================= */

app.get(
  "/api/trips/:id",
  auth,
  async (req, res) => {
    try {
      const trip = await Trip.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      }

      res.json({
        success: true,
        trip,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================
   DELETE TRIP
========================= */

app.delete(
  "/api/trips/:id",
  auth,
  async (req, res) => {
    try {
      const trip =
        await Trip.findOneAndDelete({
          _id: req.params.id,
          userId: req.user.id,
        });

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      }

      res.json({
        success: true,
        message: "Trip deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================
   ADD Activity
========================= */

app.put(
  "/api/trips/:id/add-activity",
  auth,
  async (req, res) => {
    const { day, activity } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    const dayPlan = trip.itinerary.find(
      item => item.day === day
    );

    if (!dayPlan) {
      return res.status(404).json({
        success: false,
        message: "Day not found",
      });
    }

    dayPlan.activities.push(activity);

    await trip.save();

    res.json({
      success: true,
      trip,
    });
  }
);

/* =========================
   remove-activity
========================= */

app.put(
  "/api/trips/:id/remove-activity",
  auth,
  async (req, res) => {
    const { day, activity } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    const dayPlan = trip.itinerary.find(
      item => item.day === day
    );

    dayPlan.activities =
      dayPlan.activities.filter(
        item => item !== activity
      );

    await trip.save();

    res.json({
      success: true,
      trip,
    });
  }
);
/* ==========================
Regenerate Specific Day
========================== */

app.put(
  "/api/trips/:id/regenerate-day",
  auth,
  async (req, res) => {
    const { day, instruction } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    const prompt = `
Destination: ${trip.destination}

Regenerate Day ${day}

Instruction:
${instruction}

Return ONLY JSON

{
  "activities": [
    ""
  ]
}
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    const text = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(text);

    const dayPlan = trip.itinerary.find(
      item => item.day === day
    );

    dayPlan.activities =
      data.activities;

    await trip.save();

    res.json({
      success: true,
      trip,
    });
  }
);

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});