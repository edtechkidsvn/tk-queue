import * as Ampq from 'amqp-ts';
declare type upsertFunc = (data: any) => Promise<any>;
declare type deleteFunc = (_id: string) => Promise<any>;
export declare function connect(username: string, password: string, host: string, port: string): void;
export declare class RbProducer {
    exchange: Ampq.Exchange;
    constructor(resourceName: string);
    send(type: string, data: any): void;
}
export declare class RbConsumer {
    exchange: Ampq.Exchange;
    queue: Ampq.Queue;
    upsertCallback: upsertFunc;
    deleteCallback: deleteFunc;
    constructor(consumerName: string, resourceName: string, upsertCallback: upsertFunc, deleteCallback: deleteFunc);
    consumer(message: Ampq.Message): void;
}
export {};
