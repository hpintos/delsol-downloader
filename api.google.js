const fs = require('fs');
const config = require('./config.json');
const { google } = require('googleapis');

const credentials = require('./credentials.json');

const scopes = [
    'https://www.googleapis.com/auth/drive'
];
const auth = new google.auth.JWT(
    credentials.client_email, null,
    credentials.private_key, scopes
);

const drive = google.drive({ version: "v3", auth });

const getFileList = ()=>{
    drive.files.list({}, (err, res) => {
        if (err) throw err;
        const files = res.data.files;
        if (files.length) {
            files.map((file) => {
                console.log(file);
            });
        } else {
            console.log('No files found');
        }
    });
}

const searchFile = (name, callback)=>{
    drive.files.list({
        q: `name='${name}'`,
        fields: 'files(id, name)',
        spaces: 'drive'
    }, callback);
}

const createFile = (fileName, callback)=> {
    var fileMetadata = {
        'name': fileName,
        parents: [config.LA_MESA_FOLDER_ID]
    };
    var media = {
        mimeType: 'audio/mpeg',
        body: fs.createReadStream(`${config.UPLOAD_PATH}/${fileName}`,)
    };
    drive.files.create({
        uploadType: 'media',
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, callback);
}

const deleteFile = (fileId, callback)=>{
    drive.files.delete({
        fileId: fileId
    }, callback);
}

module.exports = {
    getFileList, 
    searchFile,
    deleteFile, 
    createFile
}