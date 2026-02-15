
const express = require("express");
const router = express.Router();
const Board = require("../models/Board");
const auth = require("../middleware/auth");


// Create Board
router.post("/", auth, async (req, res) => {
  try {
    const board = new Board({
      title: req.body.title,
      owner: req.user.id,
      members: [req.user.id],
    });

    await board.save();
    res.json(board);

  } catch (err) {
    res.status(500).send("Server error");
  }
});


// Get Boards
router.get("/", auth, async (req, res) => {
  try {
    const boards = await Board.find({
      members: req.user.id,
    });

    res.json(boards);

  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;

