const express = require("express");
const path = require("path");
const connectDB = require("./db");
const seedDatabase = require("./seed");

const adminRoutes = require("./Routes/adminRoutes");
const pageRoutes = require("./Routes/pageRoutes");
const productRoutes = require("./Routes/productRoutes");

const app = express();

// 1. Connect to MongoDB and ensure seeded data
connectDB().then(() => {
  seedDatabase();
});

// 2. View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 3. Body Parsing Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4. Public Static Folder Setup
app.use(express.static(path.join(__dirname, "public")));

// 5. Global Variables for Templates (e.g. current path, cart helper)
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// 6. Routes
app.use("/admin", adminRoutes);
app.use("/", productRoutes); // API endpoints like /api/gallery/cakes, /api/products/search, /api/orders
app.use("/", pageRoutes);    // Public pages: /, /menu, /about, /gallery, /cart, /product/:id

// 7. 404 Handler
app.use((req, res) => {
  res.status(404).render("pages/index", {
    pageTitle: "404 - Page Not Found",
    featuredCakes: [],
    bestSellers: [],
    reviews: []
  });
});

// 8. Server Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎂 CakeMaker Bakery running at http://localhost:${PORT}`);
});
