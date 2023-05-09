import { defineStore } from 'pinia'

export const useDesign = defineStore('design', {
	state: () => ({
		design: {},
		result: []
	}),
})