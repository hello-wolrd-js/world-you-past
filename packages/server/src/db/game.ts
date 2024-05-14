import mongoose from 'mongoose';
import {GameRecord} from "@world-you-past/models";
import Elysia from 'elysia';

// 定义 Path 类型
type Path = {
  latitude: number;
  longitude: number;
};

// 定义 User 类型 - 假设有更多的字段，根据实际情况定义
interface User {
  id: string;
}

// Path Schema
const pathSchema = new mongoose.Schema<Path>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});

// GameRecord Schema
const gameRecordSchema = new mongoose.Schema<GameRecord>({
  id: { type: String, required: true },
  paths: {
    type: Map,
    of: [pathSchema]
  },
  totalTime: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  support: { type: Number, default: 0 }
});

const GameRecord = mongoose.model<GameRecord>('GameRecord', gameRecordSchema);

const saveGameRecord = async ({ id, paths, totalTime, startTime, endTime, support }: GameRecord): Promise<void> => {
  const gameRecord = new GameRecord({
    id: id,
    paths: paths,
    totalTime,
    startTime,
    endTime,
    support
  });

  try {
    await gameRecord.save();
    console.log('Game record saved successfully.');
  } catch (error) {
    console.error('Error saving game record:', error);
  }
};
interface Context {
    data: {
      query: {
        id: string;
        paths: any; // 根据实际情况调整类型
        totalTime: number;
        startTime: string;
        endTime: string;
        support: boolean;
      };
    };
    response: {
        send: (arg0: { status: string; message: string; }) => void;
      };
  }
export const saveService =new Elysia().post("/saveGameRecord",{
    async open(post:Context) {
    try{
            const { id, paths, totalTime, startTime, endTime, support } = post.data.query;
            const gameRecord = new GameRecord({
                id,
                paths,
                totalTime,
                startTime,
                endTime,
                support,
            });
            await saveGameRecord(gameRecord);

            post.response.send({
                status: 'success',
                message: 'Game record saved successfully.',
            });
        }catch (error){
            post.response.send({
                status: 'error',
                message: `Failed to save game record`,
              });
        }
    }
})