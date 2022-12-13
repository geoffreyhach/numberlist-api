const express = require("express");
const app = express();
const cors = require("cors");
const port = 3200;
const mongoose = require("mongoose");
app.use(cors());
app.use(express.json());

//database
mongoose
    .connect("mongodb://localhost/numbers-db")
    .then((res) => console.log("connected to db..."))
    .catch((err) => console.log(err));

const NumberItem = mongoose.model(
    "NumberItem",
    new mongoose.Schema({
        number: Number,
    })
);

// controllers
async function addNumber(data) {
    const number = new NumberItem({
        number: data,
    });
    const result = await number.save();
    console.log(result);
}

//routes
app.get("/api/number", async (req, res) => {
    const numbers = await NumberItem.find().sort("number");
    res.send(numbers);
});

app.post("/api/number", async (req, res) => {
    addNumber(Number(req.body.number));
    res.send("Number added");
});

app.delete("/api/number/:id", async (req, res) => {
    const id = req.params.id;
    console.log(req.params.id);
    NumberItem.findByIdAndDelete(id, function (err) {
        if (err) {
            console.log(err);
            res.send("number not found");
        } else {
            res.send("number deleted");
            console.log("deleted");
        }
    });
});

app.listen(port, () => console.log(`listening on port ${port}`));
