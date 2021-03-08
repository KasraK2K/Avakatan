import * as config from 'config';

const RMQConfig = config.get('RMQ');

export const rabbitmqOptions = {
  urls: RMQConfig.urls,
  queue: RMQConfig.queue,
  queueOptions: {
    durable: true,
  },
};
