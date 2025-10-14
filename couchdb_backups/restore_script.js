const http = require('http');
const fs = require('fs');
const path = require('path');

const couchdbHost = '127.0.0.1';
const couchdbPort = 5984;
const dbName = 'test_ebay_restored';  // Use a new database name to avoid overwriting
const inputFile = 'test_ebay_backup.json';
const designDocsFile = 'test_ebay_design_docs.json';
const attachmentsDir = 'attachments';

// Fill in your CouchDB credentials
const username = 'admin';
const password = 'admin';

const makeRequest = (path, method, data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: couchdbHost,
      port: couchdbPort,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData);
        } else {
          reject(new Error(`HTTP Error: ${res.statusCode} - ${responseData}`));
        }
      });
    });

    req.on('error', (error) => reject(error));

    if (data) {
      req.write(data);
    }
    req.end();
  });
};

const uploadAttachment = async (docId, attachmentName, rev) => {
  const filePath = path.join(attachmentsDir, `${docId}_${attachmentName}`);
  const fileContent = fs.readFileSync(filePath);
  
  const encodedDocId = encodeURIComponent(docId);
  const encodedAttachmentName = encodeURIComponent(attachmentName);
  
  await makeRequest(`/${dbName}/${encodedDocId}/${encodedAttachmentName}?rev=${rev}`, 'PUT', fileContent);
};

const restoreDatabase = async () => {
  try {
    console.log('Starting restoration...');

    // Check if CouchDB is accessible
    try {
      await makeRequest('/', 'GET');
      console.log('Successfully connected to CouchDB');
    } catch (error) {
      console.error('Failed to connect to CouchDB:', error.message);
      return;
    }

    // Create the database
    try {
      await makeRequest(`/${dbName}`, 'PUT');
      console.log(`Database ${dbName} created.`);
    } catch (error) {
      if (error.message.includes('412')) {
        console.log(`Database ${dbName} already exists. Continuing with restore.`);
      } else {
        throw error;
      }
    }

    // Restore documents
    const backupData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    for (let row of backupData.rows) {
      if (!row.id.startsWith('_design')) {  // Skip design documents
        console.log(`Restoring document: ${row.id}`);
        const response = await makeRequest(`/${dbName}/${encodeURIComponent(row.id)}`, 'PUT', JSON.stringify(row.doc));
        const responseJson = JSON.parse(response);

        // Restore attachments
        if (row.doc._attachments) {
          for (let attachmentName in row.doc._attachments) {
            console.log(`Restoring attachment: ${attachmentName} for document: ${row.id}`);
            await uploadAttachment(row.id, attachmentName, responseJson.rev);
          }
        }
      }
    }

    // Restore design documents
    const designDocsData = JSON.parse(fs.readFileSync(designDocsFile, 'utf8'));
    for (let row of designDocsData.rows) {
      console.log(`Restoring design document: ${row.id}`);
      await makeRequest(`/${dbName}/${encodeURIComponent(row.id)}`, 'PUT', JSON.stringify(row.doc));
    }

    console.log('Restoration completed.');
  } catch (error) {
    console.error('Error during restoration:', error);
  }
};

restoreDatabase();