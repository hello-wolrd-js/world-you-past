import mongoose from 'mongoose';
import Room from './models/room'; 
//gpt4.0生成，别完全信


class RoomManager {
  async createRoom(name: string, description?: string, roomId?: string): Promise<mongoose.Document | null> {
    try {
      const newRoom = new Room({
        name,
        roomId,
        description,
        members: [], // 初始时成员为空
      });
      await newRoom.save();
      return newRoom;
    } catch (error) {
      console.error('Error creating the room:', error);
      return null;
    }
  }

  async addMember(roomId: string, userId: mongoose.Types.ObjectId): Promise<void> {
    try {
      const room = await Room.findById(roomId);
      if (room && !room.members.includes(userId)) {
        room.members.push(userId);
        await room.save();
      }
    } catch (error) {
      console.error('Error adding member to the room:', error);
    }
  }

  async removeMember(roomId: string, userId: mongoose.Types.ObjectId): Promise<void> {
    try {
      const room = await Room.findById(roomId);
      if (room) {
        const index = room.members.indexOf(userId);
        if (index > -1) {
          room.members.splice(index, 1);
          await room.save();
        }
      }
    } catch (error) {
      console.error('Error removing member from the room:', error);
    }
  }

}