const cheerio = require('cheerio');
const wget = require('node-wget-promise');
const cliProgress = require('cli-progress');
const axios = require('axios');
const config = require('./config.json');

const {Utils} = require('./utils');

const INDEX = {
    YEAR: 5, MONTH: 3, DAY: 1,
};
let $;
class Crawler {

    constructor(html, subfix) {
        $ = cheerio.load(html);
        this.sourceUrl = this.getFileSrc();
        this.createFileTitle(subfix);
        this.progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    }

    getFileSrc() {
        const $audioTags = $('audio');
        const source_url = $audioTags.first().attr('src');
        return source_url;    
    }

    createFileTitle(subfix){
        const episodeName = $('.tira-episodio').find('a').first().text();
        const episodeNameSplit = episodeName.split(' ');
        const fileName = `${episodeNameSplit[INDEX.YEAR]}-${Utils.getMonth(episodeNameSplit[INDEX.MONTH])}-${Utils.getDay(episodeNameSplit[INDEX.DAY])}${subfix}`;
        this.fileName = fileName;
        console.log(`========= ${fileName} ========= `);
        
    }

    startDownload() {
        return wget(this.sourceUrl, {
            onStart: ()=>{
                this.progressBar.start(1, 0);
            },
            onProgress: (res)=>{
                this.progressBar.update(res.percentage);
                if (res.percentage === 1){
                    this.progressBar.stop();
                }
            },
            output: `${config.DESTINATION_PATH}/${this.fileName}`,
          });
    }
}

const fetchData = async (url)=> {
    console.log("Crawling data...")
    const response = await axios(url).catch((err) => console.log(err));
    if(response.status !== 200){
        console.log("Error occurred while fetching data");
        return;
    }
    return response;
}

module.exports = {
    Crawler, fetchData
}

