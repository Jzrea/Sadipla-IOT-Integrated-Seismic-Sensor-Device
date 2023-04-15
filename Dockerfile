
FROM node:19-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=4000 DB_URI=mongodb+srv://sadipla_server:p1liXeiFIVXmcBOP@sadipla.azndex1.mongodb.net/?retryWrites=true&w=majority DB_NAME=Sadipla SOCKETIOHAPP_KEY='@5u&eI#3q8Z1I0cx3DT4&zmr27NKr90&&Ix3K7@VMdvjCuZbpz' SOCKETIOHIOT_KEY='7da%yuUx2c4jDMG73*HP#p1ae!KMuV5c9lykCMuGQPFi&8@&Z' SOCKETIO_KEY='JeHowBSbfOWTW&!C$ukrejhCXiGyTWl1K199LZemMH6X5W*wyp' SERVER_KEY='AAAAqw9go1I:APA91bElyPs9vMUVt1cXIidoaMvwd9NpsWhyFfEdyABMLdn21Yw7XGiAP8BcJ5vNs8m0sCnFCaEu9cIGBpQyEFH_0bWfueL8FlPduHqPDyFjYsHRZNH_Yfg95NalTxc9PF90KzQ-HbwD'

EXPOSE 4000

CMD ["npm","start"]
