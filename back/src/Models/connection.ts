//aqui está sendo feita a conexão entre o mongoose e o mongo
import { connect} from "mongoose";
import { Model, model, models } from "mongoose";
import { messageSchema } from "../schema";
import { IChatMessageProps } from '../Interfaces/type';
import 'dotenv/config';

const MONGO_DB_URL = "mongodb://root:example@localhost:27017/"

const connectToDatabase = async (mongoDatabaseURI = process.env.MONGO_DB_URL || MONGO_DB_URL) => {
  const con = await connect(mongoDatabaseURI);
  const listColle = await con.connection.db.listCollections().toArray()
  const exist = listColle.some((item) => item.name === 'messages');
  if (!exist) {
    const ms: Model<IChatMessageProps> = models.Message || model('Message', messageSchema);
    ms.create({ fromMe: true, senderName: "Ediguinhos", text: "Olá!", createdAt: new Date() })
  };
  return con;
};

export default connectToDatabase;
