// server/swagger.js
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '企业名片AI后端接口文档',
      version: '1.0.0',
      description: '基于 OpenAPI 3.0 的自动化接口文档，支持在线调试',
    },
    servers: [
      { url: 'http://localhost:3001', description: '本地开发环境' }
    ],
  },
  apis: ['./server/index.js'], // 注释写在 index.js 里
};

const swaggerSpec = swaggerJSDoc(options);

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
