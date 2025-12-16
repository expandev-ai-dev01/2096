/**
 * @summary
 * Default values and constants for Gallery entity.
 * Provides centralized configuration for gallery creation, validation limits,
 * and image resolution definitions.
 *
 * @module constants/gallery/galleryDefaults
 */

/**
 * @interface GalleryDefaultsType
 * @description Default configuration values applied when creating new Gallery entities.
 *
 * @property {number} MAX_IMAGES - Maximum allowed images per gallery (50)
 * @property {number} INITIAL_IMAGE_INDEX - Default starting image index (1)
 * @property {string} DISPLAY_MODE - Default display mode ('page')
 * @property {number} MODAL_OVERLAY_OPACITY - Default modal overlay opacity (0.8)
 * @property {boolean} CLOSE_ON_OUTSIDE_CLICK - Default close on outside click (true)
 * @property {number} ZOOM_LEVEL - Default zoom level (1.0)
 * @property {boolean} SHOW_CAPTION - Default caption visibility (true)
 * @property {boolean} AUTO_SLIDESHOW - Default slideshow state (false)
 * @property {number} SLIDESHOW_INTERVAL - Default slideshow interval in ms (5000)
 * @property {boolean} AUTO_ROTATION_ENABLED - Default rotation state (false)
 * @property {string} ROTATION_DIRECTION - Default rotation direction ('forward')
 * @property {boolean} ADAPTIVE_QUALITY - Default adaptive quality state (true)
 * @property {number} COMPRESSION_LEVEL - Default compression level (85)
 * @property {boolean} LAZY_LOADING_ENABLED - Default lazy loading state (true)
 * @property {number} CACHE_DURATION - Default cache duration in seconds (86400)
 */
export const GALLERY_DEFAULTS = {
  /** Maximum allowed images per gallery */
  MAX_IMAGES: 50,
  /** Default starting image index */
  INITIAL_IMAGE_INDEX: 1,
  /** Default display mode */
  DISPLAY_MODE: 'page' as const,
  /** Default modal overlay opacity */
  MODAL_OVERLAY_OPACITY: 0.8,
  /** Default close on outside click */
  CLOSE_ON_OUTSIDE_CLICK: true,
  /** Default zoom level */
  ZOOM_LEVEL: 1.0,
  /** Default caption visibility */
  SHOW_CAPTION: true,
  /** Default slideshow state */
  AUTO_SLIDESHOW: false,
  /** Default slideshow interval in ms */
  SLIDESHOW_INTERVAL: 5000,
  /** Default rotation state */
  AUTO_ROTATION_ENABLED: false,
  /** Default rotation direction */
  ROTATION_DIRECTION: 'forward' as const,
  /** Default adaptive quality state */
  ADAPTIVE_QUALITY: true,
  /** Default compression level */
  COMPRESSION_LEVEL: 85,
  /** Default lazy loading state */
  LAZY_LOADING_ENABLED: true,
  /** Default cache duration in seconds */
  CACHE_DURATION: 86400,
} as const;

/** Type representing the GALLERY_DEFAULTS constant */
export type GalleryDefaultsType = typeof GALLERY_DEFAULTS;

/**
 * @interface GalleryDisplayModeType
 * @description Available display modes for gallery.
 *
 * @property {string} PAGE - Page display mode ('page')
 * @property {string} MODAL - Modal display mode ('modal')
 */
export const GALLERY_DISPLAY_MODE = {
  PAGE: 'page',
  MODAL: 'modal',
} as const;

/** Type representing the GALLERY_DISPLAY_MODE constant */
export type GalleryDisplayModeType = typeof GALLERY_DISPLAY_MODE;

/** Union type of all valid display mode values */
export type GalleryDisplayMode = (typeof GALLERY_DISPLAY_MODE)[keyof typeof GALLERY_DISPLAY_MODE];

/**
 * @interface ImageResolutionType
 * @description Available image resolutions.
 *
 * @property {string} THUMBNAIL - Thumbnail resolution (150x150)
 * @property {string} MEDIUM - Medium resolution (800x600)
 * @property {string} LARGE - Large resolution (1920x1440)
 * @property {string} ORIGINAL - Original resolution
 */
export const IMAGE_RESOLUTION = {
  THUMBNAIL: 'thumbnail',
  MEDIUM: 'medium',
  LARGE: 'large',
  ORIGINAL: 'original',
} as const;

/** Type representing the IMAGE_RESOLUTION constant */
export type ImageResolutionType = typeof IMAGE_RESOLUTION;

/** Union type of all valid resolution values */
export type ImageResolution = (typeof IMAGE_RESOLUTION)[keyof typeof IMAGE_RESOLUTION];

