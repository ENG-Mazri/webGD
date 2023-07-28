const DB_NAME = 'GD'
const STORAGE_NAME = 'glb'
const DB_VERSION = 1

export class IDB {
	static async getDbAsync(): Promise<IDBDatabase> {

		return new Promise((resolve, reject) => {
			const indexedDB = self.indexedDB || window.indexedDB;
			const request = indexedDB.open(DB_NAME, DB_VERSION)
			request.onblocked = (e: any) => {
				console.error('Idb error: db blocked', e)
				reject("Blocked")
			}
			request.onerror = e => {
				console.log('Error opening db', e)
				// eslint-disable-next-line prefer-promise-reject-errors
				reject('Error')
			}
			request.onsuccess = e => {
				let db = (e.target as any).result as IDBDatabase;
				resolve(db)
			}
			request.onupgradeneeded = e => {
				let db = (e.target as any).result as IDBDatabase;
				db.createObjectStore(STORAGE_NAME, {autoIncrement: false})
			}
		})
	};

	static async clearStorageAsync() {
		const db = await this.getDbAsync()

		return new Promise<void>((resolve, reject) => {
			const trans = db.transaction([STORAGE_NAME], 'readwrite')
			trans.oncomplete = () => {
				resolve()
			}
			trans.onerror = (e) => {
				console.error("IDB error", e)
				reject(e)
			}
			const store = trans.objectStore(STORAGE_NAME)
			store?.clear()
		})
	};


	static async deleteDataAsync(data: any) {
		const db = await this.getDbAsync()
		return new Promise<void>(resolve => {
			const trans = db.transaction([STORAGE_NAME], 'readwrite')
			trans.oncomplete = () => {
				resolve()
			}
			trans.onerror = (e: any) => {
				console.error("IDB error" + e)
				resolve()
			}
			const store = trans.objectStore(STORAGE_NAME)
			store.delete(data.id)
		})
	};

	static async getDataListAsync() {
		let db = await this.getDbAsync()
		const data: any[] = []

		return new Promise(resolve => {
			let trans = db.transaction([STORAGE_NAME], 'readonly')
			trans.oncomplete = () => {
				resolve(data)
			}
			const store = trans.objectStore(STORAGE_NAME)
			store.openCursor().onsuccess = e => {
				const cursor = (e.target as any).result
				if (cursor) {
					data.push(cursor.value)
					cursor.continue()
				}
			}
		})
	}

	static async getDataByKeysAsync(keysArray: string[]): Promise<any[]> {
		const keys = new Set<string>(keysArray);

		let db = await this.getDbAsync()
		return new Promise(resolve => {
				if (keys == undefined) {
					resolve([])
					return
				}

				const data: any[] = [];

				let trans = db.transaction([STORAGE_NAME], 'readonly')
				trans.oncomplete = () => {
					//resolve(data)
				}
				trans.onerror = (e) => {
					console.error("IDB error" + e)
				}
				const store = trans.objectStore(STORAGE_NAME)

				for (const i in keysArray) {
					// console.log(key)
					const rangeTest = IDBKeyRange.only(keysArray[i]);
					store.openCursor(rangeTest).onsuccess = e => {

						const cursor = (e.target as any).result

						if (cursor) {
							data[i] = cursor.value
							keys.delete(keysArray[i])

							if (keys.size == 0)
								resolve(data)
							else
								cursor.continue()
						}

					}
				}

			}
		)
	}


	static async getDataByKeyAsync(key: any) {
		let db = await this.getDbAsync()
		return new Promise(resolve => {
			if (key == undefined) {
				resolve(undefined)
				return
			}

			let data: any = undefined;

			let trans = db.transaction([STORAGE_NAME], 'readonly')
			trans.oncomplete = () => {
				resolve(data.result)
			}
			trans.onerror = (e) => {
				console.error("IDB error" + e)
			}
			const store = trans.objectStore(STORAGE_NAME)
			data = store.get(key)
		})
	}

	static async saveDataAsync(data: any, key: string | undefined = undefined) {
		let db = await this.getDbAsync()
		return new Promise<void>(resolve => {
			let trans = db.transaction([STORAGE_NAME], 'readwrite')
			trans.oncomplete = () => {
				resolve()
			}
			let store = trans.objectStore(STORAGE_NAME)
			if (key)
				store.add(data, key)
			else
				store.put(data)

		})
	}

	static async saveBatchDataAsync(storageName: string = STORAGE_NAME, data: any[], keys: string[]) {
		let db = await this.getDbAsync()

		return new Promise<void>((resolve, reject) => {
			let trans = db.transaction([storageName], 'readwrite')
			trans.onerror = (e: any) => {
				console.error("IDB transaction error", e)
				reject("Error")
			}

			trans.oncomplete = () => {
				resolve()
			}

			trans.onabort = () => {
				reject("Aborted")
				console.log("IDB Transaction aborted")
			}

			let store = trans.objectStore(STORAGE_NAME)
			for (let i = 0; i < keys.length; i = i + 1) {
				const res: IDBRequest = store.add(data[i], keys[i])
			}
		})
	}
}