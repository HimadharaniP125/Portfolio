import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CORS headers
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
};

export default async function handler(req, res) {
  setCorsHeaders(res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
      });
      return res.status(200).json({ success: true, data: projects });
    }

    if (req.method === 'POST') {
      const { title, description, url, tags } = req.body || {};

      // Validation
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: title, description'
        });
      }

      if (title.length > 255) {
        return res.status(400).json({ success: false, error: 'Title is too long' });
      }

      const project = await prisma.project.create({
        data: {
          title,
          description,
          url: url || null,
          tags: tags && Array.isArray(tags) ? tags : []
        }
      });

      return res.status(201).json({ success: true, data: project });
    }

    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (err) {
    console.error('[Projects API Error]', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process project request',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
