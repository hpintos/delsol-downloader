const config = require('./config.json');
const { Crawler, fetchData } = require('./crawler');
const googleApi = require('./api.google');

// DOWNLOAD LAST EPISODE
fetchData(config.PROGRAMS_URL).then((res) => {
    const html = res.data;
    const crawler = new Crawler(html, config.FILE_SUBFIX);
    const fileName = crawler.fileName;
    googleApi.searchFile(fileName, (err, res) => {
        if (err) throw err;
        const files = res.data.files;
        if (files.length) {
            console.log('File already downloaded! Go and enjoy...');
        } else {
            crawler.startDownload().then(()=>{
                console.log(`Done dowloading ${fileName}...`);
                // UPLOAD TO DRIVE
                console.log('Starting upload to google drive...');
                googleApi.createFile(fileName, function (err, file) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('DONE!');
                });
            }).catch(err => console.error(err));
        }
    });
});