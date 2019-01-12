import * as Ampq from 'amqp-ts';

const rabbitmqAuth = {
  username: process.env["rbUsername"],
  password: process.env["rbPassword"]
};

const uri = `amqp://${rabbitmqAuth.username}:${rabbitmqAuth.password}@techkids.vn:5672`;

export default new Ampq.Connection(uri);