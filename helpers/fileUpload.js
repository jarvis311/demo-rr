import AWS from 'aws-sdk'
import client from 'ssh2-sftp-client'

//upload file digitalocean
async function fileUploadWithDigitalOceanOld(file,foldername) {
    try {
        const extension = file.name.split(".")
        const fileName = `${Math.floor(Math.random() * 9000000000) + 1000000000}${Date.now()}.${extension[extension.length - 1]}`;
        const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
        const s3 = new AWS.S3({
            endpoint: spacesEndpoint,
            accessKeyId: process.env.DO_SPACES_KEY,
            secretAccessKey: process.env.DO_SPACES_SECRET,
        });
    
        let destination
        if (foldername == "") {
            destination = `${process.env.DO_SPACE_FOLDER_DIGITAL}/${fileName}`
        }
        else {
            destination = `${process.env.DO_SPACE_FOLDER_DIGITAL}/${foldername}/${fileName}`
        }
        const digiCridential = {
            Bucket: process.env.DO_SPACES_BUCKET,
            folder: process.env.DO_SPACE_FOLDER_DIGITAL,
            Key: destination,
            Body: file.data,
            ACL: "public-read",
            region: process.env.DO_SPACES_REGION
        }
        const dataLoc = await s3.upload(digiCridential).promise()
        if(dataLoc){
            return {
                status : true,
                image : dataLoc.Location
            }
        }else{
            return {
                status : false,
            }
        }
    } catch (error) {
        if(error){
            return {
                status : false
            }
        }
        return error
    }

}
async function fileUploadWithDigitalOcean(file,foldername) {
    try {
        const fileName = Math.floor(Math.random() * 100000) + Date.now() + "." + file.name.split(".").pop();
        const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT_NEW);
        const s3 = new AWS.S3({
            endpoint: spacesEndpoint,
            accessKeyId: process.env.DO_SPACES_KEY_NEW,
            secretAccessKey: process.env.DO_SPACES_SECRET_NEW,
        });
    
        let destination
        if (foldername == "") {
            destination = `${process.env.DO_SPACE_FOLDER_NEW}/${fileName}`
        }
        else {
            destination = `${process.env.DO_SPACE_FOLDER_NEW}/${foldername}/${fileName}`
        }
        const digiCridential = {
            Bucket: process.env.DO_SPACES_BUCKET_NEW,
            folder: process.env.DO_SPACE_FOLDER_NEW,
            Key: destination,
            Body: file.data,
            ACL: "public-read",
            region: process.env.DO_SPACES_REGION_NEW
        }
        const dataLoc = await s3.upload(digiCridential).promise()
        if(dataLoc){
            return {
                status : true,
                image : (dataLoc.Location).replace("https://rtoapplication.sgp1.digitaloceanspaces.com/",process.env.DO_SPACES_BASE_URL_NEW)
            }
        }else{
            return {
                status : false,
            }
        }
    } catch (error) {
        if(error){
            return {
                status : false
            }
        }
        return error
    }

}


// delete file digitalOcean
async function fileDeleteDigitalOceanNew(image) {
    const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT_NEW);
    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: process.env.DO_SPACES_KEY_NEW,
        secretAccessKey: process.env.DO_SPACES_SECRET_NEW,
    });
    const folder = "vehicle_document"
    if (folder == "") {
        var filename = image.split("/")
        var destination = `${process.env.DO_SPACE_FOLDER_NEW}/${filename[filename.length - 1]}`
    }
    else {
        var filename = image.split("/")
        var destination = `${process.env.DO_SPACE_FOLDER_NEW}/${folder}/${filename[filename.length - 1]}`
    }
    const digiCridential = {
        Bucket: process.env.DO_SPACES_BUCKET_NEW,
        Key: destination,
    }
    // const dataLoc = await s3.deleteObject(digiCridential).promise()
    const _result = await s3.deleteObject(digiCridential, function(deleteErr, data) {
        if (deleteErr) {
            return false
        }
        else {
            console.log('Successfully deleted the item');
            return true
        }
      });
    return _result
}

async function fileDeleteDigitalOcean(image) {
    const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET,
    });
    const folder = "vehicle_document"
    const filename = image.split("/")
    const destination = `${process.env.DO_SPACE_FOLDER_DIGITAL}/${folder}/${filename[filename.length - 1]}`
    const digiCridential = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: destination,
    }
    const _result = await s3.deleteObject(digiCridential, function(deleteErr, data) {
        if (deleteErr) {
            return false
        }
        else {
            console.log('Successfully deleted the item');
            return true
        }
      });
    return _result
    
}

