import { store } from '../data/index.js';
import { ApiError } from '../middleware/errorHandler.js';

export const messagesService = {
  async getConversations(userId) {
    if (!userId) throw new ApiError(401, 'Unauthorized');
    const messages = await store.findMessages(userId);
    
    const grouped = {};
    messages.forEach(msg => {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!grouped[partnerId]) {
        grouped[partnerId] = [];
      }
      grouped[partnerId].push(msg);
    });

    const conversations = [];
    for (const partnerId of Object.keys(grouped)) {
      const partner = await store.findUserById(partnerId);
      if (!partner) continue;
      
      const msgs = grouped[partnerId].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const lastMsg = msgs[msgs.length - 1];
      
      const d = new Date(lastMsg.createdAt);
      const nowInDhaka = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka' });
      const msgDateInDhaka = d.toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka' });
      const isToday = nowInDhaka === msgDateInDhaka;
      const timeStr = isToday 
        ? d.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', month: 'short', day: 'numeric' });

      const unreadCount = msgs.filter(m => m.receiverId === userId && !m.read).length;

      conversations.push({
        id: partnerId,
        name: partner.fullName,
        initials: partner.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        lastMessage: lastMsg.text,
        time: timeStr,
        unread: unreadCount,
        messages: msgs.map(m => ({
          text: m.text,
          isMine: m.senderId === userId,
          time: new Date(m.createdAt).toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit' }),
          rawTime: m.createdAt
        }))
      });
    }

    return conversations.sort((a, b) => {
      const aTime = a.messages[a.messages.length - 1]?.rawTime;
      const bTime = b.messages[b.messages.length - 1]?.rawTime;
      return new Date(bTime) - new Date(aTime);
    });
  },

  async sendMessage(senderId, receiverId, text) {
    if (!senderId) throw new ApiError(401, 'Unauthorized');
    if (!receiverId || !text) throw new ApiError(400, 'Missing receiverId or text');
    
    return store.createMessage({
      senderId,
      receiverId,
      text,
      read: false
    });
  },
  
  async markAsRead(userId, partnerId) {
    if (!userId || !partnerId) return;
    await store.markMessagesAsRead(partnerId, userId);
  }
};
