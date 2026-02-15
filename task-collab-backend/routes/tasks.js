const express = require("express");

const router = express.Router();

const Task = require("../models/Task");

const auth = require("../middleware/auth");


// Search tasks
router.get("/search", auth, async (req, res) => {
  try {

    const query = req.query.q;

    const tasks = await Task.find({
      title: { $regex: query, $options: "i" }
    });

    res.json(tasks);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});

// Create task
router.post("/", auth, async (req, res) => {
  try {

    const { title, description, listId, boardId } = req.body;

    const task = new Task({
      title,
      description,
      list: listId,
      board: boardId
    });

    await task.save();

    res.json(task);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }
});




// Get tasks by list
router.get("/list/:listId", auth, async (req, res) => {

  try {

    const tasks = await Task.find({
      list: req.params.listId
    }).sort({ order: 1 });

    res.json(tasks);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});


// Move task
router.put("/:taskId/move", auth, async (req, res) => {

  try {

    const { listId, order } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        list: listId,
        order: order
      },
      { new: true }
    );

    res.json(task);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});

// Update task
router.put("/:taskId", auth, async (req, res) => {
  try {

    const { title, description } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { title, description },
      { new: true }
    );

    res.json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
router.delete("/:taskId", auth, async (req, res) => {
  try {

    await Task.findByIdAndDelete(req.params.taskId);

    res.json({
      message: "Task deleted successfully"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});





module.exports = router;
