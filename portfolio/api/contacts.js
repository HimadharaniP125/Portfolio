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
      const contacts = await prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
      });
      return res.status(200).json({ success: true, data: contacts });
    }

    if (req.method === 'POST') {
      const { name, email, message } = req.body || {};

      // Validation
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, email, message'
        });
      }

      if (email.length > 255) {
        return res.status(400).json({ success: false, error: 'Email is too long' });
      }

      if (message.length > 5000) {
        return res.status(400).json({ success: false, error: 'Message is too long' });
      }

      const contact = await prisma.contact.create({
        data: { name, email, message }
      });

      return res.status(201).json({ success: true, data: contact });
    }

    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (err) {
    console.error('[Contacts API Error]', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process contact request',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
