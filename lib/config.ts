/**
 * Centralized configuration for GeoSentinel Change Detection System
 * All environment variables are managed here for consistency and type safety
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: parseInt(process.env.API_TIMEOUT || '300000'),
    rateLimit: parseInt(process.env.API_RATE_LIMIT || '100'),
    rateWindow: parseInt(process.env.API_RATE_WINDOW || '3600'),
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '524288000'), // 500MB
    supportedFormats: process.env.NEXT_PUBLIC_SUPPORTED_FORMATS?.split(',') || 
      ['.tif', '.tiff', '.png', '.jpg', '.jpeg'],
    maxConcurrentUploads: parseInt(process.env.NEXT_PUBLIC_MAX_CONCURRENT_UPLOADS || '2'),
  },

  // Processing Configuration
  processing: {
    defaultTimeout: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PROCESSING_TIMEOUT || '600000'), // 10 minutes
  },

  // Alert Thresholds
  alerts: {
    warningThreshold: parseInt(process.env.NEXT_PUBLIC_WARNING_THRESHOLD || '10'),
    criticalThreshold: parseInt(process.env.NEXT_PUBLIC_CRITICAL_THRESHOLD || '20'),
  },

  // Feature Flags
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableDownloads: process.env.NEXT_PUBLIC_ENABLE_DOWNLOADS === 'true',
    enableSharing: process.env.NEXT_PUBLIC_ENABLE_SHARING === 'true',
    enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  },

  // Environment
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    publicEnv: process.env.NEXT_PUBLIC_ENV || 'development',
  },

  // Security
  security: {
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || 
      ['http://localhost:3000', 'http://localhost:3001'],
  },

  // External Services (when implemented)
  services: {
    mapbox: {
      token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    },
    googleMaps: {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
    sentry: {
      dsn: process.env.SENTRY_DSN,
    },
    analytics: {
      id: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    },
  },

  // Database (when implemented)
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    name: process.env.DATABASE_NAME || 'geosentinel',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },

  // Authentication (when implemented)
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  // Cloud Storage (when implemented)
  storage: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      s3Bucket: process.env.AWS_S3_BUCKET,
    },
  },

  // SMTP (when implemented)
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
} as const;

// Helper functions
export const getApiUrl = (endpoint: string = '') => {
  return `${config.api.baseUrl}${endpoint}`;
};

export const isFeatureEnabled = (feature: keyof typeof config.features) => {
  return config.features[feature];
};

export const getFileUploadConfig = () => ({
  maxSize: config.upload.maxFileSize,
  supportedFormats: config.upload.supportedFormats,
  maxConcurrent: config.upload.maxConcurrentUploads,
});

export const getAlertThresholds = () => ({
  warning: config.alerts.warningThreshold,
  critical: config.alerts.criticalThreshold,
});

// Validation helpers
export const validateConfig = () => {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check required API URL
  if (!config.api.baseUrl || config.api.baseUrl === 'http://localhost:8000') {
    warnings.push('API URL is using default localhost value');
  }

  // Check file size limits
  if (config.upload.maxFileSize > 1024 * 1024 * 1024) { // 1GB
    warnings.push('File upload size limit is very high (>1GB)');
  }

  // Check thresholds
  if (config.alerts.warningThreshold >= config.alerts.criticalThreshold) {
    errors.push('Warning threshold must be less than critical threshold');
  }

  return { warnings, errors };
};

export default config; 