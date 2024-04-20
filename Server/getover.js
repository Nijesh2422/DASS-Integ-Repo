const path = require("path");
const multer = require("multer");
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const pdfParse = require("pdf-parse");
const diff = require("diff");
const app = express();
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));

const username = encodeURIComponent("NijeshRaghava");
const password = encodeURIComponent("Nijesh@2422");

let uri = `mongodb+srv://${username}:${password}@itservices.rol1ljq.mongodb.net/?retryWrites=true&w=majority&appName=ITServices`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const newsSchema = new mongoose.Schema({
  items: mongoose.Schema.Types.Mixed,
});
const News = mongoose.model("New", newsSchema);

const eventSchema = new mongoose.Schema({
  items: mongoose.Schema.Types.Mixed,
});
const Events = mongoose.model("Event", eventSchema);

const pageSchema = new mongoose.Schema(
  {
    title: String,
    index: Number,
    status: Boolean,
    mainpage: Boolean,
    subidS: [Number],
    parentid: Number,
  },
  { timestamps: true }
);
const Page = mongoose.model("Page", pageSchema);

const adminsSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    role: String,
    password: String,
  },
  { timestamps: true }
);
const Admin = mongoose.model("Admin", adminsSchema);

const imageSchema = new mongoose.Schema(
  {
    imagepath: String,
    index: Number,
  },
  { timestamps: true }
);
const Image = mongoose.model("Image", imageSchema);

