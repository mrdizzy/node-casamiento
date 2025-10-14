const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://984c464d-1c23-4359-81fb-561712a67b6a-bluemix.cloudant.com';
const dbName = 'test_ebay';
const outputFile = 'test_ebay_backup.json';
const designDocsFile = 'test_ebay_design_docs.json';
const attachmentsDir = 'attachments';

const username = '984c464d-1c23-4359-81fb-561712a67b6a-bluemix';
const password = '562483426d05944e298d24f854f7c0866df18d6e55010ffb8c1d613756e6a78a';

const makeRequest = (path) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.replace('https://', ''),
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(username + ':' + password).toString('base64')}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
};

const downloadAttachment = async (docId, attachmentName) => {
  const encodedDocId = encodeURIComponent(docId);
  const encodedAttachmentName = encodeURIComponent(attachmentName);
  const attachmentPath = `/${dbName}/${encodedDocId}/${encodedAttachmentName}`;
  const data = await makeRequest(attachmentPath);
  
  if (!fs.existsSync(attachmentsDir)){
    fs.mkdirSync(attachmentsDir);
  }
  
  const safeFileName = attachmentName.replace(/[/\\?%*:|"<>]/g, '-');
  fs.writeFileSync(path.join(attachmentsDir, `${docId}_${safeFileName}`), data);
};

const backupDatabase = async () => {
  try {
    console.log('Starting backup...');
    
    // Backup all documents including attachments
    const allDocsData = await makeRequest(`/${dbName}/_all_docs?include_docs=true`);
    const allDocsJson = JSON.parse(allDocsData);

    for (let row of allDocsJson.rows) {
      if (row.doc._attachments) {
        for (let attachmentName in row.doc._attachments) {
          console.log(`Downloading attachment: ${attachmentName} for document: ${row.id}`);
          await downloadAttachment(row.id, attachmentName);
        }
      }
    }

    fs.writeFileSync(outputFile, JSON.stringify(allDocsJson, null, 2));
    
    // Backup design documents
    const designDocsData = await makeRequest(`/${dbName}/_all_docs?startkey="_design"&endkey="_design0"&include_docs=true`);
    const designDocsJson = JSON.parse(designDocsData);
    
    fs.writeFileSync(designDocsFile, JSON.stringify(designDocsJson, null, 2));

    console.log(`Backup completed. Data saved to ${outputFile}, design documents saved to ${designDocsFile}, and attachments saved in ${attachmentsDir} directory.`);
  } catch (error) {
    console.error('Error during backup:', error);
  }
};

backupDatabase();