/** Supported video platforms. */
export type Platform = 'youtube' | 'peertube' | 'vimeo';

/** Result returned from a thumbnail resolution. */
export interface ThumbnailResult {
	url: string;
	width: number;
	height: number;
	platform: Platform;
	cached: boolean;
}

/** Internal cache entry wrapping a result with its insertion timestamp. */
export interface CacheEntry {
	result: ThumbnailResult;
	timestamp: number;
}
