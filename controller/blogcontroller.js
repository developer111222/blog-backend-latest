const Blog = require("../model/blogmodel");

//------create blog-----------
exports.createBlog = async (req, res, next) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    // Check if req.user exists (assuming you have authentication middleware)
    const user = req.user._id; // Access the authenticated user
    console.log(user,req.body,image)

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Create new blog with the authenticated user's ID
        const newBlog = new Blog({
            title,
            description:content,
            image,
            user: user // or user.id depending on your schema
        });
        console.log(newBlog);

        await newBlog.save();
        res.status(201).json({ message: "Blog created successfully" });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Server error while creating blog" });
    }
};

//------get blogs by user id-----------
exports.getBlogs = async (req, res, next) => {
const userid=req.user


    try {
        // Fetch blogs and populate the 'user' field with 'name' and 'email' from the User model
        const blogs = await Blog.find({user:userid}).populate('user', 'name email'); // Replace 'name email' with the fields you want to retrieve

        res.status(200).json({
            success: true,
            blogs
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Server error while fetching blogs" });
    }
};

//------get single blog-----------

exports.getSingleBlog = async (req, res, next) => {
    const blogId = req.params.id

  
    try {

        // Find blog by ID and populate the 'user' field with 'name' and 'email'
        const blog = await Blog.findById(blogId).populate('user', 'name email');

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Server error while fetching blog" });
    }
};


//-------------------------update blog------------------------

exports.updateBlog = async (req, res, next) => {
    const blogId = req.params.id;
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    

    try {
        let blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // // Update blog fields
        blog.title = title;
        blog.description = content;
        if(req.file){

            blog.image = image;
        }

        await blog.save();

        res.status(200).json({ message: "Blog updated successfully" });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Server error while updating blog" });
    }
};


//-------------------------delete blog---------------

exports.deleteBlog = async (req, res) => {
    const id = req.params.id;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        await blog.deleteOne(); // Or you could use blog.remove()
        res.status(200).json({ message: "Blog deleted successfully" });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Server error while deleting blog" });
    }
};


//----------------------------get all blog ---------------------


exports.getalllblogs=async(req, res) => {

try {
const blog = await Blog.find().populate('user', ' email avtar');

    res.status(200).json({success: true,blog })
} catch (error) {
    res.status(500).json({ message: "Server error while updating blog" });
}
}

