import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dataDirectory = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'server',
  'data'
);

const filePaths = {
  contacts: path.join(dataDirectory, 'contacts.json'),
  projects: path.join(dataDirectory, 'projects.json')
};

const readCollection = async (collection) => {
  try {
    const contents = await fs.readFile(filePaths[collection], 'utf8');
    return JSON.parse(contents);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }

    await fs.mkdir(dataDirectory, { recursive: true });
    await fs.writeFile(filePaths[collection], '[]');
    return [];
  }
};

const writeCollection = async (collection, records) => {
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(filePaths[collection], JSON.stringify(records, null, 2));
};

export const getStoredRecords = async (collection) => {
  const records = await readCollection(collection);
  return records.sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
};

export const addStoredRecord = async (collection, record) => {
  const records = await readCollection(collection);
  const savedRecord = {
    id: records.length ? Math.max(...records.map(({ id }) => id || 0)) + 1 : 1,
    ...record,
    createdAt: new Date().toISOString()
  };

  await writeCollection(collection, [savedRecord, ...records]);
  return savedRecord;
};