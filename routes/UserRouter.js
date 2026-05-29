const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");
const router = express.Router();

/**
 * GET /user/list
 * Trả về danh sách user với các trường cần thiết cho navigation sidebar:
 * _id, first_name, last_name
 */
router.get("/list", async (request, response) => {
  try {
    // Dùng .select() để chỉ lấy các trường cần thiết (projection)
    const users = await User.find({}, "_id first_name last_name");
    response.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user list:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /user/:id
 * Trả về thông tin chi tiết của user với _id tương ứng:
 * _id, first_name, last_name, location, description, occupation
 */
router.get("/:id", async (request, response) => {
  const { id } = request.params;

  // Kiểm tra id có phải là ObjectId hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response
      .status(400)
      .json({ error: `Invalid user id: '${id}' is not a valid ObjectId.` });
  }

  try {
    const user = await User.findById(
      id,
      "_id first_name last_name location description occupation"
    );

    if (!user) {
      return response
        .status(400)
        .json({ error: `User with id '${id}' not found.` });
    }

    response.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by id:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;