// server/api.js
// 统一封装后端所有 API，供前端调用
import { API_KEY, TENANT_ID, DEFAULT_MODEL_SERVICE_ID } from './config.js';
import axios from 'axios';

const BASE_URL = 'https://cloud.xinyoutai.net';

const aiAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': `Bearer ${API_KEY}`,
    'tenant-id': TENANT_ID,
    'Content-Type': 'application/json',
  },
});

export const getAssistantInfo = async () => {
  return aiAxios.get(`/copywriting/scene/user/${DEFAULT_MODEL_SERVICE_ID}`);
};

export const getDialogueList = async (params) => {
  return aiAxios.get('/copywriting/dialogue/list', { params });
};

export const getMessageList = async (userDialogueId) => {
  return aiAxios.get(`/copywriting/message/list/${userDialogueId}`);
};

export const closeDialogue = async (userDialogueId) => {
  return aiAxios.get(`/copywriting/dialogue/sse/close/${userDialogueId}`);
};

export const getModelList = async (params) => {
  return aiAxios.get('/copywriting/user-model/model-list', { params });
};

export const getCopywritingRecordList = async (params) => {
  return aiAxios.get('/copywriting/userCopywriting/record-list', { params });
};

export const generateCopywriting = async (id, data) => {
  return aiAxios.post(`/copywriting/userCopywriting/${id}`, data);
};

export const sendDialogueMessage = async (id, data) => {
  return aiAxios.post(`/copywriting/dialogue/sse/send-message/${id}`, data);
};

export const audioToText = async (data) => {
  return aiAxios.post('/copywriting/message/audio-to-text', data);
};

export const chat = async (data) => {
  return aiAxios.post('/api/copywriting/dialogue/sse/send-message', data);
};
