const express = require("express");
const app = express();
const methodOverride = require('method-override')

const connectDB = require("./config/db");

const blogAPI = require("./controllers/evenAPIController");
const blogSSR = require("./controllers/eventSSRController");

//Important: will be discussed next week
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//https://expressjs.com/en/resources/middleware/method-override.html
app.use(methodOverride('_method'))

// Set views directory for EJS templates
app.set("views", "views");
// Set EJS as the view engine
app.set("view engine", "ejs");
// Serve static files from the "public" directory
app.use(express.static("public"));

// Connect to MongoDB
connectDB();

const logger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  // console.log("Hello V2!");
  next();
};
app.use(logger) 
 
// SSR
// End1: Route to render index.html with events using EJS
app.get("/", blogSSR.renderEvents);
// End2: Define a route to render the addevent.ejs view
app.get("/addevent", blogSSR.renderForm);
// End3:Route to add  event using EJ
app.post("/addevent", blogSSR.addEvent);
// Define a route to render the singleevent.ejs view
app.get("/single-event/:id", blogSSR.renderEvent);
// Define a route to delete singleevent
app.delete("/single-event/:id", blogSSR.deleteEvent);
// Define a route to update single event.ejs
app.put("/single-event/:id", blogSSR.updateEvent);
// Define event to update
app.get("/single-event/update/:id", blogSSR.renderUpdateEvent);


// API
// GET all Events
app.get("/api/events", blogAPI.getEvents);
// POST a new Event
app.post("/api/events", blogAPI.addEvent);
// GET a single Event
app.get("/api/events/:id", blogAPI.getEvent);

// Update Event using PUT
app.put("/api/events/:id", blogAPI.updateEvent);
// DELETE a Event
app.delete("/api/events/:id", blogAPI.deleteEvent);
// DELETE all Event
app.delete("/api/events", blogAPI.deleteAllEvents);

const PORT = 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});