"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Ampq = __importStar(require("amqp-ts"));
var connection;
function connect(uri) {
    connection = new Ampq.Connection(uri);
}
exports.connect = connect;
var RbProducer = /** @class */ (function () {
    function RbProducer(resourceName, consumerName) {
        this.resourceName = resourceName;
        this.consumerName = consumerName;
        this.send = this.send.bind(this);
    }
    // Send message function for producer
    RbProducer.prototype.send = function (type, data) {
        if (!this.exchange) {
            // Create exchange if not exist.
            this.exchange = connection.declareExchange(this.resourceName);
            if (this.consumerName) {
                var queueName = this.consumerName + "." + this.resourceName;
                this.queue = connection.declareQueue(queueName);
                this.queue.bind(this.exchange);
            }
        }
        this.exchange.send(new Ampq.Message({ type: type, data: data }));
    };
    return RbProducer;
}());
exports.RbProducer = RbProducer;
var RbConsumer = /** @class */ (function () {
    function RbConsumer(consumerName, resourceName, upsertCallback, deleteCallback) {
        this.consumerName = consumerName;
        this.resourceName = resourceName;
        // Setup call backs
        this.consumer = this.consumer.bind(this);
        this.upsertCallback = upsertCallback;
        this.deleteCallback = deleteCallback;
    }
    RbConsumer.prototype.listen = function () {
        var queueName = this.consumerName + "." + this.resourceName;
        // Create exchange if not exist.
        this.exchange = connection.declareExchange(this.resourceName);
        // Setup queue for consumer.
        this.queue = connection.declareQueue(queueName);
        this.queue.activateConsumer(this.consumer);
        this.queue.bind(this.exchange);
    };
    // // Receive message function for consumer
    RbConsumer.prototype.consumer = function (message) {
        var _a = message.getContent(), type = _a.type, data = _a.data;
        switch (type) {
            case 'upsert':
                this.upsertCallback(data).then(function () {
                    message.ack();
                })
                    .catch(function (error) {
                    message.nack();
                    console.log(error);
                });
                break;
            case 'delete':
                if (data._id) {
                    this.deleteCallback(data._id).then(function () {
                        message.ack();
                    })
                        .catch(function (error) {
                        message.nack();
                        console.log(error);
                    });
                }
                else {
                    message.nack();
                }
                break;
        }
    };
    return RbConsumer;
}());
exports.RbConsumer = RbConsumer;
