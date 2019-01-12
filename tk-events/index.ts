import * as Ampq from 'amqp-ts';

let connection: Ampq.Connection;
type upsertFunc = (data: any) => Promise<any>;
type deleteFunc = (_id: string) => Promise<any>;

export function connect(username: string, password: string, host: string, port: string) {
  const uri = `amqp://${username}:${password}@${host}:${port}`;
  connection = new Ampq.Connection(uri);
}

export class RbProducer {
  exchange: Ampq.Exchange;

  public constructor(resourceName: string) {
    // Create exchange if not exist.
    this.exchange = connection.declareExchange(resourceName);
    this.send = this.send.bind(this);
  }

  // Send message function for producer
  send(type: string, data: any): void {
    this.exchange.send(new Ampq.Message({ type, data }));
  }
}

export class RbConsumer {
  exchange: Ampq.Exchange;
  queue: Ampq.Queue;
  upsertCallback: upsertFunc;
  deleteCallback: deleteFunc;

  constructor(consumerName: string, resourceName: string, upsertCallback: upsertFunc, deleteCallback: deleteFunc) {
    const queueName = `${resourceName}.${consumerName}`;
    // Create exchange if not exist.
    this.exchange = connection.declareExchange(resourceName);

    // Setup queue for consumer.
    this.consumer = this.consumer.bind(this)
    this.queue = connection.declareQueue(queueName);
    this.queue.activateConsumer(this.consumer);
    this.queue.bind(this.exchange);

    // Setup call backs
    this.upsertCallback = upsertCallback;
    this.deleteCallback = deleteCallback;
  }
  
  // // Receive message function for consumer
  consumer(message: Ampq.Message): void {
    const { type, data } = message.getContent();
    switch (type) {
      case 'upsert':
        this.upsertCallback(data).then(() => {
          message.ack();
        })
        .catch(error => {
          message.nack();
          console.log(error);
        });
        break;
      case 'delete':
        if (data._id) {
          this.deleteCallback(data._id).then(() => {
            message.ack();
          })
          .catch(error => {
            message.nack();
            console.log(error);
          });
        } else {
          message.nack();
        }
        break;
    }
  }
}

