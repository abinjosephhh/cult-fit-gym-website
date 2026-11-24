
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();

app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(
  __dirname,
  "data",
  "enquiries.json"
);


// MIDDLEWARE
app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: false }));


// SESSION CONFIGURATION
app.use(session({

  name: "cultfit.sid",

  secret: process.env.SESSION_SECRET || "replace-this-session-secret",

  resave: false,

  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 8
  }

}));


// STATIC FILES
app.use(express.static(path.join(__dirname, "public")));


// READ ENQUIRIES
function readEnquiries() {

  try {

    return JSON.parse(
      fs.readFileSync(DATA_FILE, "utf8")
    );

  } catch {

    return [];

  }

}


// WRITE ENQUIRIES
function writeEnquiries(items) {

  fs.mkdirSync(
    path.dirname(DATA_FILE),
    { recursive: true }
  );

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(items, null, 2)
  );

}


// ADMIN AUTHENTICATION
function requireAdmin(req, res, next) {

  if (!req.session || !req.session.isAdmin) {

    return res.status(401).json({
      error: "Please log in first."
    });

  }

  next();

}


// CONFIG API
app.get("/api/config", (req, res) => {

  res.json({

    whatsappNumber:
      process.env.WHATSAPP_NUMBER || "911234567890"

  });

});


// PUBLIC ENQUIRY API
app.post("/api/enquiries", (req, res) => {

  const {
    name,
    email,
    phone,
    interest,
    message
  } = req.body || {};

  if (!name || !phone || !message) {

    return res.status(400).json({

      error: "Please enter your name, phone number and message."

    });

  }

  const enquiries = readEnquiries();

  const enquiry = {

    id: Date.now().toString(),

    name: String(name).slice(0, 100),

    email: String(email || "").slice(0, 160),

    phone: String(phone).slice(0, 40),

    interest: String(interest || "").slice(0, 120),

    message: String(message).slice(0, 2000),

    createdAt: new Date().toISOString()

  };

  enquiries.unshift(enquiry);

  writeEnquiries(enquiries);

  res.status(201).json({

    success: true,

    id: enquiry.id

  });

});


// ADMIN PAGE
app.get("/admin", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "admin.html")
  );

});


// ADMIN LOGIN
app.post("/api/admin/login", (req, res) => {

  const password = process.env.ADMIN_PASSWORD;

  if (!password) {

    console.error("ADMIN_PASSWORD is not configured.");

    return res.status(500).json({

      error: "Admin password is not configured on the server."

    });

  }

  if (String(req.body.password || "") !== password) {

    return res.status(401).json({

      error: "Incorrect password."

    });

  }

  req.session.regenerate((err) => {

    if (err) {

      console.error("Session regenerate error:", err);

      return res.status(500).json({

        error: "Session creation failed."

      });

    }

    req.session.isAdmin = true;

    req.session.save((err) => {

      if (err) {

        console.error("Session save error:", err);

        return res.status(500).json({

          error: "Session save failed."

        });

      }

      res.json({

        success: true

      });

    });

  });

});


// ADMIN LOGOUT
app.post("/api/admin/logout", requireAdmin, (req, res) => {

  req.session.destroy((err) => {

    if (err) {

      return res.status(500).json({

        error: "Logout failed."

      });

    }

    res.clearCookie("cultfit.sid", {

      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"

    });

    res.json({

      success: true

    });

  });

});


// GET ENQUIRIES
app.get("/api/admin/enquiries", requireAdmin, (req, res) => {

  res.json(readEnquiries());

});


// DELETE ENQUIRY
app.delete("/api/admin/enquiries/:id", requireAdmin, (req, res) => {

  const updated = readEnquiries().filter(

    item => item.id !== req.params.id

  );

  writeEnquiries(updated);

  res.json({

    success: true

  });

});


// START SERVER
app.listen(PORT, () => {

  console.log(
    `cult.fit website running on port ${PORT}`
  );

  console.log(
    `Admin dashboard: /admin`
  );

});
