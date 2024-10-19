const express = require("express");
const router=express.Router();
const {createBlog,getBlogs,getSingleBlog,updateBlog,getalllblogs,deleteBlog}=require("../controller/blogcontroller");
const {authorizationUser }=require("../middleware/auth");
const upload=require("../middleware/multer")

router.route('/create-blog').post(authorizationUser,upload.single('image'),createBlog);
router.route('/get-blog').get(authorizationUser,getBlogs)
router.route('/get-single-blog/:id').get(getSingleBlog);
router.route('/update-blog/:id').patch(authorizationUser,upload.single('image'),updateBlog)
router.route('/delete-blog/:id').delete(authorizationUser,deleteBlog)

router.route('/get-all-blogs').get(getalllblogs)



module.exports = router