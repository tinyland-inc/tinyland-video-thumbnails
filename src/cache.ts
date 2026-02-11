import type { CacheEntry, ThumbnailResult } from './types.js';
import { detectPlatform } from './platforms.js';
import { fetchYouTubeThumbnail, fetchPeerTubeThumbnail, fetchVimeoThumbnail } from './fetchers.js';

/** Cache time-to-live: 24 hours in milliseconds. */
export const CACHE_TTL = 1000 * 60 * 60 * 24;

/** Internal thumbnail cache keyed by video URL. */
const thumbnailCache = new Map<string, CacheEntry>();

/**
 * Resolve a video thumbnail URL with caching.
 *
 * 1. Check the in-memory cache (respecting TTL).
 * 2. Detect the platform.
 * 3. Fetch the thumbnail from the appropriate provider.
 * 4. Cache and return the result.
 *
 * @param videoUrl - The video page URL.
 * @returns The thumbnail result, or `null` if the platform is unsupported
 *          or no thumbnail could be resolved.
 */
export async function getVideoThumbnail(videoUrl: string): Promise<ThumbnailResult | null> {
	const cached = thumbnailCache.get(videoUrl);
	if (cached) {
		const age = Date.now() - cached.timestamp;
		if (age < CACHE_TTL) {
			return { ...cached.result, cached: true };
		}
		thumbnailCache.delete(videoUrl);
	}

	const platform = detectPlatform(videoUrl);
	if (!platform) return null;

	let result: ThumbnailResult | null = null;

	switch (platform) {
		case 'youtube':
			result = await fetchYouTubeThumbnail(videoUrl);
			break;
		case 'peertube':
			result = await fetchPeerTubeThumbnail(videoUrl);
			break;
		case 'vimeo':
			result = await fetchVimeoThumbnail(videoUrl);
			break;
	}

	if (result) {
		thumbnailCache.set(videoUrl, { result, timestamp: Date.now() });
	}

	return result;
}

/** Remove all entries from the thumbnail cache. */
export function clearThumbnailCache(): void {
	thumbnailCache.clear();
}

/** Return the current cache size and list of cached keys. */
export function getCacheStats(): { size: number; keys: string[] } {
	return {
		size: thumbnailCache.size,
		keys: Array.from(thumbnailCache.keys()),
	};
}

/**
 * Remove expired entries from the cache.
 *
 * @returns The number of entries removed.
 */
export function pruneExpiredCache(): number {
	const now = Date.now();
	let removed = 0;

	for (const [key, entry] of thumbnailCache.entries()) {
		if (now - entry.timestamp >= CACHE_TTL) {
			thumbnailCache.delete(key);
			removed++;
		}
	}

	return removed;
}
