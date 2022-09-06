const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

// Helper method for generating unique ids
const uuid = require("./Develop/helpers/uuid");

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./Develop/public/index.html"))
);

// GET Route for notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./Develop/public/notes.html"))
);

// GET Route for wild card homepage
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "./Develop/public/index.html"))
);

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// GET Route for retreiving all saved notes
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile("./Develop/db/db.json").then((data) =>
    res.json(JSON.parse(data))
  );
});

// POST Route for posting new notes
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  if (req.body) {
    const newNote = {
      tip_id: uuid(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`Note added successfully 🚀`);
  } else {
    res.error("Error in adding note");
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
