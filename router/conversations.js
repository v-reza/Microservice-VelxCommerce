const router = require("express").Router();
const Conversation = require("../models/Conversation");

/**
 * New Conversation
 */
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    if (!req.body.senderId || !req.body.receiverId) {
      return res.status(404).json("request error");
    }

    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

/**
 * Get Conversation of user
 */
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: {
        $in: [req.params.userId],
      },
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

/**
 * get conversation includes to userId
 */
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $in: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
