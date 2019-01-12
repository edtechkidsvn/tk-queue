import * as Ampq from 'amqp-ts';
import connection from './connection';

export type upsertFunc = (any) => Promise<any>;
export type deleteFunc = (string) => Promise<any>;

export default class RbConsumer {
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
  consumer(message): void {
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

