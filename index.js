const express = require('express');  
const bodyParser = require('body-parser');  
const mongoose = require('mongoose');  
const dotenv = require('dotenv');  
const cookieParser = require('cookie-parser');
const userroute=require('./routes/userRoutes') 
const blogRoutes = require('./routes/blogroute');  
const cors = require('cors');

dotenv.config();  

// Connect to MongoDB  
mongoose.connect(process.env.MONGODB_URI, {  
    useNewUrlParser: true,  
    useUnifiedTopology: true,  
})  
.then(() => console.log('MongoDB connected'))  
.catch(error => console.log('MongoDB connection error:', error));  

const app = express();  
const port = process.env.PORT || 3000;
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: 'https://new-sooty-xi.vercel.app/',  // The URL of your frontend
  
     methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
     Headers: true,
    
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"], // Allow only specified HTTP methods
      allowedHeaders: [
        "Access-Control-Allow-Origin",
        "Content-Type",
        "Authorization",
        "cookies",
      ],
      credentials: true, // Allow sending cookies and other credentials
      optionsSuccessStatus: 200,
      preflightContinue: false,
  
  };

app.use(cors(corsOptions));  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));  
app.use('/Upload', express.static('Upload'));  // Static file serving for uploads

// Use user and blog routes  
app.use('/api', userroute); 
app.use('/api', blogRoutes);  

// Starting the server  
app.listen(port, () => {  
    console.log(`Server is running on http://localhost:${port}`);  
});
