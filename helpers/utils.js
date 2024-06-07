import crypto from "crypto"
import UserRegistration from "../models/UserRegistration.js";
import fs from "fs"
import RcUserRegistration from "../models/rcmodels/RcUserRegistration.js";
import redisClient from "../config/redis.js";

function newErrorResponseWithInvelidInput(message) {
    let response = {
        status: false,
        response_code: 400,
        response_message: message
    }
    return response;
}
function newErrorResponseWithDataArray() {
    let response = {
        status: false,
        response_code: 400,
        response_message:'Data Not Found'
    }
    return response;
}
function newErrorResponseWithDataArrayWithMessage(message) {
    let response = {
        status: false,
        response_code: 404,
        response_message:message
    }
    return response;
}


async function priceRangeToWords(value = 0) {
    const val = Math.abs(value)
    if (val >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`
    if (val >= 100000) return `${(value / 100000).toFixed(2)} Lakh`
    if (val >= 1000) return `${(value / 1000).toFixed(2)} K`
    return val ? val : 0;
}



function encrypt(jsonResponse,show, outputEncoding = "base64") {
    if(show){
        return jsonResponse;
    }else{
        const key = 'V@$undh@r@50599#'
        const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
        return Buffer.concat([cipher.update(JSON.stringify(jsonResponse)), cipher.final()]).toString(outputEncoding) ;
    }
}

async function storeNewVehicle(data) {
    const { user_id, device_id, vehicle_number,reg_number} = data
    let responseUser 
    if(user_id || device_id){
      if(user_id){
        responseUser = await RcUserRegistration.findOne({
            where:{
              id: user_id,
              deleted_at : null
            }
        })
      }else if(device_id){
        responseUser = await RcUserRegistration.findOne({
            where:{
                device_id: device_id,
                deleted_at : null
            }
        })
      }

      if(responseUser){
        const vehicleNumber = responseUser.vehicle_number && responseUser.vehicle_number.split(",");
        if(!vehicleNumber.includes(reg_number)){
            const vehicle_num = responseUser.vehicle_number ?  responseUser.vehicle_number + "," + reg_number : reg_number;
            const trimmed_vehicle_num = vehicle_num.replace(/^,|,$/g, "");
            let user ={
                vehicle_number : vehicle_num
            }
            await RcUserRegistration.update(user,{
                where:{
                    id : responseUser.id,
                    deleted_at : null
                }
            })
        }
      }else{

        let newUser ={
            device_id: device_id ? device_id : '',
            vehicle_number : reg_number
        }
        await RcUserRegistration.create(newUser)
          .then(user => {
            console.log("===newUser",user.id);
          })
          .catch(error => {
            console.log("--error",error);
            console.error(error);
          });
      }
    }
}


function count_digit(number) { return number.toString().length; }
function divider(number_of_digits) { 
    let tens = "1"; 
    if (number_of_digits > 8) {
        return 10000000;
    }
    
    while ((number_of_digits - 1) > 0) {
        tens += "0";
        number_of_digits--;
    }
    return tens;
}

async function priceIntoWord(num=0, cat_id) {
    let ext = ""; //thousand, lac, crore
    let number_of_digits = count_digit(num); //this is call :)
    let dividerValue
    let fraction
    if (cat_id == 4 || cat_id == 5) {
      if (number_of_digits > 3) {
        if (number_of_digits % 2 !== 0) {
          dividerValue = divider(number_of_digits);
        } else {
          dividerValue = divider(number_of_digits - 1);
        }
      } else {
        dividerValue = 1;
      }
      fraction = num / dividerValue;
      fraction = Math.round(fraction);

      ext = "M";
    } else {
      if (number_of_digits > 3) {
        if (number_of_digits % 2 !== 0) {
          dividerValue = divider(number_of_digits - 1);
        } else {
          dividerValue = divider(number_of_digits);
        }
      } else {
        dividerValue = 1;
      }
      fraction = num / dividerValue;
      if(fraction !== 0 ){
        fraction = fraction.toFixed(2);
      }
      if (number_of_digits == 4 || number_of_digits == 5) {
        ext = "k";
      }
      if (number_of_digits == 6 || number_of_digits == 7) {
        ext = "Lakh";
      }
      if (number_of_digits == 8 || number_of_digits == 9) {
        ext = "Cr";
      }
    }
    if(fraction === 0 ){
      return fraction
    }else{
      return fraction + " " + ext;
    }
}

async function translate(key,lang) {
  let transLang = lang ? lang : 'en'
  const transalteJson = fs.readFileSync(`public/lang/${transLang}.json`, 'utf8');
  const _result = JSON.parse(transalteJson);
  return _result[key]
}

function convertEncrypt(text, outputEncoding = "base64",secretKey) {
  const key = secretKey
  const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
  return Buffer.concat([cipher.update(text), cipher.final()]).toString(outputEncoding) ;
}
function convertDecrypt(cipherText,secretKey) {
  const key = secretKey
  const cipher = crypto.createDecipheriv("aes-128-ecb", key, null);
  const bufferText = Buffer.from(cipherText,"base64")
  return Buffer.concat([cipher.update(bufferText), cipher.final()]).toString("utf8");
}


// old maskString
// async function maskString(str) {
//   let mask = '';
//   for (let i = 0; i < str.length; i++) {
//     if (i % 2 === 0) {
//       mask += '*';
//     } else {
//       mask += str[i];
//     }
//   }
//   return mask;
// }


// new maskString 
function maskString(str) {
  let result = ''; 
  for (let i = 0; i < str.length; i++) {
      if (i === 1) {
        result += '*'; 
      } else {
        result += str[i]; 
        if ((i - 1) % 2 === 0 && i > 1) {
          result += '*';
        }
      }
  }

  return result;
}


/****************** get data From redis **********************/
async function getDataFromRedis(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, function(err, res) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};


export default {
    priceRangeToWords,
    priceIntoWord,
    newErrorResponseWithInvelidInput,
    encrypt,
    storeNewVehicle,
    newErrorResponseWithDataArray,
    newErrorResponseWithDataArrayWithMessage,
    translate,
    convertEncrypt,
    convertDecrypt,
    maskString,
    getDataFromRedis
}