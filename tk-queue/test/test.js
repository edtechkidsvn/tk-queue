'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

const uri = 'amqp://hhuqcpxx:HMOfMmPrN8mvq-omynhtiJqTYOFbV4Mr@bee.rmq.cloudamqp.com/hhuqcpxx';

describe('Tk-Queue test', () => {
  it('should not failed', () => {
    const producer = new index.RbProducer("test-resource-new", "test-queue-relay-new");
    const consumer = new index.RbConsumer("tk-test", "test-resource", (data) => {
      console.log("Upserted");
      console.log(data);
      return Promise.resolve();
    },
    (id) => {
      console.log("Deleted");
      console.log(id);
      return Promise.resolve();
    });
    index.connect(uri);
    consumer.listen()
    producer.send("upsert", {x: 5});
  })
})