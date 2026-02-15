const express = require("express");
const router = express.Router();
const List = require("../models/List");
const auth = require("../middleware/auth");


// Create list
router.post("/", auth, async (req, res) => {
  try {
    const { title, boardId } = req.body;

    const list = new List({
      title,
      board: boardId,
    });

    await list.save();

    res.json(list);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get lists by board
router.get("/:boardId", auth, async (req, res) => {
  try {
    const lists = await List.find({
      board: req.params.boardId,
    }).sort({ order: 1 });

    res.json(lists);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
