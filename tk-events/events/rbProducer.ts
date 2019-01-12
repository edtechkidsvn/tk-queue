import * as Ampq from 'amqp-ts';
import connection from './connection';

export default class RbProducer {
  exchange: Ampq.Exchange;

  public constructor(resourceName: string) {
    // Create exchange if not exist.
    this.exchange = connection.declareExchange(resourceName);
    this.send = this.send.bind(this);
  }

  // Send message function for producer
  send(type, data): void {
    this.exchange.send(new Ampq.Message({ type, data }));
  }
}
