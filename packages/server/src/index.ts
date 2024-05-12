import Elysia from 'elysia';
import { MongoClient } from 'mongodb';

// MongoDB URI，通常存放于环境变量中
const uri = "mongodb://0.0.0.0:27017/worldUpast";
const client = new MongoClient(uri);
const server = new Elysia().get("/", () => "test").listen(3000);

export class Db {
  static async connect() {
    const client = await MongoClient.connect(
      uri,
    )
    return client.db('ts-mongodb')
  }
}

process.on('SIGINT', async () => {
  // 断开数据库连接
  await client.close();
  console.log('与MongoDB的连接已断开。');
});

export default server;
