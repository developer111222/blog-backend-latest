const express = require('express');  
const bodyParser = require('body-parser');  
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');  
const dotenv = require('dotenv');  
const cookieParser = require('cookie-parser');
const userroute = require('./routes/userRoutes'); 
const blogRoutes = require('./routes/blogroute');  
const chatroute = require('./routes/chatroute');
const friendrequestroute=require('./routes/friendrequestroute');
const cors = require('cors');
const Chat=require('./model/chatschema')

dotenv.config();  

// Connect to MongoDB  
mongoose.connect(process.env.MONGODB_URI, {  
    useNewUrlParser: true,  
    useUnifiedTopology: true,  
})  
.then(() => console.log('MongoDB connected'))  
.catch(error => console.log('MongoDB connection error:', error));  

const app = express();  
const server = http.createServer(app);
const port = process.env.PORT || 3000;
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',  // Your frontend URL
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookies",
  ],
  credentials: true, // Allow credentials
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));  
app.use('/Upload', express.static('Upload'));  // Static file serving for uploads

// Use user and blog routes  
app.use('/api', userroute); 
app.use('/api', blogRoutes);  
app.use('/api', chatroute);  
app.use('/api', friendrequestroute);  

// Initialize Socket.IO with CORS options
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000', // Your frontend URL
        methods: ["GET", "POST"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cookies",
        ],
        credentials: true,
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('send_message', async (data) => {
        try {
            const chat = await Chat.findById(data.chatId);
            if (chat) {
                const newMessage = { sender: data.sender, message: data.message, timestamp: new Date() };
                chat.messages.push(newMessage);
                await chat.save();  // Save the updated chat

                // Emit the message back to all clients in the same chat
                io.emit('receive_message', { chatId: data.chatId, sender: data.sender, message: data.message });
            } else {
                console.error('Chat not found');
            }
        } catch (error) {
            console.error('Error in sending message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


// Starting the server  
server.listen(port, () => {  
    console.log(`Server is running on http://localhost:${port}`);  
});
