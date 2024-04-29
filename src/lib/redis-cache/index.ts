import { getRedis, initRedis } from '@/lib/redis';

// initial redis
initRedis();
// get instance redis
const instanceRedis = getRedis().instanceRedis;
// get key
const getKey = async <T>(key: string): Promise<T | null> => {
	const result = instanceRedis.get(key);
	if (result) return JSON.parse(await result);
	return null;
};
// set key
const setKey = async <T>(key: string, value: T, expireIn: number): Promise<string> => {
	return instanceRedis.set(key, JSON.stringify(value), 'EX', expireIn);
};
// delete key
const deleteKey = async (key: string): Promise<number> => {
	return instanceRedis.del(key);
};

export { getKey, setKey, deleteKey };