// edit file digitalOcean
async function fileEditDigitaOcean(image,folder,oldFile) {
    if(oldFile){
        const _deleteImage = await fileDeleteDigitalOcean(oldFile)
    }
    const _imageUpload = await fileUploadWithDigitalOceanOld(image,folder)
    return _imageUpload
}

async function fileEditDigitaOceanNew(image,folder,oldFile) {
    if(oldFile){
        const _deleteImage = await fileDeleteDigitalOceanNew(oldFile)
    }
    const _imageUpload = await fileUploadWithDigitalOcean(image,folder)
    return _imageUpload;
}

async function affilationEditFileUpload(image,folder,oldFile){
    if(oldFile && oldFile !=""){
        const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT_NEW);
        const s3 = new AWS.S3({
            endpoint: spacesEndpoint,
            accessKeyId: process.env.DO_SPACES_KEY_NEW,
            secretAccessKey: process.env.DO_SPACES_SECRET_NEW,
        });
        let destination
        if (folder == "") {
            const filename = oldFile.split("/")
            destination = `${process.env.DO_SPACE_FOLDER_NEW}/${filename[filename.length - 1]}`
        }
        else {
            const filename = oldFile.split("/")
            destination = `${process.env.DO_SPACE_FOLDER_NEW}/${folder}/${filename[filename.length - 1]}`
        }
        const digiCridential = {
            Bucket: process.env.DO_SPACES_BUCKET_NEW,
            Key: destination,
        }
        const dataLoc = await s3.deleteObject(digiCridential).promise()
    }
    const fileName = Math.floor(Math.random() * 100000) + Date.now() + "." + image.name.split(".").pop();
    const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT_NEW);
    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: process.env.DO_SPACES_KEY_NEW,
        secretAccessKey: process.env.DO_SPACES_SECRET_NEW,
    });

    let destination
    if (folder == "") {
        destination = `${process.env.DO_SPACE_FOLDER_NEW}/${fileName}`
    }
    else {
        destination = `${process.env.DO_SPACE_FOLDER_NEW}/${folder}/${fileName}`
    }
    const digiCridential = {
        Bucket: process.env.DO_SPACES_BUCKET_NEW,
        folder: process.env.DO_SPACE_FOLDER_NEW,
        Key: destination,
        Body: image.data,
        ACL: "public-read",
        region: process.env.DO_SPACES_REGION_NEW
    }
    const dataLoc = await s3.upload(digiCridential).promise()
    if(dataLoc){
        return {
            status : true,
            image : (dataLoc.Location).replace("https://rtoapplication.sgp1.digitaloceanspaces.com/",process.env.DO_SPACES_BASE_URL_NEW)
        }
    }else{
        return {
            status : false,
        }
    }
}


async function  fileUploadSftp(image,folderPath,oldFile) {
    if(process.env.SPACE === "False"){
        const fileName = Math.floor(Math.random() * 100000) + Date.now() + "." + image.name.split(".").pop();
        if(oldFile){
            await deleteImageFTP(oldFile,folderPath)
        }
        const _response = uploadImagedFTP(image,folderPath,fileName)
        return _response
    }else{
        if(oldFile){
            const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT_NEW);
            const s3 = new AWS.S3({
                endpoint: spacesEndpoint,
                accessKeyId: process.env.DO_SPACES_KEY_NEW,
                secretAccessKey: process.env.DO_SPACES_SECRET_NEW,
            });
            const filename = image.split("/")
            let destination
            if(folderPath == ""){
                destination = `${process.env.DO_SPACE_FOLDER_NEW}/${filename[filename.length - 1]}`
            }else{
                destination = `${process.env.DO_SPACE_FOLDER_NEW}/${folderPath}/${filename[filename.length - 1]}`
            }
            const digiCridential = {
                Bucket: process.env.DO_SPACES_BUCKET_NEW,
                Key: destination,
            }
            const dataLoc = await s3.deleteObject(digiCridential).promise()
        }
        const fileName = Math.floor(Math.random() * 100000) + Date.now() + "." + image.name.split(".").pop();
        const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT_NEW);
        const s3 = new AWS.S3({
            endpoint: spacesEndpoint,
            accessKeyId: process.env.DO_SPACES_KEY_NEW,
            secretAccessKey: process.env.DO_SPACES_SECRET_NEW,
        });
    
        let destination 
        if(folderPath == ""){
            destination = `${process.env.DO_SPACE_FOLDER_NEW}/${fileName}`
        }else{
            destination = `${process.env.DO_SPACE_FOLDER_NEW}/${folderPath}/${fileName}`
        }
        
        const digiCridential = {
            Bucket: process.env.DO_SPACES_BUCKET_NEW,
            folder: process.env.DO_SPACE_FOLDER_NEW,
            Key: destination,
            Body: file.data,
            ACL: "public-read",
            region: process.env.DO_SPACES_REGION_NEW
        }
        const dataLoc = await s3.upload(digiCridential).promise()
        if(dataLoc){
            return {
                status : true,
                image : (dataLoc.Location).replace("https://rtoapplication.sgp1.digitaloceanspaces.com/",process.env.DO_SPACES_BASE_URL_NEW)
            }
        }else{
            return {
                status : false,
            }
        }
    }
    
}

