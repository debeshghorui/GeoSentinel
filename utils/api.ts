// API utility functions for backend communication
import axios from 'axios';
import { config } from '@/lib/config';

const API_BASE_URL = config.api.baseUrl;
const API_TIMEOUT = config.api.timeout;
const MAX_FILE_SIZE = config.upload.maxFileSize;

export interface ProcessImagesResponse {
  changePercent: number;
  alert: string | null;
  history: Array<{
    timestamp: string;
    changePercent: number;
    alert?: string;
  }>;
  maskUrl: string;
}

export interface ProcessImagesRequest {
  beforeImage: File;
  afterImage: File;
  metadata?: {
    aoiName?: string;
    analysisType?: string;
    coordinates?: [number, number];
  };
}

// Process images for change detection
export async function processImages(data: ProcessImagesRequest): Promise<ProcessImagesResponse> {
  const formData = new FormData();
  
  formData.append('before_image', data.beforeImage);
  formData.append('after_image', data.afterImage);
  
  if (data.metadata) {
    formData.append('metadata', JSON.stringify(data.metadata));
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/process-images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: API_TIMEOUT, // Configurable timeout from environment
    });

    return response.data;
  } catch (error) {
    console.error('Error processing images:', error);
    throw new Error(
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : 'Failed to process images'
    );
  }
}

// Get processing status
export async function getProcessingStatus(jobId: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/status/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting processing status:', error);
    throw error;
  }
}

// Get analysis history
export async function getAnalysisHistory(aoiId?: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/history`, {
      params: aoiId ? { aoi_id: aoiId } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Error getting analysis history:', error);
    throw error;
  }
} 