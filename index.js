require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Projects = require("./models/Projects.js");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//Routes go here
app.get("/", (req, res) => {
  res.send({ title: "Project" });
});

app.get("/projects", async (req, res) => {
  const projects = await Projects.find();
  if (projects) {
    res.json(projects);
  } else {
    res.send("Something went wrong.");
  }
});

app.get("/projects:id", async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id);
    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});