async function uploadImagedFTP(image,folderPath,fileName){
    const sftp = new client();
    const sftp2 = new client()
    const remoteFilePath = `${process.env.FTP_PATH1}${process.env.FTP_FOLDER1}${folderPath}/${fileName}`;
    const remoteFilePathSFTP2 = `${process.env.FTP_PATH2}${process.env.FTP_FOLDER2}${folderPath}/${fileName}`;
    const publicUrl = `${process.env.FTP_BASE_URL1}${process.env.FTP_FOLDER1}${folderPath}/${fileName}`;
    try {
        // Connect to the SFTP server
        let connect = await sftp.connect({
            host: process.env.FTP_HOST1,
            port:process.env.FTP_PORT1,
            username: process.env.FTP_USERNAME1,
            password: process.env.FTP_PASSWORD1,
            autoConnect: true, 
        });

        // connect sftp2 
        let sftpconnect2 = await sftp2.connect({
            host: process.env.FTP_HOST2,
            port:process.env.FTP_PORT2,
            username: process.env.FTP_USERNAME2,
            password: process.env.FTP_PASSWORD2,
            autoConnect: true, 
        });
        if(sftpconnect2){
            await sftp2.put(image.data, remoteFilePathSFTP2);
        }
        if(connect){
            await sftp.put(image.data, remoteFilePath);
            return {
                status : true,
                image :publicUrl
            }
        }else{
            sftp.end()
            return {
                status : false,
            }
        }
    } catch (error) {
        console.error('Error uploading file:', error.message);
        return {
            status : false,
        }
    } finally {
        // Disconnect from the SFTP server
        await sftp.end();
    }

}
async function deleteImageFTP(image,folderPath){
    try {
        const sftp = new client();
        const sftp2 = new client()
        const Filename = image.split("/")
        let destinationPath
        let destinationPathSftp2
        if(folderPath && folderPath != ""){
            destinationPath = `${process.env.FTP_PATH1}${process.env.FTP_FOLDER1}${folderPath}/${Filename[Filename.length - 1]}`
            destinationPathSftp2 = `${process.env.FTP_PATH2}${process.env.FTP_FOLDER2}${folderPath}/${Filename[Filename.length - 1]}`
        }else{
            destinationPath = `${process.env.FTP_PATH1}${process.env.FTP_FOLDER1}${Filename[Filename.length - 1]}`
            destinationPathSftp2 = `${process.env.FTP_PATH2}${process.env.FTP_FOLDER2}${Filename[Filename.length - 1]}`
        }

         // Connect to the SFTP server
         let connect = await sftp.connect({
            host: process.env.FTP_HOST1,
            port:process.env.FTP_PORT1,
            username: process.env.FTP_USERNAME1,
            password: process.env.FTP_PASSWORD1,
            autoConnect: true, 
        });

        // connect sftp2 
        let sftpconnect2 = await sftp2.connect({
            host: process.env.FTP_HOST2,
            port:process.env.FTP_PORT2,
            username: process.env.FTP_USERNAME2,
            password: process.env.FTP_PASSWORD2,
            autoConnect: true, 
        });
        if(sftpconnect2){
            await sftp.delete(destinationPathSftp2);
        }
        if(connect){
            await sftp.delete(destinationPath);
            console.log("=Image Delete Successfully..");
            return {
                status : true,
            }
        }else{
            sftp.end()
            return {
                status : false,
            }
        }
    } catch (error) {
        console.log("===error",error);
        return {
            status :false
        }
    }
}

export default {
    fileUploadWithDigitalOcean,
    fileDeleteDigitalOcean,
    fileDeleteDigitalOceanNew,
    fileEditDigitaOcean,
    fileEditDigitaOceanNew,
    fileUploadWithDigitalOceanOld,
    affilationEditFileUpload,
    fileUploadSftp,
    deleteImageFTP
}