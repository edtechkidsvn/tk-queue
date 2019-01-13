import * as Ampq from 'amqp-ts';
declare type upsertFunc = (data: any) => Promise<any>;
declare type deleteFunc = (_id: string) => Promise<any>;
export declare function connect(uri: string): void;
export declare class RbProducer {
    exchange?: Ampq.Exchange;
    queue?: Ampq.Queue;
    resourceName: string;
    consumerName?: string;
    constructor(resourceName: string, consumerName?: string);
    send(type: string, data: any): void;
}
export declare class RbConsumer {
    exchange?: Ampq.Exchange;
    queue?: Ampq.Queue;
    upsertCallback: upsertFunc;
    deleteCallback: deleteFunc;
    resourceName: string;
    consumerName: string;
    constructor(consumerName: string, resourceName: string, upsertCallback: upsertFunc, deleteCallback: deleteFunc);
    listen(): void;
    private consumer;
}
export {};