const saveSchema = new mongoose.Schema(
  {
    pageid: Number,
    items: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);
const Save = mongoose.model("Save", saveSchema);

const publishSchema = new mongoose.Schema(
  {
    pageid: Number,
    items: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);
const Publish = mongoose.model("Publish", publishSchema);

const entrySchema = new mongoose.Schema({
  Name: String,
  filename: String,
  path: String,
  Versions: [],
});
const Entry = mongoose.model("Entry", entrySchema);

async function getNextImageIndex() {
  try {
    const files = await fs.promises.readdir("images/");
    return files.length + 1;
  } catch (error) {
    console.error("Error getting next image index:", error);
    throw error;
  }
}

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // public folder images
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    // Get the file extension
    const ext = path.extname(file.originalname).toLowerCase();

    // Get the count of existing files in the destination directory
    fs.readdir("images/", (err, files) => {
      if (err) {
        return cb(err);
      }

      // Calculate the next available index
      const nextIndex = files.length + 1;

      // Construct the filename using the index
      const filename = `image_${nextIndex}${ext}`;

      // Pass the filename to multer
      cb(null, filename);
    });
  },
});

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    var isNewField = false;
    var info;
    if (req.body.Info) {
      info = JSON.parse(req.body.Info);
      if (info.isNewField == "true") {
        isNewField = true;
      }
    }
    console.log(isNewField);
    if (!isNewField) {
      const id = req.params.id;
      Entry.findOne({ _id: id })
        .then((FieldName) => {
          if (FieldName) {
            const uploadPath = `uploads/${FieldName.Name}`;
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
          } else {
            cb(new Error("Field not found"), null);
          }
        })
        .catch((err) => {
          cb(err, null);
        });
    } else {
      const uploadPath = `uploads/${info.Name}`;
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileUpload = multer({ storage: fileStorage });
const imageUpload = multer({ storage: imageStorage });

app.get(`/fields`, async (req, res) => {
  await Entry.find({}, { Name: 1 })
    .then((fields) => {
      res.status(200).json({ fields: fields });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
});

app.post(`/add-and-upload`, fileUpload.single("file"), async (req, res) => {
  try {
    const info = JSON.parse(req.body.Info);
    const found = await Entry.findOne({ Name: info.Name });
    if (!found) {
      const newEntryData = {
        Name: info.Name,
        Versions: [],
      };
      if (req.file) {
        newEntryData.filename = req.file.originalname;
        newEntryData.path = req.file.path;
      }
      const newEntry = new Entry(newEntryData);
      await newEntry.save();
      res.status(200).json({ id: newEntry._id });
    } else {
      res.status(200).json({ error: "Field already exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

app.post(`/delete-field`, async (req, res) => {
  try {
    const found = await Entry.findOne({ _id: req.body.index });
    if (found) {
      const folderName = found.Name;
      const folderPath = path.join(__dirname, "uploads", folderName);
      fs.rmdirSync(folderPath, { recursive: true });
      await found.deleteOne();
      res
        .status(200)
        .json({ message: "Field and associated files deleted successfully" });
    } else {
      res.status(404).json({ error: "Field not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Route for uploading PDF files
app.post(`/upload/:id`, fileUpload.single("file"), async (req, res) => {
  const id = req.params.id;
  try {
    const found = await Entry.findOne({ _id: id });
    if (found) {
      if (found.filename && found.path) {
        const prevData = await pdfParse(found.path);
        const prevText = prevData.text;
        const currData = await pdfParse(req.file.path);
        const currText = currData.text;
        console.log(currText);
        const differences = diff.diffChars(prevText, currText);
        const constructDifferences = diff.diffChars(currText, prevText);
        console.log(differences, constructDifferences);
        var cumulativeIndex = 0;
        var constructCumulativeIndex = 0;
        const DiffArray = [];
        for (let index = 0; index < differences.length; index++) {
          const differ = {};
          if (differences[index].added || differences[index].removed) {
            differ.added = differences[index].added;
            differ.removed = differences[index].removed;
            differ.value = differences[index].value;
            differ.startindex = cumulativeIndex;
            differ.constructindex = constructCumulativeIndex;
            DiffArray.push(differ);
          }
          if (!differences[index].removed) {
            cumulativeIndex += differences[index].count;
          }
          if (!constructDifferences[index].added) {
            constructCumulativeIndex += constructDifferences[index].count;
          }
        }
        // console.log(DiffArray);
        found.Versions.push({
          version: found.Versions.length + 1,
          diffArray: DiffArray,
        });
        fs.unlinkSync(found.path);
        found.filename = req.file.originalname;
        found.path = req.file.path;
        await found.save();
        res.status(200).json({ message: "File Uploaded Successfully" });
      } else {
        found.filename = req.file.originalname;
        found.path = req.file.path;
        await found.save();
        res.status(200).json({ id: found._id });
      }
    } else {
      res.status(404).json({ error: "Invalid Field" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/pdf/:id", async (req, res) => {
  const id = req.params.id;
  console.log("HI");
  const found = await Entry.findOne({ _id: id });
  if (found && found.path) {
    res.setHeader("Content-Type", "application/pdf");
    const filePath = path.join(__dirname, found.path);
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

app.get("/version-initial-load/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const found = await Entry.findOne({ _id: id });
    if (found) {
      if (found.filename && found.path) {
        const currData = await pdfParse(found.path);
        if (found.Versions.length > 0) {
          res.status(200).json({
            currentText: currData.text,
            noOfVersion: found.Versions.length,
            finalDiffArray: found.Versions[found.Versions.length - 1].diffArray,
          });
        }
      } else {
        res.status(404).json({ error: "File not yet uploaded" });
      }
    } else {
      res.status(404).json({ error: "Invalid field entered" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get-diff/:version/:destination/:id", async (req, res) => {
  try {
    const version = req.params.version;
    const destination = req.params.destination;
    const fieldId = req.params.id;
    const found = await Entry.findOne({ _id: fieldId });
    if (found) {
      const DiffArrays = [];
      if (version < destination) {
        for (let i = version; i <= destination - 1; i++) {
          if (i == version) {
            console.log(found.Versions[i].diffArray);
          }
          DiffArrays.push(found.Versions[i].diffArray);
        }
      } else {
        for (let i = version - 2; i >= destination - 1; i--) {
          DiffArrays.push(found.Versions[i].diffArray);
        }
      }
      console.log(DiffArrays);
      res.status(200).json({ diffArrays: DiffArrays });
    } else {
      res.status(404).json({ error: "Field not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post(
  "/api/upload-image",
  imageUpload.single("image_name_in_form"),
  async (req, res) => {
    try {
      console.log(req.body);
      const imagePath = req.file.path;
      const newImageIndex = await getNextImageIndex();
      const newImage = new Image({
        imagepath: imagePath,
        index: newImageIndex - 1,
      });
      await newImage.save();
      res.status(200).json({ imagepath: newImage.imagepath });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

app.get("/api/display-publish/:index", async (req, res) => {
  try {
    const index = req.params.index;
    const pageIndex = parseInt(index, 10); // Convert to integer if necessary
    console.log(index);
    const page = await Publish.findOne({ pageid: index }, { items: 1, _id: 0 });
    if (!page) {
      return res
        .status(404)
        .json({ error: "No page content found for the given index" });
    }
    console.log(page);
    res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching Page:", error);
    res.status(500).json({ error: "Failed to fetch Page" });
  }
});

app.get("/api/display-save/:index", async (req, res) => {
  try {
    const index = req.params.index;
    const pageIndex = parseInt(index, 10); // Convert to integer if necessary
    console.log(index);
    const page = await Save.findOne({ pageid: index }, { items: 1, _id: 0 });
    if (!page) {
      return res
        .status(404)
        .json({ error: "No page content found for the given index" });
    }
    console.log(page);
    res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching Page:", error);
    res.status(500).json({ error: "Failed to fetch Page" });
  }
});

app.post("/api/publish", async (req, res) => {
  console.log(req.body.index.index);
  try {
    const found = await Publish.findOne({ pageid: req.body.index.index });
    if (found) {
      console.log("Hi");
      await found
        .updateOne({ items: req.body.newItems })
        .then((updatedInstance) => {
          console.log("Data updated successfully: ", updatedInstance);
        })
        .catch((err) => {
          console.log("Failed Updating Data: ", err);
        });
      const savefound = await Save.findOne({ pageid: req.body.index.index });
      if (savefound) {
        console.log("Hi");
        await savefound
          .updateOne({ items: req.body.newItems })
          .then((updatedInstance) => {
            console.log("Data updated successfully: ", updatedInstance);
          })
          .catch((err) => {
            console.log("Failed Updating Data: ", err);
          });
        res.send(200);
      } else {
        console.log(req.body);
        const NewSave = new Save({
          pageid: req.body.index.index,
          items: req.body.newItems,
        });
        await NewSave.save()
          .then((savedInstance) => {
            console.log("Data saved successfully: ", savedInstance);
          })
          .catch((err) => {
            console.log("Error saving the Data: ", err);
          });
        res.send(200);
      }
    } else {
      console.log(req.body);
      const NewPublish = new Publish({
        pageid: req.body.index.index,
        items: req.body.newItems,
      });
      await NewPublish.save()
        .then((savedInstance) => {
          console.log("Data published successfully: ", savedInstance);
        })
        .catch((err) => {
          console.log("Error publishing the Data: ", err);
        });
      const savefound = await Save.findOne({ pageid: req.body.index.index });
      if (savefound) {
        console.log("Hi");
        await savefound
          .updateOne({ items: req.body.newItems })
          .then((updatedInstance) => {
            console.log("Data updated successfully: ", updatedInstance);
          })
          .catch((err) => {
            console.log("Failed Updating Data: ", err);
          });
        res.send(200);
      } else {
        console.log(req.body);
        const NewSave = new Save({
          pageid: req.body.index.index,
          items: req.body.newItems,
        });
        await NewSave.save()
          .then((savedInstance) => {
            console.log("Data saved successfully: ", savedInstance);
          })
          .catch((err) => {
            console.log("Error saving the Data: ", err);
          });
        res.end(200);
      }
    }
  } catch (error) {
    console.log("Error publishing the Data: ", error);
    res.send(500);
  }
});

app.post("/api/save-edit", async (req, res) => {
  console.log(req.body.index.index);
  try {
    const found = await Save.findOne({ pageid: req.body.index.index });
    if (found) {
      console.log("Hi");
      await found
        .updateOne({ items: req.body.newItems })
        .then((updatedInstance) => {
          console.log("Data updated successfully: ", updatedInstance);
        })
        .catch((err) => {
          console.log("Failed Updating Data: ", err);
        });
      res.send(200);
    } else {
      console.log(req.body);
      const NewSave = new Save({
        pageid: req.body.index.index,
        items: req.body.newItems,
      });
      await NewSave.save()
        .then((savedInstance) => {
          console.log("Data saved successfully: ", savedInstance);
        })
        .catch((err) => {
          console.log("Error saving the Data: ", err);
        });
      res.sendStatus(200);
    }
  } catch (error) {
    console.log("Error saving the Data: ", error);
    res.sendStatus(500);
  }
});

app.get("/api/main-pages", async (req, res) => {
  try {
    const MainPages = Page.find(
      { mainpage: true },
      { _id: 0, title: 1, status: 1, index: 1, subidS: 1 }
    )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(404);
        res.end();
      });
  } catch (error) {
    console.log(error);
    res.status(404);
    res.end();
  }
});

app.get("/api/pages/:index", async (req, res) => {
  try {
    const index = req.params.index; // Access the index parameter from the route
    const pageIndex = parseInt(index, 10); // Convert to integer if necessary
    // Assuming `index` is stored as a number; adjust the query accordingly
    const page = await Page.findOne({ index: pageIndex });
    if (!page) {
      return res
        .status(404)
        .json({ error: "No page content found for the given index" });
    }
    const subpages = await Page.find(
      { index: { $in: page.subidS } },
      { _id: 0, title: 1, status: 1, index: 1, subidS: 1 }
    );
    // Respond with the found page
    console.log(subpages);
    res.status(200).json(subpages);
  } catch (error) {
    console.error("Error fetching Page:", error);
    res.status(500).json({ error: "Failed to fetch Page" });
  }
});

app.get("/api/admins", async (req, res) => {
  console.log("hi");
  try {
    const Admins = Admin.find()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(404);
        res.end();
      });
  } catch (error) {
    console.log(error);
    res.status(404);
    res.end();
  }
});

app.post("/api/add-admin", async (req, res) => {
  console.log(req.body);
  const found = await Admin.findOne({
    name: req.body.name,
    email: req.body.email,
  });
  if (!found) {
    const newAdmin = new Admin({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
    });
    newAdmin
      .save()
      .then(() => {
        console.log("Admin Added to the database");
      })
      .catch((error) => {
        console.log(error);
      });
    res.status(200);
  } else {
    if (found.role == req.body.role) {
      res.status(200).json({ error: "Admin with same username exists" });
    } else {
      found.role = req.body.role;
      found.save();
      res.status(200);
    }
  }
});

app.post("/api/add-new", async (req, res) => {
  if (req.body.index == 0) {
    const found = await Page.findOne({ title: req.body.title });
    if (!found) {
      const RecentOne = await Page.findOne().sort({ createdAt: -1 });
      const newPage = new Page({
        title: req.body.title,
        index: RecentOne.index + 1,
        status: true,
        mainpage: req.body.mainpage,
        subidS: [],
      });
      newPage
        .save()
        .then(() => {
          console.log("Added page to the database");
        })
        .catch((err) => {
          console.log(err);
        });
      res
        .status(200)
        .json({ newindex: newPage.index, newtitle: newPage.title });
    } else {
      res.status(200).json({ newindex: -1 });
    }
  } else {
    console.log(req.body.title);
    const parentPage = await Page.findOne({ index: req.body.index });
    console.log(parentPage);
    if (parentPage) {
      const children = await Page.find({
        index: { $in: parentPage.subidS },
        title: req.body.title,
      });
      if (children.length == 0) {
        console.log(children);
        const RecentOne = await Page.findOne().sort({ createdAt: -1 });
        const newPage = new Page({
          title: req.body.title,
          index: RecentOne.index + 1,
          status: true,
          mainpage: req.body.mainpage,
          parentid: req.body.index,
          subidS: [],
        });
        newPage
          .save()
          .then(async () => {
            console.log("Added page to the database");
            console.log(newPage.index);
            await parentPage.updateOne({ $push: { subidS: newPage.index } });
          })
          .catch((err) => {
            console.log(err);
          });
        res
          .status(200)
          .json({ newindex: newPage.index, newtitle: newPage.title });
      } else {
        res.status(200).json({ newindex: -1 });
      }
    } else {
      console.log("Parent Page Not Found");
      res.status(404).json({ error: "Invalid Request" });
    }
  }
});

app.post("/api/upgrade", async (req, res) => {
  try {
    const found = await Admin.findOneAndUpdate(
      { _id: req.body.id },
      { role: "Super Admin" }
    );
    if (found) {
      res.status(200);
    } else {
      res.status(200).json({ error: "Admin Not Found" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/remove", async (req, res) => {
  try {
    const found = await Admin.findOneAndDelete({ _id: req.body.id });
    if (found) {
      res.status(200);
    } else {
      res.status(200).json({ error: "Admin Not Found" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/delete", async (req, res) => {
  try {
    const found = await Page.findOne({ index: req.body.index });
    if (!found) {
      return res.status(404).json({ error: "Page not found" });
    }
    console.log(found.subidS);
    for (const subid of found.subidS) {
      await Page.findOneAndDelete({ index: subid });
      await Save.findOneAndDelete({ pageid: subid });
      await Publish.findOneAndDelete({ pageid: subid });
    }
    const value = await Page.findOneAndDelete({ index: req.body.index });
    await Save.findOneAndDelete({ pageid: req.body.index });
    await Publish.findOneAndDelete({ pageid: req.body.index });
    if (found.parentid) {
      const parentPage = await Page.findOne({ index: found.parentid });
      if (parentPage) {
        parentPage.subidS = parentPage.subidS.filter(
          (id) => id !== req.body.index
        );
        await parentPage.save();
      }
    }
    console.log(value);
    res.status(200).json({ success: "Page Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting Page:", error);
    res.status(500).json({ error: "Failed to Delete Page" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const foundemail = await Admin.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (foundemail) {
      if (foundemail.role == "Admin") {
        res.status(200).json({ role: "Admin" });
      } else {
        res.status(200).json({ role: "Super Admin" });
      }
    } else {
      const foundname = await Admin.findOne({
        name: req.body.email,
        password: req.body.password,
      });
      if (foundname) {
        if (foundname.role == "Admin") {
          res.status(200).json({ role: "Admin" });
        } else {
          res.status(200).json({ role: "Super Admin" });
        }
      } else {
        res.status(200).json({ role: "Not Found" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

app.post("/api/publish-news", async (req, res) => {
  try {
    const found = await News.findOne({});
    console.log(found);
    if (found) {
      found.items = req.body.items;
      await found.save();
      res.status(200).json({ message: "Publishing Successful" });
    } else {
      const newNews = new News({
        items: req.body.items,
      });
      newNews.save();
      res.status(200).json({ message: "Publishing Successful" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/publish-events", async (req, res) => {
  try {
    const found = await Events.findOne({});
    console.log(found);
    if (found) {
      found.items = req.body.items;
      await found.save();
      res.status(200).json({ message: "Publishing Successful" });
    } else {
      const newEvent = new Events({
        items: req.body.items,
      });
      newEvent.save();
      res.status(200).json({ message: "Publishing Successful" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const found = await News.findOne({});
    if (found) {
      return res.status(200).json(found.items); // Use return to exit the function
    }
    return res.status(404).json({ error: "No News Found" }); // Use return to exit the function
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" }); // Use return to exit the function
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const found = await Events.findOne({});
    if (found) {
      return res.status(200).json(found.items); // Use return to exit the function
    }
    return res.status(404).json({ error: "No Events Found" }); // Use return to exit the function
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" }); // Use return to exit the function
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
