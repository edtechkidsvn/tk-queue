import * as Ampq from 'amqp-ts';

let connection: Ampq.Connection;
type upsertFunc = (data: any) => Promise<any>;
type deleteFunc = (_id: string) => Promise<any>;

export function connect(uri: string) {
  connection = new Ampq.Connection(uri);
}

export class RbProducer {
  exchange?: Ampq.Exchange;
  queue?: Ampq.Queue;
  resourceName: string;
  consumerName?: string;

  public constructor(resourceName: string, consumerName?: string) {
    this.resourceName = resourceName;
    this.consumerName = consumerName;
    this.send = this.send.bind(this);
  }

  // Send message function for producer
  public send(type: string, data: any): void {
    if (!this.exchange) {
      // Create exchange if not exist.
      this.exchange = connection.declareExchange(this.resourceName);
      if(this.consumerName) {
        const queueName = `${this.consumerName}.${this.resourceName}`;
        this.queue = connection.declareQueue(queueName);
        this.queue.bind(this.exchange);
      }
    }
    this.exchange.send(new Ampq.Message({ type, data }));
  }
}

export class RbConsumer {
  exchange?: Ampq.Exchange;
  queue?: Ampq.Queue;
  upsertCallback: upsertFunc;
  deleteCallback: deleteFunc;
  resourceName: string;
  consumerName: string;

  constructor(consumerName: string, resourceName: string, upsertCallback: upsertFunc, deleteCallback: deleteFunc) {
    this.consumerName = consumerName;
    this.resourceName = resourceName;
    
    // Setup call backs
    this.consumer = this.consumer.bind(this);
    this.upsertCallback = upsertCallback;
    this.deleteCallback = deleteCallback;
  }

  public listen(): void {
    const queueName = `${this.consumerName}.${this.resourceName}`;
    // Create exchange if not exist.
    this.exchange = connection.declareExchange(this.resourceName);

    // Setup queue for consumer.
    this.queue = connection.declareQueue(queueName);
    this.queue.activateConsumer(this.consumer);
    this.queue.bind(this.exchange);
  }
  
  // // Receive message function for consumer
  private consumer(message: Ampq.Message): void {
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

