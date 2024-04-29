import Redis from 'ioredis';

type RedisClient = {
	instanceRedis?: Redis;
};

let client: RedisClient = {},
	statusConnectRedis = {
		CONNECT: 'connect',
		END: 'end',
		RECONNECTING: 'reconnecting',
		ERROR: 'error',
	};

const handleEventConnect = (instanceRedis: Redis) => {
	instanceRedis.on(statusConnectRedis.CONNECT, () => {
		console.log(`Redis is connected`);
	});
	instanceRedis.on(statusConnectRedis.END, () => {
		console.log(`Redis is end`);
	});
	instanceRedis.on(statusConnectRedis.RECONNECTING, () => {
		console.log(`Redis is reconnecting`);
	});
	instanceRedis.on(statusConnectRedis.ERROR, (error: Error) => {
		console.log(`Redis is error: ${error}`);
	});
};

const initRedis = () => {
	const instanceRedis = new Redis({
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT),
		password: process.env.REDIS_PASSWORD,
		username: process.env.REDIS_USERNAME,
	});
	client.instanceRedis = instanceRedis;
	handleEventConnect(instanceRedis);
};
const getRedis = () => client;
const closeRedis = () => {
	if (client.instanceRedis) {
		client.instanceRedis.disconnect();
	}
};

export { initRedis, getRedis, closeRedis };
