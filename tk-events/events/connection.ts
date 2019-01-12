import * as Ampq from 'amqp-ts';

let uri: string;
let connection: Ampq.Connection;

export function connect(username, password, host, port) {
  uri = `amqp://${username}:${password}@${host}:${port}`;
  connection = new Ampq.Connection(uri);
}

export default connection;