const Chat=require('../model/chatschema');

exports.chatcontroller= async(req,res)=>{
   console.log(req.body);
   try {
    const newChat = new Chat({ participants: req.body.participants, messages: [] });
    await newChat.save();
    return res.json(newChat);
   } catch (error) {
    res.status(500).json({ message: ' server error' });
   }
}


exports.getChats = async (req, res) => {
   try {
       const chats = await Chat.find({ participants: req.user._id }).populate('participants', 'name');
       res.status(200).json(chats);
   } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Server error' });
   }
};