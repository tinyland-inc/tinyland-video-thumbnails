// Types
export type { ThumbnailResult, CacheEntry, Platform } from './types.js';

// Platform detection
export { detectPlatform, extractYouTubeId } from './platforms.js';

// Fetchers
export { fetchYouTubeThumbnail, fetchPeerTubeThumbnail, fetchVimeoThumbnail } from './fetchers.js';

// Cache & main entry point
export {
	CACHE_TTL,
	getVideoThumbnail,
	clearThumbnailCache,
	getCacheStats,
	pruneExpiredCache,
} from './cache.js';
