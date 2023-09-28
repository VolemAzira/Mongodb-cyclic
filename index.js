require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Projects = require("./models/Projects.js");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Middleware untuk mengizinkan JSON parsing
app.use(express.json());

// Routes go here
app.get("/", (req, res) => {
  res.send({ title: "Project" });
});

app.get("/projects", async (req, res) => {
  try {
    const projects = await Projects.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/projects/:id", async (req, res) => {
  try {
    const project = await Projects.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/projects", async (req, res) => {
  try {
    const newProject = await Projects.create(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/projects/:id", async (req, res) => {
  try {
    const deletedProject = await Projects.findByIdAndDelete(req.params.id);
    res.json(deletedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/projects/:id", async (req, res) => {
  try {
    const updatedProject = await Projects.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Listening for requests on port", PORT);
  });
});
