export interface RequestBody {
	url: string
}

export interface ApiResponse {
	success: boolean
	processedUrl: string
	timestamp: string
	transcript?: string
}

export interface TranscriptSegment {
	start: number
	duration: number
	text: string
}
