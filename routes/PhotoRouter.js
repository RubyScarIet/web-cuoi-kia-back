const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

/**
 * GET /photosOfUser/:id
 * Trả về tất cả ảnh của user có _id tương ứng, kèm theo comments đầy đủ.
 * Mỗi ảnh có: _id, user_id, comments, file_name, date_time
 * Mỗi comment có: comment, date_time, _id, user { _id, first_name, last_name }
 *
 * Quan trọng: Cần tạo plain JS object thay vì dùng trực tiếp Mongoose model
 * vì Mongoose sẽ bỏ qua các trường không nằm trong schema khi modify trực tiếp.
 */
router.get("/photosOfUser/:id", async (request, response) => {
  const { id } = request.params;

  // Kiểm tra id có phải là ObjectId hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      error: `Invalid user id: '${id}' is not a valid ObjectId.`,
    });
  }

  try {
    // Kiểm tra user có tồn tại không
    const userExists = await User.findById(id, "_id");
    if (!userExists) {
      return response.status(400).json({
        error: `User with id '${id}' not found.`,
      });
    }

    // Lấy tất cả ảnh của user
    const photos = await Photo.find({ user_id: id });

    // Xử lý từng ảnh: populate user info cho mỗi comment
    // Dùng Promise.all để xử lý bất đồng bộ đồng thời (concurrently) cho từng ảnh
    const photosResult = await Promise.all(
      photos.map(async (photo) => {
        // Xử lý từng comment: fetch user info cho mỗi comment đồng thời
        const commentsResult = await Promise.all(
          photo.comments.map(async (comment) => {
            // Lấy thông tin tối thiểu của user đã bình luận
            const commentUser = await User.findById(
              comment.user_id,
              "_id first_name last_name"
            );

            // Tạo plain object cho comment (tránh Mongoose schema filtering)
            return {
              _id: comment._id,
              comment: comment.comment,
              date_time: comment.date_time,
              user: commentUser
                ? {
                    _id: commentUser._id,
                    first_name: commentUser.first_name,
                    last_name: commentUser.last_name,
                  }
                : null,
            };
          })
        );

        // Tạo plain object cho ảnh (tránh Mongoose schema filtering)
        return {
          _id: photo._id,
          user_id: photo.user_id,
          file_name: photo.file_name,
          date_time: photo.date_time,
          comments: commentsResult,
        };
      })
    );

    response.status(200).json(photosResult);
  } catch (error) {
    console.error("Error fetching photos of user:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../../Front/public/images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post("/commentsOfPhoto/:photo_id", async (req, res) => {
  const { photo_id } = req.params;
  const { comment } = req.body;
  if (!comment || comment.trim() === "") {
    return res.status(400).json({ error: "Comment cannot be empty" });
  }
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const photo = await Photo.findById(photo_id);
    if (!photo) {
      return res.status(400).json({ error: "Photo not found" });
    }
    const newComment = {
      comment: comment,
      date_time: new Date(),
      user_id: req.session.userId
    };
    photo.comments.push(newComment);
    await photo.save();
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/photos/new", upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const newPhoto = new Photo({
      file_name: req.file.filename,
      date_time: new Date(),
      user_id: req.session.userId,
      comments: []
    });
    await newPhoto.save();
    res.status(200).json(newPhoto);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
