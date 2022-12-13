const fs = require("fs");
const FormData = require("form-data");
const rfs = require("recursive-fs");
const basePathConverter = require("base-path-converter");

require('dotenv').config({ path: `.env.local`, override: true });

const JWT = 'Bearer ' + process.env.JWT
console.log(JWT)
const pinDirectoryToPinata = async () => {
    const {got} = await import('got');
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const src = "./build";
    var status = 0;
    try {
        const {dirs, files} = await rfs.read(src);
        let data = new FormData();
        for (const file of files) {
            data.append(`file`, fs.createReadStream(file), {
                filepath: basePathConverter(src, file),
            });
        }
        const response = await got(url, {
            method: 'POST',
            headers: {
                "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                "Authorization": JWT
            },
            body: data
        })
            .on('uploadProgress', progress => {
                console.log(progress);
            });
        console.log(JSON.parse(response.body));
    } catch (error) {
        console.log(error);
    }
};

pinDirectoryToPinata()