/**
 * @interface ImageCategoryType
 * @description Available image categories.
 *
 * @property {string} FRONTAL - Frontal view ('frontal')
 * @property {string} LATERAL - Lateral view ('lateral')
 * @property {string} DETALHES - Details view ('detalhes')
 * @property {string} AMBIENTE - Environment view ('ambiente')
 * @property {string} PERSPECTIVA - Perspective view ('perspectiva')
 */
export const IMAGE_CATEGORY = {
  FRONTAL: 'frontal',
  LATERAL: 'lateral',
  DETALHES: 'detalhes',
  AMBIENTE: 'ambiente',
  PERSPECTIVA: 'perspectiva',
} as const;

/** Type representing the IMAGE_CATEGORY constant */
export type ImageCategoryType = typeof IMAGE_CATEGORY;

/** Union type of all valid category values */
export type ImageCategory = (typeof IMAGE_CATEGORY)[keyof typeof IMAGE_CATEGORY];

/**
 * @interface ZoomLevelType
 * @description Available zoom levels.
 */
export const ZOOM_LEVELS = [1.0, 2.0, 4.0, 8.0] as const;

/** Type representing zoom level values */
export type ZoomLevel = (typeof ZOOM_LEVELS)[number];

/**
 * @interface RotationDirectionType
 * @description Available rotation directions.
 *
 * @property {string} FORWARD - Forward direction ('forward')
 * @property {string} BACKWARD - Backward direction ('backward')
 * @property {string} RANDOM - Random direction ('random')
 */
export const ROTATION_DIRECTION = {
  FORWARD: 'forward',
  BACKWARD: 'backward',
  RANDOM: 'random',
} as const;

/** Type representing the ROTATION_DIRECTION constant */
export type RotationDirectionType = typeof ROTATION_DIRECTION;

/** Union type of all valid rotation direction values */
export type RotationDirection = (typeof ROTATION_DIRECTION)[keyof typeof ROTATION_DIRECTION];

/**
 * @interface ConnectionSpeedType
 * @description Available connection speed classifications.
 *
 * @property {string} SLOW - Slow connection ('slow')
 * @property {string} MEDIUM - Medium connection ('medium')
 * @property {string} FAST - Fast connection ('fast')
 */
export const CONNECTION_SPEED = {
  SLOW: 'slow',
  MEDIUM: 'medium',
  FAST: 'fast',
} as const;

/** Type representing the CONNECTION_SPEED constant */
export type ConnectionSpeedType = typeof CONNECTION_SPEED;

/** Union type of all valid connection speed values */
export type ConnectionSpeed = (typeof CONNECTION_SPEED)[keyof typeof CONNECTION_SPEED];

/**
 * @interface GalleryLimitsType
 * @description Validation constraints for Gallery entity fields.
 *
 * @property {number} MIN_RESOLUTION_WIDTH - Minimum image width (800)
 * @property {number} MIN_RESOLUTION_HEIGHT - Minimum image height (600)
 * @property {number} MAX_RESOLUTION_WIDTH - Maximum image width (4096)
 * @property {number} MAX_RESOLUTION_HEIGHT - Maximum image height (4096)
 * @property {number} CAPTION_MAX_LENGTH - Maximum caption length (200)
 * @property {number} DESCRIPTION_MAX_LENGTH - Maximum description length (1000)
 * @property {number} MIN_SLIDESHOW_INTERVAL - Minimum slideshow interval (2000)
 * @property {number} MAX_SLIDESHOW_INTERVAL - Maximum slideshow interval (15000)
 * @property {number} MIN_LAZY_LOAD_PRIORITY - Minimum lazy load priority (1)
 * @property {number} MAX_LAZY_LOAD_PRIORITY - Maximum lazy load priority (5)
 * @property {number} MIN_COMPRESSION - Minimum compression level (1)
 * @property {number} MAX_COMPRESSION - Maximum compression level (100)
 */
export const GALLERY_LIMITS = {
  MIN_RESOLUTION_WIDTH: 800,
  MIN_RESOLUTION_HEIGHT: 600,
  MAX_RESOLUTION_WIDTH: 4096,
  MAX_RESOLUTION_HEIGHT: 4096,
  CAPTION_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
  MIN_SLIDESHOW_INTERVAL: 2000,
  MAX_SLIDESHOW_INTERVAL: 15000,
  MIN_LAZY_LOAD_PRIORITY: 1,
  MAX_LAZY_LOAD_PRIORITY: 5,
  MIN_COMPRESSION: 1,
  MAX_COMPRESSION: 100,
} as const;

/** Type representing the GALLERY_LIMITS constant */
export type GalleryLimitsType = typeof GALLERY_LIMITS;
