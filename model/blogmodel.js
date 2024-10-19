const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogschema = new Schema({
  seo_title:{
    type:String,

  },
seo_description:{
  type:String,
 
},
seo_keywords:{
  type:[String],
 
},
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image:{
    type: String,
    required: true,
    default: "https://via.placeholder.com/150" // Placeholder image URL for now. Replace with actual image URL when implemented.  // If you want to store actual images, you can use Multer middleware to handle file uploads.  // Also, consider adding validation to ensure the uploaded file is an image.  // You can use a library like Sharp for image processing.  // You can also add a feature to resize the uploaded images to a smaller size.  // Also, consider implementing image optimization techniques to reduce the file size.  // For example, you can use Sharp's toFile method to save the resized image to a temporary file and then upload the file to your server.  // Also, consider implementing a feature to generate a thumbnail image for each blog post.  // You can use Sharp's toFile method to save a thumbnail image to a temporary file and then upload the file to your server
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogschema);
