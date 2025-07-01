
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(bodyParser.json());


// 新优态AI接口基础URL
const BASE_URL = 'https://xinyoutai.apifox.cn';

// 示例：企业助手版本id、模型服务id等可配置
const DEFAULT_ASSISTANT_ID = '1704806933013553154'; // 示例对话助手版本id
const DEFAULT_MODEL_SERVICE_ID = '1783672782255861761'; // 示例模型服务id


// 获取企业助手信息（企业名片）
app.get('/api/assistant', async (req, res) => {
  try {
    const result = await axios.get(`${BASE_URL}/copywriting/scene/user/${DEFAULT_ASSISTANT_ID}`);
    res.json(result.data);
  } catch {
    res.status(500).json({ msg: '获取企业助手信息失败' });
  }
});

// 获取对话助手记录列表
app.get('/api/dialogue/list', async (req, res) => {
  const { pageNum = 1, pageSize = 10, orderByColumn = '', isAsc = '', manageId, isUser = true } = req.query;
  if (!manageId) return res.status(400).json({ msg: '缺少manageId参数' });
  try {
    const result = await axios.get(`${BASE_URL}/copywriting/dialogue/list`, {
      params: { pageNum, pageSize, orderByColumn, isAsc, manageId, isUser },
    });
    res.json(result.data);
  } catch {
    res.status(500).json({ msg: '获取对话助手记录失败' });
  }
});

// 获取对话消息列表
app.get('/api/message/list/:userDialogueId', async (req, res) => {
  const { userDialogueId } = req.params;
  try {
    const result = await axios.get(`${BASE_URL}/copywriting/message/list/${userDialogueId}`);
    res.json(result.data);
  } catch {
    res.status(500).json({ msg: '获取对话消息列表失败' });
  }
});

// 关闭对话
app.get('/api/dialogue/close/:userDialogueId', async (req, res) => {
  const { userDialogueId } = req.params;
  try {
    const result = await axios.get(`${BASE_URL}/copywriting/dialogue/sse/close/${userDialogueId}`);
    res.json(result.data);
  } catch {
    res.status(500).json({ msg: '关闭对话失败' });
  }
});

// 获取用户模型服务列表
app.get('/api/model/list', async (req, res) => {
  try {
    const result = await axios.get(`${BASE_URL}/copywriting/user-model/model-list`, { params: req.query });
    res.json(result.data);
  } catch {
    res.status(500).json({ msg: '获取模型服务列表失败' });
  }
});

// 获取文本生成历史记录
app.get('/api/copywriting/record-list', async (req, res) => {
  try {
    const result = await axios.get(`${BASE_URL}/copywriting/userCopywriting/record-list`, { params: req.query });
    res.json(result.data);
  } catch {
    res.status(500).json({ msg: '获取文本生成历史失败' });
  }
});

// 文本/图片生成接口
app.post('/api/copywriting/generate/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await axios.post(`${BASE_URL}/copywriting/userCopywriting/${id}`, req.body);
    res.json(result.data);
  } catch {
    res.status(500).json({ msg: '生成内容失败' });
  }
});

// 对话助手流接口（指定助手版本id）
app.post('/api/dialogue/send-message/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await axios.post(`${BASE_URL}/copywriting/dialogue/sse/send-message/${id}`, req.body);
    res.json(result.data);
  } catch {
    res.status(500).json({ msg: '对话助手流接口异常' });
  }
});

// 声音转文字接口
app.post('/api/audio-to-text', async (req, res) => {
  try {
    const result = await axios.post(`${BASE_URL}/copywriting/message/audio-to-text`, req.body);
    res.json(result.data);
  } catch {
    res.status(500).json({ msg: '音频转文字失败' });
  }
});

// AI对话接口（流式对话）
app.post('/api/chat', async (req, res) => {
  const { content, userDialogueId, parentId } = req.body;
  try {
    const body = {
      speechUserDialogueMessage: {
        content,
        parentId: parentId || '',
      },
      isKb: false,
      tools: [],
      workflows: [],
      modelServiceId: DEFAULT_MODEL_SERVICE_ID,
      name: content,
      id: userDialogueId || '',
    };
    const aiRes = await axios.post(
      `${BASE_URL}/copywriting/dialogue/sse/send-message`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    // 返回AI对话流内容（可根据前端需求调整）
    res.json({ data: aiRes.data });
  } catch (e) {
    res.status(500).json({ msg: 'AI对话服务异常' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`企业名片AI后端服务已启动，端口：${PORT}`);
});
