import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export class HistoryInteractService {
	private historyInteractModel: any
	constructor(historyInteractModel: any) {
		clientPromise.then(client => {
			this.historyInteractModel = client
				.db(process.env.DB_NAME)
				.collection('historyInteracts')
		})
	}
	public async createHistoryInteract(data: {
		uid: string
		action: string
		target: string
		collection: string
		status: string
		role: string
	}) {
		try {
			const timestamp = new Date()
			const insertData: HistoryInteract = {
				id: data.uid,
				type: 'create',
				action: data.action,
				collection: data.collection,
				time: timestamp.toISOString(),
				user: data.uid,
				description: `${data.role} ${data.uid} ${data.action} ${data.collection} ${data.target}`,
				role: data.role as 'moderator' | 'admin' | 'user',
			}
			const newHistoryInteract = await this.historyInteractModel.insertOne(data)
			if (!newHistoryInteract) {
				throw new Error('Cannot create history interact')
			}

			return newHistoryInteract
		} catch (error) {
			throw new Error(error)
		}
	}
	public async getHistoryInteractById(id: ObjectId) {
		try {
			return await this.historyInteractModel.findById(id)
		} catch (error) {
			throw new Error(error)
		}
	}
	async getHistoryInteracts() {
		try {
			return await this.historyInteractModel.find()
		} catch (error) {
			throw new Error(error)
		}
	}
	async updateHistoryInteractById(id, data) {
		try {
			await this.historyInteractModel.findByIdAndUpdate(id, data)
			return await this.historyInteractModel.findById(id)
		} catch (error) {
			throw new Error(error)
		}
	}
	async deleteHistoryInteractById(id) {
		try {
			return await this.historyInteractModel.findByIdAndDelete(id)
		} catch (error) {
			throw new Error(error)
		}
	}
}
