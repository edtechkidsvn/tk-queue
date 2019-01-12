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
function connect(username, password, host, port) {
    var uri = "amqp://" + username + ":" + password + "@" + host + ":" + port;
    connection = new Ampq.Connection(uri);
}
exports.connect = connect;
var RbProducer = /** @class */ (function () {
    function RbProducer(resourceName) {
        // Create exchange if not exist.
        this.exchange = connection.declareExchange(resourceName);
        this.send = this.send.bind(this);
    }
    // Send message function for producer
    RbProducer.prototype.send = function (type, data) {
        this.exchange.send(new Ampq.Message({ type: type, data: data }));
    };
    return RbProducer;
}());
exports.RbProducer = RbProducer;
var RbConsumer = /** @class */ (function () {
    function RbConsumer(consumerName, resourceName, upsertCallback, deleteCallback) {
        var queueName = resourceName + "." + consumerName;
        // Create exchange if not exist.
        this.exchange = connection.declareExchange(resourceName);
        // Setup queue for consumer.
        this.consumer = this.consumer.bind(this);
        this.queue = connection.declareQueue(queueName);
        this.queue.activateConsumer(this.consumer);
        this.queue.bind(this.exchange);
        // Setup call backs
        this.upsertCallback = upsertCallback;
        this.deleteCallback = deleteCallback;
    }
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
