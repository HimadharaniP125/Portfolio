import http from 'node:http';
import contactsHandler from '../api/contacts.js';
import projectsHandler from '../api/projects.js';

const handlers = {
  '/api/contacts': contactsHandler,
  '/api/projects': projectsHandler
};

const readBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
};

const server = http.createServer(async (request, response) => {
  const handler = handlers[request.url?.split('?')[0]];

  if (!handler) {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ success: false, error: 'Not Found' }));
    return;
  }

  try {
    const body = request.method === 'POST' ? await readBody(request) : {};
    const apiResponse = Object.assign(response, {
      status(code) {
        response.statusCode = code;
        return apiResponse;
      },
      json(payload) {
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(payload));
      }
    });
    await handler({ method: request.method, body }, apiResponse);
  } catch (error) {
    console.error('[Local API Error]', error);
    if (!response.headersSent) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ success: false, error: 'Invalid request' }));
    }
  }
});

server.listen(3001, () => {
  console.log('Local API running at http://localhost:3001');
});