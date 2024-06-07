import http from "http"
import fetch from "node-fetch";
import moment from "moment";
import db from "../config/database.js"
import { Sequelize } from "sequelize";
import crypto from "crypto"
import https from 'node:https';
import CarinfoApiCallingInfo from "../models/CarinfoApiCallingInfo.js"
import redisClient from "../config/redis.js"
import RCChallanDetails from "../models/rcmodels/RCChallanDetails.js";
import RCChallanOffence from "../models/rcmodels/RCChallanOffence.js";
import utils from "./utils.js";
import { storeFailData } from "../controller/api/RCDetailsApiController.js";


// call Vihas api 
const vihasAPI = async (regNumber, tableName, id, reg_num, rcBlockStatus) => {
  try {
    const reg1 = regNumber.toUpperCase().slice(0, -4);
    const reg2 = regNumber.toUpperCase().slice(-4);
    let loginpassw = 'somish:Vasundhara_1234'
    let proxyArray = [
      "us-wa.proxymesh.com:31280",
      "fr.proxymesh.com:31280",
      "jp.proxymesh.com:31280",
      "au.proxymesh.com:31280",
      "de.proxymesh.com:31280",
      "nl.proxymesh.com:31280",
      "sg.proxymesh.com:31280",
      "us-il.proxymesh.com:31280",
      "us.proxymesh.com:31280",
      "us-ca.proxymesh.com:31280"
    ]
    const proxyRandomIp = proxyArray[Math.floor(Math.random() * proxyArray.length)];
    const proxyPort = '31280'
    let auth = await androidOidString()
    let cookie = await insertPeriodically(btoa("reg1:" + reg1 + "~reg2:" + reg2), 'a', 1)
    let postUrl = "http://spreadthequote.com/countryswebservices_0306/get-vehicle-details-api";
    const post = {
      cookie: cookie,
      auth: auth
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(Object.entries(post)),
      agent: new http.Agent({
        keepAlive: true,
        maxSockets: 100,
        proxy: `${proxyRandomIp}`,
        auth: loginpassw
      })
    };
    const response = await fetch(postUrl, options);
    let responseText = await response.text();
    let status = convertString(responseText, '<status>', '</status>')
    let chassisNo, engineNo, vehClass, fuelType, rtoData, makerCompany, makerModel, insUpto, date
    console.log("=responseText",responseText);
    if(status && status == "SUCCESS") {
      let registrationNumber = convertString(responseText, '<reg_no>', '</reg_no>');
      let registrationAuthority = convertString(responseText, '<rto>', '</rto>');
      let registrationDate = convertString(responseText, '<regn_dt>', '</regn_dt>');
      let chasiNo = convertString(responseText, '<chasi_no>', '</chasi_no>');
      let engNo = convertString(responseText, '<engine_no>', '</engine_no>');
      let ownerName = convertString(responseText, '<owner_name>', '</owner_name>');
      let vhClass = convertString(responseText, '<vh_class>', '</vh_class>');
      let fuelTypeConvert = convertString(responseText, '<fuel_type>', '</fuel_type>');
      let maker = convertString(responseText, '<maker>', '</maker>');
      let insUptoData = convertString(responseText, '<insUpto>', '</insUpto>');

      chassisNo = (chasiNo && chasiNo != "") ? chasiNo : "XXXXXXXX"
      engineNo = (engNo && engNo != "") ? engNo : "XXXXXXXX"
      vehClass = (vhClass && vhClass != "") ? vhClass : "XXXXXXXX"
      fuelType = (fuelTypeConvert && fuelTypeConvert != "") ? fuelTypeConvert : "XXXXXXXX"
      if (registrationAuthority && registrationAuthority !== "") {
        let rto = registrationAuthority.replace("State:", "").replace('Registering Authority:', "").replace(':', "");
        rto = rto.replace(/^\s+/, "");
        rtoData =rto
      } else {
        rtoData = 'XXXXXXXX';
      }

      if (maker !== "") {
        let makerData = maker.split("/");
        makerCompany = makerData[0] || "XXXXXXXX";
        makerModel = makerData[1] || "NA";
      } else {
        makerCompany = "XXXXXXXX";
        makerModel = "NA";
      }

      if (insUptoData.trim() !== "") {
        insUpto = insUptoData;
      } else {
        insUpto = "XXXXXXXX";
      }

      if (registrationDate !== "") {
        // let time = new Date(registrationDate)
        // date = new Date(time).toLocaleDateString("en-US", {day: "2-digit", month: "short", year: "numeric"});
        date = registrationDate
      } else {
        date = null;
      }
      if (insUpto.length >= 30) {
        insUpto = "NA";
      }
      // let record = {
      //   status: status,
      //   rto: rtoData,
      //   reg_no: registrationNumber,
      //   regn_dt: date,
      //   chasi_no: chassisNo,
      //   engine_no: engineNo,
      //   owner_name: ownerName,
      //   vh_class: vehClass,
      //   fuel_type: fuelType,
      //   maker: makerCompany,
      //   vehicle_age: "",
      //   address: "NA",
      //   insUpto: insUpto,
      //   state: "",
      //   policy_no: "XXXXXXXX",
      //   puc_no: "XXXXXXXX",
      //   puc_upto: "XXXXXXXX",
      //   insurance_comp: "XXXXXXXX",
      //   maker_modal: makerModel,
      //   financer_details: "NA",
      //   fuel_norms: "NA",
      //   no_of_seats: 0,
      //   body_type_desc: "NA",
      //   regn_at: "NA",
      //   manufacturer_month_yr: "NA",
      //   gvw: "NA",
      //   no_of_cyl: "NA",
      //   cubic_cap: "NA",
      //   sleeper_cap: "NA",
      //   stand_cap: "NA",
      //   wheelbase: "NA",
      //   mobile_no: "NA",
      //   permit_no: "NA",
      //   permit_issue_date: "NA",
      //   permit_from: "NA",
      //   permit_upto: "NA",
      //   permit_type: "NA",
      //   blacklist_status: "NA",
      //   noc_details: "NA",
      //   tax_upto: "NA",
      //   rc_np_no: "NA",
      //   rc_np_upto: "NA",
      //   rc_np_issued_by: "NA",
      //   rc_unld_wt: "NA",
      //   source: "VIHAS"
      // }
      let record = {
        status: status,
        rto: rtoData,
        reg_no: registrationNumber,
        regn_dt: date,
        chasi_no: chassisNo,
        engine_no: engineNo,
        owner_name: ownerName,
        vh_class: vehClass,
        fuel_type: fuelType,
        maker: makerCompany,
        vehicle_age: "",
        address: "",
        insUpto: insUpto,
        state: "",
        policy_no: "",
        puc_no: "",
        puc_upto: "",
        insurance_comp: "",
        maker_modal: makerModel,
        financer_details: "",
        fuel_norms: "",
        no_of_seats: 0,
        body_type_desc: "",
        regn_at: "",
        manufacturer_month_yr: "",
        gvw: "",
        no_of_cyl: "",
        cubic_cap: "",
        sleeper_cap: "",
        stand_cap: "",
        wheelbase: "",
        mobile_no: "",
        permit_no: "",
        permit_issue_date: "",
        permit_from: "",
        permit_upto: "",
        permit_type: "",
        blacklist_status: "",
        noc_details: "",
        tax_upto: "",
        rc_np_no: "",
        rc_np_upto: "",
        rc_np_issued_by: "",
        rc_unld_wt: "",
        source: "API"
        // source: "VIHAS"
      }
      let tempData
      const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      if (id != "" || reg_num != "") {
        record.updated_at = currentTime
        if (reg_num != "") {
          const updateQuery = `UPDATE \`${tableName}\` SET 
          status= :status,
          rto= :rto,
          reg_no= :reg_no,
          regn_dt= :regn_dt,
          chasi_no= :chasi_no,
          engine_no= :engine_no,
          owner_name= :owner_name,
          vh_class= :vh_class,
          fuel_type= :fuel_type,
          maker= :aker,
          vehicle_age= :vehicle_age,
          insUpto= :insUpto,
          state= :state,
          policy_no= :policy_no,
          puc_no= :uc_no,
          puc_upto= :puc_upto,
          insurance_comp= :insurance_comp,
          source= :source,
          maker_modal= :maker_modal,
          address= :address,
          financer_details= :financer_details,
          fuel_norms= :fuel_norms,
          no_of_seats= :no_of_seats,
          body_type_desc= :body_type_desc,
          regn_at= :regn_at,
          manufacturer_month_yr= :manufacturer_month_yr,
          gvw= :gvw,
          no_of_cyl= :no_of_cyl,
          cubic_cap= :cubic_cap,
          sleeper_cap= :sleeper_cap,
          stand_cap= :stand_cap,
          wheelbase= :wheelbase,
          mobile_no= :mobile_no,
          permit_no= :permit_no,
          permit_issue_date= :permit_issue_date,
          permit_from= :permit_from,
          permit_upto= :permit_upto,
          permit_type= :permit_type,
          rc_np_no= :rc_np_no,
          rc_np_upto= :rc_np_upto,
          rc_np_issued_by= :rc_np_issued_by,
          rc_unld_wt= :rc_unld_wt,
          blacklist_status= :blacklist_status,
          noc_details= :noc_details,
          tax_upto= :tax_upto,
          is_update= :is_update,
          updated_at= :updated_at WHERE reg_no = : reg_num `
          const [updateResult,metadata] = await db.RC.query(updateQuery, {
            replacements: {
              reg_num : reg_num,
              status: status,
              rto: rtoData,
              reg_no: registrationNumber,
              regn_dt: date,
              chasi_no: chassisNo,
              engine_no: engineNo,
              owner_name: ownerName,
              vh_class: vehClass,
              fuel_type: fuelType,
              maker: makerCompany,
              vehicle_age: "",
              address: "NA",
              insUpto: insUpto,
              state: "",
              policy_no: "XXXXXXXX",
              puc_no: "XXXXXXXX",
              puc_upto: "XXXXXXXX",
              insurance_comp: "XXXXXXXX",
              maker_modal: makerModel,
              financer_details: "NA",
              fuel_norms: "NA",
              no_of_seats: 0,
              body_type_desc: "NA",
              regn_at: "NA",
              manufacturer_month_yr: "NA",
              gvw: "NA",
              no_of_cyl: "NA",
              cubic_cap: "NA",
              sleeper_cap: "NA",
              stand_cap: "NA",
              wheelbase: "NA",
              mobile_no: "NA",
              permit_no: "NA",
              permit_issue_date: "NA",
              permit_from: "NA",
              permit_upto: "NA",
              permit_type: "NA",
              blacklist_status: "NA",
              noc_details: "NA",
              tax_upto: "NA",
              rc_np_no: "NA",
              rc_np_upto: "NA",
              rc_np_issued_by: "NA",
              rc_unld_wt: "NA",
              // source: "VIHAS",
              source: "API",
              updated_at :currentTime
            },
            type: Sequelize.QueryTypes.UPDATE
          })
          tempData =updateResult
        }else{
          const updateQuery = `UPDATE \`${tableName}\` SET 
          status = :status,
          rto = :rto,reg_no = :reg_no,
          regn_dt = :regn_dt,
          chasi_no = :chasi_no,
          engine_no = :engine_no,
          owner_name = :owner_name,
          vh_class = :vh_class,
          fuel_type = :fuel_type,
          maker = :aker,
          vehicle_age = :vehicle_age,
          insUpto = :insUpto,
          state = :state,
          policy_no = :policy_no,
          puc_no = :uc_no,
          puc_upto = :puc_upto,
          insurance_comp = :insurance_comp,
          source = :source,
          maker_modal = :maker_modal,
          address = :address,
          financer_details = :financer_details,
          fuel_norms = :fuel_norms,
          no_of_seats = :no_of_seats,
          body_type_desc = :body_type_desc,
          regn_at = :regn_at,
          manufacturer_month_yr = :manufacturer_month_yr,
          gvw = :gvw,
          no_of_cyl = :no_of_cyl,
          cubic_cap = :cubic_cap,
          sleeper_cap = :sleeper_cap,
          stand_cap = :stand_cap,
          wheelbase = :wheelbase,
          mobile_no = :mobile_no,
          permit_no = :permit_no,
          permit_issue_date = :permit_issue_date,
          permit_from = :permit_from,
          permit_upto = :permit_upto,
          permit_type = :permit_type,
          rc_np_no = :rc_np_no,
          rc_np_upto = :rc_np_upto,
          rc_np_issued_by = :rc_np_issued_by,
          rc_unld_wt = :rc_unld_wt,
          blacklist_status = :blacklist_status,
          noc_details = :noc_details,
          tax_upto = :tax_upto,
          is_update = :is_update,
          updated_at = :updated_at WHERE id = : id `
          let [updatedData,metadata] = await db.RC.query(updateQuery, {
            replacements: {
              id : id,
              status: status,
              rto: rtoData,
              reg_no: registrationNumber,
              regn_dt: date,
              chasi_no: chassisNo,
              engine_no: engineNo,
              owner_name: ownerName,
              vh_class: vehClass,
              fuel_type: fuelType,
              maker: makerCompany,
              vehicle_age: "",
              address: "NA",
              insUpto: insUpto,
              state: "",
              policy_no: "XXXXXXXX",
              puc_no: "XXXXXXXX",
              puc_upto: "XXXXXXXX",
              insurance_comp: "XXXXXXXX",
              maker_modal: makerModel,
              financer_details: "NA",
              fuel_norms: "NA",
              no_of_seats: 0,
              body_type_desc: "NA",
              regn_at: "NA",
              manufacturer_month_yr: "NA",
              gvw: "NA",
              no_of_cyl: "NA",
              cubic_cap: "NA",
              sleeper_cap: "NA",
              stand_cap: "NA",
              wheelbase: "NA",
              mobile_no: "NA",
              permit_no: "NA",
              permit_issue_date: "NA",
              permit_from: "NA",
              permit_upto: "NA",
              permit_type: "NA",
              blacklist_status: "NA",
              noc_details: "NA",
              tax_upto: "NA",
              rc_np_no: "NA",
              rc_np_upto: "NA",
              rc_np_issued_by: "NA",
              rc_unld_wt: "NA",
              // source: "VIHAS",
              source: "API",
              updated_at :currentTime
            },
            type: Sequelize.QueryTypes.UPDATE
          })
          tempData =updatedData

        }
      }else{
        // record.created_at = currentTime
        record.updated_at = currentTime
        
          const insertQuery =  `INSERT INTO \`${tableName}\` (status,
          rto,
          reg_no,
          regn_dt,
          chasi_no,
          engine_no,
          owner_name,
          vh_class,
          fuel_type,
          maker,
          vehicle_age,
          address,
          insUpto,
          state,
          policy_no,
          puc_no,
          puc_upto,
          insurance_comp,
          maker_modal,
          financer_details,
          fuel_norms,
          no_of_seats,
          body_type_desc,
          regn_at,
          manufacturer_month_yr,
          gvw,
          no_of_cyl,
          cubic_cap,
          sleeper_cap,
          stand_cap,
          wheelbase,
          mobile_no,
          permit_no,
          permit_issue_date,
          permit_from,
          permit_upto,
          permit_type,
          blacklist_status,
          noc_details,
          tax_upto,
          rc_np_no,
          rc_np_upto,
          rc_np_issued_by,
          rc_unld_wt,
          source,
          created_at,
          updated_at
        ) VALUES (
          :status,
          :rto,
          :reg_no,
          :regn_dt,
          :chasi_no,
          :engine_no,
          :owner_name,
          :vh_class,
          :fuel_type,
          :maker,
          :vehicle_age,
          :address,
          :insUpto,
          :state,
          :policy_no,
          :puc_no,
          :puc_upto,
          :insurance_comp,
          :maker_modal,
          :financer_details,
          :fuel_norms,
          :no_of_seats,
          :body_type_desc,
          :regn_at,
          :manufacturer_month_yr,
          :gvw,
          :no_of_cyl,
          :cubic_cap,
          :sleeper_cap,
          :stand_cap,
          :wheelbase,
          :mobile_no,
          :permit_no,
          :permit_issue_date,
          :permit_from,
          :permit_upto,
          :permit_type,
          :blacklist_status,
          :noc_details,
          :tax_upto,
          :rc_np_no,
          :rc_np_upto,
          :rc_np_issued_by,
          :rc_unld_wt,
          :source,
          :created_at,
          :updated_at);`
        console.log("=record",record);
        const [result,metadata] = await db.RC.query(insertQuery,{
          replacements: record,
          type: Sequelize.QueryTypes.INSERT,
        })
        tempData =result
      }

      if(tempData){
        if(registrationDate == "NOT AVAILABLE"){
          record.regn_dt ="0000-00-00"
        }
        record.created_at = "0000-00-00"
        record.updated_at = "0000-00-00"

        if (engineNo!== "XXXXXXXX") {
          record.engine_no = engineNo.substr(0, engineNo.length - 4) + "XXXX";
        }
        if (chassisNo!== "XXXXXXXX") {
          record.chasi_no = chassisNo.substr(0, chassisNo.length - 4) + "XXXX";
        }
        record.is_rc_block = rcBlockStatus;
        const data2 = [];
        if(record.owner_name && record.owner_name != ""){
          record.owner_name = await utils.maskString(record.owner_name)
        }

        if(record.father_name && record.father_name != ""){
          record.father_name = await utils.maskString(record.father_name)
        }
        data2.push(record);
        const _response = {
          status :true,
          response_code : 200,
          response_message : "success",
          data : data2
        }
        return _response
      }else{
        const _response = {
          status :false,
          response_code : 404,
          response_message : "Data Not Found",
          data : []
        }
        return _response
      }
    }else{
      const _response = {
        status :false,
        response_code : 404,
        response_message : "Data Not Found",
        data : []
      }
      return _response
    }
  } catch (error) {
    console.log("---error",  error);
  }
}


// call parivahan API
const parivahanAPI = async (regNumber, tableName, id, versioncode,reg_num,skipdb, rcBlockStatus,appType) => { 
  console.log("=caklllllllllllllllllllllllllllllll");
  if((appType =='ios' && versioncode >= 6.8) || (appType=='android' && (versioncode >= 10.04 && versioncode <= 10.08))){
    let authorization="Bearer M2mr4MR0i5cL0LFljgrRPsdfKJLLNRGlLlksdfKMP8o0AJDutQR4ZwBVElV3CA6wUHYK6AmoxNgDd1hRGs6N1dDYDmZ";
    let parivahanUrl="https://mparivahan.parivahan.gov.in/api/userv3/vts-encs-rcs";
    let parivahanData = {
      url:parivahanUrl,
      body :"{\"doc_number\":\"jkxKikdzYHfa7\/nWmvCNsQ==\",\"d_os_type\":\"8SX1VE3kkdVtuTup\/vF+pA==\",\"d_model\":\"bg+xC0B2Y7\/9u9kHG5PPnTUHSWlNYVXlirdX+4G4Fjub6sNFv3OPsrHjeSBAmTg\/\",\"doc_type\":\"KsNA4NaoaKbOTHyNjVGxvQ==\",\"device_id\":\"TFg4G+bQ+4eE20GmOG6qwcBOmbw\/gR8gEExuV2oqUdY=\",\"d_token\":\"Qx2bMLBDIUCLk78jvoiiEMuzTy8F1kfKGxnzZnvOyOd1yb\/WMDs2gSKnHMpL\/joGNX38mgiRpMIkXuv2bKOKzcBOmbw\/gR8gEExuV2oqUdY=\",\"d_imei_number\":\"Q7mX0KW\/sDB0xDJEPjYH+A==\",\"virtual_rc\":\"KsNA4NaoaKbOTHyNjVGxvQ==\",\"d_os_version\":\"8\/cQK6H56i\/bwA5uACbp2g==\",\"mobile_number\":\"5MU0ksAyVl5b6Piev340ng==\",\"param\":\"Y+mR3u+P+0rna9vF95JJ1w==\",\"apirc\":\"xfTMlYbbGwYGIIsx9KYzaxQyRVFTBWI9n\/sE3ve9RmPATpm8P4EfIBBMbldqKlHW\"}",
      authorization : authorization,
      key :'v95jg!b8xv}DV$uR',
      is_rc_block : rcBlockStatus
    }
    const _response = {
      status :true,
      response_code : 501,
      response_message : "Redirect On Website",
      data : parivahanData,
      api :"Parivahan"
    }
    return _response
  }else{
    if((appType =='android' && versioncode >= 10.09)){
      const _response = {
        status :false,
        response_code : 601,
        response_message : "Call Parivahan APi",
        data : [],
        api :"Parivahan"
      }
      return _response
    }else{
      const _response = {
        status :false,
        response_code : 404,
        response_message : "Data Not Found",
        data : []
      }
      return _response
    }
  }
}


// call dmg API
const dmgAPI = async(regNumber,tableName,id,versioncode,reg_num,skipdb,rcBlockStatus,appType) =>{
  try {
      let loginpassw = 'somish:Vasundhara_1234';
      let proxyArray = [
        "open.proxymesh.com:31280",
        "world.proxymesh.com:31280"
        // "us-wa.proxymesh.com:31280",
        // "fr.proxymesh.com:31280",
        // "jp.proxymesh.com:31280",
        // "au.proxymesh.com:31280",
        // "de.proxymesh.com:31280",
        // "nl.proxymesh.com:31280",
        // "sg.proxymesh.com:31280",
        // "us-il.proxymesh.com:31280",
        // "us.proxymesh.com:31280",
        // "us-ca.proxymesh.com:31280"
      ]
      const proxyRandomIp = proxyArray[Math.floor(Math.random() * proxyArray.length)];
      const proxy_port = '31280';
      const url = "https://rto.dmgvision.in/api/rc_detail";
      const regNumberencode = btoa(btoa(encrypt(regNumber,'base64','1234567896524896')))
      let deviceId = getRandomString(16).toLowerCase()
      let mobileNo = getRandomNumber(10)
      let post = {
        reg_number : regNumberencode,
        key : "VGxCck5qRXpVWEJDU2s1bVVUUklSREZCY1ZsR1UyRldUWE5aZUZWdFJ6bHJjVGxZVUhCUllVMVpVVDA9",
        device_id : deviceId,
        fcm_token : deviceId,
        version_code : 'ZFZocVJEZEJSVXM1U1RRNWJFOWxNVEZwWjFoR1VUMDk=',
        number : mobileNo
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(Object.entries(post)),
        agent: new https.Agent({
          keepAlive: true,
          maxSockets: 100,
          // proxy: `${proxyRandomIp}`,
          // auth: loginpassw
        })
      };
      const response = await fetch(url, options);
      let responseText = await response.text();
      const result = responseText ? JSON.parse(responseText) : null
      if(result && result.data){
        if(result.response_code && result.response_code == 200){
          let finalResponse = result ? JSON.parse(decrypt(Buffer.from(atob(atob(result.data)),"base64"),'utf8','1234567896524896')) : null
          console.log("=finalResponse",finalResponse);
          if(finalResponse){
            let chassisNo= finalResponse.chasi_no ? finalResponse.chasi_no : "";
            let engineNo= finalResponse.engine_no ? finalResponse.engine_no : "";
            let rc_owner_name= finalResponse.owner_name ? finalResponse.owner_name :  "";
            let fatherName= finalResponse.father_name ? finalResponse.father_name :  "";
            let address= finalResponse.address ? finalResponse.address :  "";
            let veh_class= finalResponse.vh_class ? finalResponse.vh_class : "";
            let fuel_type= finalResponse.fuel_type ? (finalResponse.fuel_type == "NOT AVAIL") ? "" : finalResponse.fuel_type : "";
            let fuel_norms=  finalResponse.fuel_norms ? finalResponse.fuel_norms :  "NA";
            let maker=  finalResponse.maker ? finalResponse.maker == "NOT AVAILABLE"  ? "" :  finalResponse.maker : "";
            let maker_model=  finalResponse.maker_model ? finalResponse.maker_model : "";
            let vehicle_color= finalResponse.vehicle_color ? finalResponse.vehicle_color : "";
            let body_type_desc= finalResponse.body_type ? finalResponse.body_type : "";
            let vehicle_age= finalResponse.vehicle_age ? finalResponse.vehicle_age : "";
            let insurance_comp=  finalResponse.insurance_comp ? finalResponse.insurance_comp :  "";
            let insurance_upto= finalResponse.insurance_upto ? (finalResponse.insurance_upto == "NOT AVAILABLE") ? "" : finalResponse.insurance_upto  : "";
            // let policy_no= finalResponse.engine_no ? finalResponse.engine_no : "XXXXXXXX";
            let puc_no= finalResponse.puc_no ? finalResponse.puc_no :  "";
            let puc_upto= finalResponse.puc_upto ? finalResponse.puc_upto :  "";
            let registration_date= finalResponse.regn_dt ? finalResponse.regn_dt :  "";
            let registration_at= finalResponse.rto ? finalResponse.rto :  "";
            let fitness_upto= finalResponse.fitness_upto ? finalResponse.fitness_upto :  "";
            let no_of_seats = finalResponse.number_of_seat ? (finalResponse.number_of_seat == "NA" ? 0 : finalResponse.number_of_seat ) : 0;

            let owner_sr_no = finalResponse.owner_sr_no ? (finalResponse.owner_sr_no == "NA") ? 0 : finalResponse.owner_sr_no   : 0;
            let no_of_cyl = finalResponse.no_of_cyl ? finalResponse.no_of_cyl : ""
            let cubic_cap = finalResponse.cubic_cap ? finalResponse.cubic_cap : "";
            let sleeper_cap = finalResponse.sleeper_cap ? finalResponse.sleeper_cap : "";
            let permit_no = finalResponse.permit_no ? finalResponse.permit_no : "";
            let permit_issue_date = finalResponse.permit_issue_date ? finalResponse.permit_issue_date : "";
            let permit_from = finalResponse.permit_from ? finalResponse.permit_from : "";
            let permit_upto = finalResponse.permit_upto ? finalResponse.permit_upto : "";
            let permit_type = finalResponse.permit_type ? finalResponse.permit_type : "";
            let blacklist_status = finalResponse.blacklist_status ? finalResponse.blacklist_status : "";
            let tax_upto = finalResponse.tax_upto ? finalResponse.tax_upto : "";
            let rc_np_no = finalResponse.np_no ? finalResponse.np_no : "";
            let rc_np_upto = finalResponse.rc_np_upto ? finalResponse.rc_np_upto : "";
            let rc_np_issued_by = finalResponse.rc_np_issued_by ? finalResponse.rc_np_issued_by : "";
            let rc_unld_wt = finalResponse.rc_unld_wt ? finalResponse.rc_unld_wt : "";

            let status = "SUCCESS";
            // for (let i = 0; i < userData.length; i++) {
            //   const element = userData[i];
            //   if(element.key == "birth_place") registration_at =  element.value;
            //   if(element.key == "plate_ni_date") registration_date =  element.value;
            //   if(element.key == "chasi_no") chassisNo =  element.value;
            //   if(element.key == "engine_no") engineNo =  element.value;
            //   if(element.key == "malik") rc_owner_name =  element.value;
            //   if(element.key == "view") veh_class =  element.value;
            //   if(element.key == "pani") fuel_type =  element.value;
            //   if(element.key == "karta_harta") maker =  element.value;
            //   if(element.key == "umar") vehicle_age =  element.value;
            //   if(element.key == "policy_no") policy_no =  element.value;
            //   if(element.key == "dust_no") puc_no =  element.value;
            //   if(element.key == "dust_end") puc_upto =  element.value;
            //   if(element.key == "backup_name") insurance_comp =  element.value;
            //   if(element.key == "backup_date") insurance_upto =  element.value;
            //   if(element.key == "malik_ka_bap") fatherName =  element.value;
            //   if(element.key == "thekanu") address =  element.value;
            //   if(element.key == "rang_rup") vehicle_color =  element.value;
            //   if(element.key == "validity") fitness_upto =  element.value;
            //   if(element.key == "number_of_seat") no_of_seats =  element.value;
            //   if(element.key == "fuel_norms") fuel_norms = element.value;
            //   if(policy_no == null || policy_no == "")
            //   {
            //     policy_no = 'XXXXXXXX';
            //   }
            //   if(puc_no == null || puc_no == "")
            //   {
            //     puc_no = 'XXXXXXXX';
            //   }
            //   if(puc_upto == null || puc_upto == "")
            //   {
            //     puc_upto = 'XXXXXXXX';
            //   }
            //   if(insurance_comp == null || insurance_comp == "")
            //   {
            //     insurance_comp = 'XXXXXXXX';
            //   }
            //   if(fuel_type == "NOT AVAIL")
            //   {
            //     fuel_type = 'XXXXXXXX';
            //   }
            //   if(maker == "NOT AVAILABLE")
            //   {
            //     maker = "XXXXXXXX";
            //   }
            //   if(insurance_upto == "NOT AVAILABLE")
            //   {
            //     insurance_upto = "XXXXXXXX";
            //   }
            //   status = "SUCCESS";
            // }
            let record = {
              status: status,
              rto: registration_at,
              reg_no: regNumber,
              regn_dt: registration_date,
              chasi_no: chassisNo,
              engine_no: engineNo,
              owner_name: rc_owner_name,
              vh_class: veh_class,
              fuel_type: fuel_type,
              maker: maker,
              maker_modal:maker_model,
              father_name:fatherName,
              address: address,
              owner_sr_no :owner_sr_no,
              fitness_upto:fitness_upto,
              vehicle_age: vehicle_age,
              insUpto: insurance_upto,
              state: "",
              // policy_no: policy_no,
              puc_no: puc_no,
              puc_upto:puc_upto,
              insurance_comp: insurance_comp,
              vehicle_color:vehicle_color,
              fuel_norms: fuel_norms,
              no_of_seats: no_of_seats,
              body_type_desc:body_type_desc,
              no_of_cyl:no_of_cyl,
              cubic_cap:cubic_cap,
              sleeper_cap:sleeper_cap,
              permit_no:permit_no,
              permit_issue_date:permit_issue_date,
              permit_from:permit_from,
              permit_upto:permit_upto,
              permit_type:permit_type,
              tax_upto:tax_upto,
              rc_np_no:rc_np_no,
              rc_np_upto:rc_np_upto,
              rc_np_issued_by:rc_np_issued_by,
              rc_unld_wt:rc_unld_wt,
              is_update : 1,
              source: "API"
              // source: "DMG"
            }
            console.log("=record",record);
            let tempData
            const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            if (id != "" || reg_num != "") {
              record.updated_at = currentTime
              if (reg_num != "") {
                const updateQuery = `UPDATE \`${tableName}\` SET 
                status = :status,
                rto = :rto,
                reg_no = :reg_no,
                regn_dt = :regn_dt,
                chasi_no = :chasi_no,
                engine_no = :engine_no,
                owner_name = :owner_name,
                vh_class = :vh_class,
                fuel_type = :fuel_type,
                maker = :maker,
                maker_modal = :maker_model,
                father_name = :father_name,
                address = :address,
                owner_sr_no = :owner_sr_no,
                fitness_upto = :fitness_upto,
                vehicle_age = :vehicle_age,
                insUpto = :insUpto,
                state = :state,
                no_of_seats = :no_of_seats,
                puc_no = :uc_no,
                puc_upto = :puc_upto,
                insurance_comp = :insurance_comp,
                vehicle_color = :vehicle_color,
                fuel_norms = :fuel_norms,
                body_type_desc = :body_type_desc,
                no_of_cyl = :no_of_cyl,
                cubic_cap = :cubic_cap,
                sleeper_cap = :sleeper_cap,
                permit_no = :permit_no,
                permit_issue_date = :permit_issue_date,
                permit_from = :permit_from,
                permit_upto = :permit_upto,
                permit_type = :permit_type,
                tax_upto = :tax_upto,
                rc_np_no = :rc_np_no,
                rc_np_upto = :rc_np_upto,
                rc_np_issued_by = :rc_np_issued_by,
                rc_unld_wt = :rc_unld_wt,
                is_update = :is_update,
                source = :source,
                updated_at = :updated_at WHERE reg_no = :reg_num `
                const [updateResult,metadata] = await db.RC.query(updateQuery, {
                  replacements: {...record,reg_num:reg_num},
                  type: Sequelize.QueryTypes.UPDATE
                })
                tempData =updateResult
              }else{
                const updateQuery = `UPDATE \`${tableName}\` SET 
                status = :status,
                rto = :rto,
                reg_no = :reg_no,
                regn_dt = :regn_dt,
                chasi_no = :chasi_no,
                engine_no = :engine_no,
                owner_name = :owner_name,
                vh_class = :vh_class,
                fuel_type = :fuel_type,
                maker = :maker,
                maker_modal = :maker_model,
                father_name = :father_name,
                address = :address,
                owner_sr_no = :owner_sr_no,
                fitness_upto = :fitness_upto,
                vehicle_age = :vehicle_age,
                insUpto = :insUpto,
                state = :state,
                no_of_seats = :no_of_seats,
                puc_no = :uc_no,
                puc_upto = :puc_upto,
                insurance_comp = :insurance_comp,
                vehicle_color = :vehicle_color,
                fuel_norms = :fuel_norms,
                body_type_desc = :body_type_desc,
                no_of_cyl = :no_of_cyl,
                cubic_cap = :cubic_cap,
                sleeper_cap = :sleeper_cap,
                permit_no = :permit_no,
                permit_issue_date = :permit_issue_date,
                permit_from = :permit_from,
                permit_upto = :permit_upto,
                permit_type = :permit_type,
                tax_upto = :tax_upto,
                rc_np_no = :rc_np_no,
                rc_np_upto = :rc_np_upto,
                rc_np_issued_by = :rc_np_issued_by,
                rc_unld_wt = :rc_unld_wt,
                is_update = :is_update,
                source = :source,
                updated_at = :updated_at WHERE WHERE id = ${id} `
                let [updatedData,metadata] = await db.RC.query(updateQuery, {
                  replacements:record,
                  type: Sequelize.QueryTypes.UPDATE
                })
                tempData = updatedData
      
              }
            }else{
              record.created_at = currentTime
              // record.updated_at = currentTime
              
                const insertQuery =  `INSERT INTO \`${tableName}\` (
                status,
                rto,
                reg_no,
                regn_dt,
                chasi_no,
                engine_no,
                owner_name,
                vh_class,
                fuel_type,
                maker,
                maker_modal,
                father_name,
                address,
                owner_sr_no,
                fitness_upto,
                vehicle_age,
                insUpto,
                state,
                no_of_seats,
                puc_no,
                puc_upto,
                insurance_comp,
                vehicle_color,
                fuel_norms,
                body_type_desc,
                no_of_cyl,
                cubic_cap,
                sleeper_cap,
                permit_no,
                permit_issue_date,
                permit_from,
                permit_upto,
                permit_type,
                tax_upto,
                rc_np_no,
                rc_np_upto,
                rc_np_issued_by,
                rc_unld_wt,
                is_update,
                source,
                created_at
              ) VALUES (
                :status,
                :rto,
                :reg_no,
                :regn_dt,
                :chasi_no,
                :engine_no,
                :owner_name,
                :vh_class,
                :fuel_type,
                :maker,
                :maker_modal,
                :father_name,
                :address,
                :owner_sr_no,
                :fitness_upto,
                :vehicle_age,
                :insUpto,
                :state,
                :no_of_seats,
                :puc_no,
                :puc_upto,
                :insurance_comp,
                :vehicle_color,
                :fuel_norms,
                :body_type_desc,
                :no_of_cyl,
                :cubic_cap,
                :sleeper_cap,
                :permit_no,
                :permit_issue_date,
                :permit_from,
                :permit_upto,
                :permit_type,
                :tax_upto,
                :rc_np_no,
                :rc_np_upto,
                :rc_np_issued_by,
                :rc_unld_wt,
                :is_update,
                :source,
                :created_at
                );`
              const [result,metadata] = await db.RC.query(insertQuery,{
                replacements: record,
                type: Sequelize.QueryTypes.INSERT,
              })
              tempData = result
            }
    
            if(tempData){
              if(registration_date == "NOT AVAILABLE"){
                record.regn_dt ="0000-00-00"
              }
              record.created_at = "0000-00-00"
              record.updated_at = "0000-00-00"
      
              if (engineNo!== "XXXXXXXX") {
                if((versioncode < 10.03 && appType != "ios") || (appType == "ios"))
                {
                  record.engine_no = engineNo.substr(0, engineNo.length - 4) + "XXXX";
                }
              }
              if (chassisNo!== "XXXXXXXX") {
                if((versioncode < 10.03 && appType != "ios") || (appType == "ios"))
                {
                  record.chasi_no = chassisNo.substr(0, chassisNo.length - 4) + "XXXX";
                }
                
              }
              record.address ="NA"
              record.is_rc_block = rcBlockStatus;
              if(record.owner_name && record.owner_name != ""){
                record.owner_name = await utils.maskString(record.owner_name)
              }
      
              if(record.father_name && record.father_name != ""){
                record.father_name = await utils.maskString(record.father_name)
              }
              const data2 = [];
              data2.push(record);
              const _response = {
                status :true,
                response_code : 200,
                response_message : "success",
                data : data2
              }
              return _response
            }else{
              const _response = {
                status :false,
                response_code : 404,
                response_message : "Data Not Found",
                data : []
              }
              return _response
            }
          }else{
            const _response = {
              status :false,
              response_code : 404,
              response_message : "Data Not Found",
              data : []
            }
            return _response
          }
        }
        else{
          const _response = {
            status :false,
            response_code : 404,
            response_message : "Data Not Found",
            data : []
          }
          return _response
        }
      }else{
        const _response = {
          status :false,
          response_code : 404,
          response_message : "Data Not Found",
          data : []
        }
        return _response
      }
  } catch (error) {
    console.log("==errro",error);
    const _response = {
      status :false,
      response_code : 404,
      response_message : "Data Not Found",
      data : []
    }
    return _response
  }
}


// call car info purchase api
const carInfoAPI = async(regNumber,tableName,id,reg_num,rcBlockStatus) =>{
  try {
    const currentDate = moment(new Date()).format("YYYY-MM-DD");
    let existRecord = await CarinfoApiCallingInfo.findOne({
      where:{ 
        date :currentDate
      }
    })
    let sendRequestCount = Number(process.env.SEND_REQUEST_COUNT)
    let totalRequest
    let carInfoCacheResult 
    // const carInfoCacheResult = await redisClient.get(`carifo_to_rto${currentDate}`);
    console.log("-carInfoCacheResult>>>",carInfoCacheResult,"-regNumberregNumberregNumber>>>",regNumber);
    if (carInfoCacheResult) {
      totalRequest = carInfoCacheResult
    }else{
      totalRequest = null
    }
    if(totalRequest){
      const _response = {
        status :false,
        response_code : 404,
        response_message : "Data Not Found",
        data : []
      }
      return _response
    }else{
      console.log("-existRecord>>>",existRecord);
      if(existRecord && existRecord.carinfo_to_rto_success >= sendRequestCount){
        await redisClient.set(`carifo_to_rto${currentDate}`,currentDate);
        const _response = {
          status :false,
          response_code : 404,
          response_message : "Data Not Found",
          data : []
        }
        return _response
      }else{
        const url =`https://api.cuvora.com/car/partner/rc-search?vehicle_num=${regNumber}`;
        const options = {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer VWPzAfBfbkXccmVh5xp83bA8NGhzEL5mPAbVcmWaq5iugpFgV9RHdn9FNqCC==',
            'apiKey': '$rto_care@23',
            'clientId': 'rto_care'
          }
        };
        const response = await fetch(url, options)
        let responseText = await response.text();
        let vehicleDataResponse = responseText && JSON.parse(responseText)
        console.log("=vehicleDataResponse>>>>>>>>>>>>",vehicleDataResponse);
        if(vehicleDataResponse){
          let tempData
          console.log("=vehicleDataResponse>>>>>>>>>>>",vehicleDataResponse);
          if(vehicleDataResponse.data){
            let vehicleData = vehicleDataResponse.data
            console.log("=vehicleData.vehicle_num>>>>>>>>>>>",vehicleData);
            // let record = {
            //   status: "SUCCESS",
            //   rto: vehicleData?.rto  ? vehicleData?.rto : 'NA',
            //   reg_no: vehicleData.vehicle_num,
            //   regn_dt: vehicleData.registDate,
            //   chasi_no :  vehicleData.chasisNo ? vehicleData.chasisNo : 'XXXXXXXX',
            //   engine_no :  vehicleData.engineNo ? vehicleData.engineNo : 'XXXXXXXX',
            //   owner_name : vehicleData.ownerName,
            //   vh_class :  vehicleData.vehicleClass ? vehicleData.vehicleClass : 'XXXXXXXX' ,
            //   fuel_type :  vehicleData.fuelType ?  (vehicleData.fuelType == "NOT AVAILABLE") ?  'XXXXXXXX' : vehicleData.fuelType  : 'XXXXXXXX' ,
            //   maker :  vehicleData.make ? (vehicleData.make == "NOT AVAILABLE") ?  'XXXXXXXX' : vehicleData.make  : 'XXXXXXXX' ,
            //   maker_modal :vehicleData.model ?  vehicleData.model : 'XXXXXXXX' ,
            //   father_name : vehicleData.otherDetails.father  ? vehicleData.otherDetails.father  :'NA',
            //   address : vehicleData.otherDetails.permanentAddress  ? vehicleData.otherDetails.permanentAddress  :'NA',
            //   owner_sr_no : vehicleData.ownerNum ? vehicleData.ownerNum : 0,
            //   fitness_upto : vehicleData.otherDetails.fitUpto  ? vehicleData.otherDetails.fitUpto  :'NA',
            //   vehicle_age : 'NA' ,
            //   insUpto : vehicleData.insuranceUpto ?  (vehicleData.insuranceUpto == "NOT AVAILABLE") ?  'XXXXXXXX' : vehicleData.insuranceUpto : 'XXXXXXXX',
            //   state : 'NA' ,
            //   policy_no :  vehicleData.previousInsurerPolicyNo ? vehicleData.previousInsurerPolicyNo : 'XXXXXXXX',
            //   puc_no : vehicleData.otherDetails.pucNo  ? vehicleData.otherDetails.pucNo  :'XXXXXXXX',
            //   puc_upto :  vehicleData.otherDetails.pucExpiry  ? vehicleData.otherDetails.pucExpiry  :'XXXXXXXX',
            //   insurance_comp :  vehicleData.previousInsurer  ? vehicleData.previousInsurer  :'XXXXXXXX',
            //   vehicle_color : vehicleData.color ? vehicleData.color.replace(/�/g, '') : 'NA',           
            //   financer_details : vehicleData.otherDetails.financier  ? vehicleData.otherDetails.financier  :'NA',
            //   fuel_norms : vehicleData.otherDetails.normsDesc ?  vehicleData.otherDetails.normsDesc == null ? "NA" : vehicleData.otherDetails.normsDesc : "NA",
            //   no_of_seats :  vehicleData.otherDetails.seatCap? vehicleData.otherDetails.seatCap: 'NA',
            //   body_type_desc :  vehicleData.otherDetails.bdyType ? vehicleData.otherDetails.bdyType :'NA',
            //   regn_at :  vehicleData.rto ? vehicleData.rto :'NA',
            //   manufacturer_month_yr : 'NA',
            //   gvw :  vehicleData.otherDetails.gvw ? vehicleData.otherDetails.gvw : 'NA',
            //   no_of_cyl : 'NA',
            //   cubic_cap : 'NA',
            //   sleeper_cap : vehicleData.otherDetails.sleeperCap ? vehicleData.otherDetails.sleeperCap : 'NA',
            //   stand_cap : vehicleData.otherDetails.standCap ? vehicleData.otherDetails.standCap : 'NA',
            //   wheelbase : vehicleData.otherDetails.wheelBase ? vehicleData.otherDetails.wheelBase : 'NA',
            //   mobile_no : 'NA',
            //   permit_no :  vehicleData.otherDetails.permitNo ? vehicleData.otherDetails.permitNo : 'NA',
            //   permit_issue_date :vehicleData.otherDetails.permitIssueDate ? vehicleData.otherDetails.permitIssueDate : 'NA',
            //   permit_from : vehicleData.otherDetails.permitFrom ? vehicleData.otherDetails.permitFrom : 'NA',
            //   permit_upto : vehicleData.otherDetails.permitTo ? vehicleData.otherDetails.permitTo : 'NA',
            //   permit_type : vehicleData.otherDetails.permitType ? vehicleData.otherDetails.permitType : 'NA',
            //   blacklist_status :  vehicleData.otherDetails.blacklistStatus ? vehicleData.otherDetails.blacklistStatus : 'NA',
            //   noc_details :  vehicleData.otherDetails.nocDetails ? vehicleData.otherDetails.nocDetails : 'NA',
            //   tax_upto :  vehicleData.otherDetails.taxUpto ? vehicleData.otherDetails.taxUpto : 'NA',
            //   rc_np_no :  'NA',
            //   rc_np_upto : 'NA',
            //   rc_np_issued_by :  'NA',
            //   rc_unld_wt :  vehicleData.otherDetails.unldw ? vehicleData.otherDetails.unldw : 'NA',
            //   is_update :  1,
            //   source :  'CAR INFO PURCHASE',
            // }
            let record = {
              status: "SUCCESS",
              rto: vehicleData?.rto  ? vehicleData?.rto : '',
              reg_no: vehicleData.vehicle_num,
              regn_dt: vehicleData.registDate,
              chasi_no :  vehicleData.chasisNo ? vehicleData.chasisNo : '',
              engine_no :  vehicleData.engineNo ? vehicleData.engineNo : '',
              owner_name : vehicleData.ownerName,
              vh_class :  vehicleData.vehicleClass ? vehicleData.vehicleClass : '' ,
              fuel_type :  vehicleData.fuelType ?  (vehicleData.fuelType == "NOT AVAILABLE") ?  '' : vehicleData.fuelType  : '' ,
              maker :  vehicleData.make ? (vehicleData.make == "NOT AVAILABLE") ?  '' : vehicleData.make  : '' ,
              maker_modal :vehicleData.model ?  vehicleData.model : '' ,
              father_name : vehicleData.otherDetails.father  ? vehicleData.otherDetails.father  :'',
              address : vehicleData.otherDetails.permanentAddress  ? vehicleData.otherDetails.permanentAddress  :'',
              owner_sr_no : vehicleData.ownerNum ? vehicleData.ownerNum : 0,
              fitness_upto : vehicleData.otherDetails.fitUpto  ? vehicleData.otherDetails.fitUpto  :'',
              vehicle_age : '' ,
              insUpto : vehicleData.insuranceUpto ?  (vehicleData.insuranceUpto == "NOT AVAILABLE") ?  '' : vehicleData.insuranceUpto : '',
              state : '' ,
              policy_no :  vehicleData.previousInsurerPolicyNo ? vehicleData.previousInsurerPolicyNo : '',
              puc_no : vehicleData.otherDetails.pucNo  ? vehicleData.otherDetails.pucNo  :'',
              puc_upto :  vehicleData.otherDetails.pucExpiry  ? vehicleData.otherDetails.pucExpiry  :'',
              insurance_comp :  vehicleData.previousInsurer  ? vehicleData.previousInsurer  :'',
              vehicle_color : vehicleData.color ? vehicleData.color.replace(/�/g, '') : '',           
              financer_details : vehicleData.otherDetails.financier  ? vehicleData.otherDetails.financier  :'',
              fuel_norms : vehicleData.otherDetails.normsDesc ?  vehicleData.otherDetails.normsDesc == null ? "" : vehicleData.otherDetails.normsDesc : "",
              no_of_seats :  vehicleData.otherDetails.seatCap? vehicleData.otherDetails.seatCap: '',
              body_type_desc :  vehicleData.otherDetails.bdyType ? vehicleData.otherDetails.bdyType :'',
              regn_at :  vehicleData.rto ? vehicleData.rto :'',
              manufacturer_month_yr : '',
              gvw :  vehicleData.otherDetails.gvw ? vehicleData.otherDetails.gvw : '',
              no_of_cyl : '',
              cubic_cap : '',
              sleeper_cap : vehicleData.otherDetails.sleeperCap ? vehicleData.otherDetails.sleeperCap : '',
              stand_cap : vehicleData.otherDetails.standCap ? vehicleData.otherDetails.standCap : '',
              wheelbase : vehicleData.otherDetails.wheelBase ? vehicleData.otherDetails.wheelBase : '',
              mobile_no : '',
              permit_no :  vehicleData.otherDetails.permitNo ? vehicleData.otherDetails.permitNo : '',
              permit_issue_date :vehicleData.otherDetails.permitIssueDate ? vehicleData.otherDetails.permitIssueDate : '',
              permit_from : vehicleData.otherDetails.permitFrom ? vehicleData.otherDetails.permitFrom : '',
              permit_upto : vehicleData.otherDetails.permitTo ? vehicleData.otherDetails.permitTo : '',
              permit_type : vehicleData.otherDetails.permitType ? vehicleData.otherDetails.permitType : '',
              blacklist_status :  vehicleData.otherDetails.blacklistStatus ? vehicleData.otherDetails.blacklistStatus : '',
              noc_details :  vehicleData.otherDetails.nocDetails ? vehicleData.otherDetails.nocDetails : '',
              tax_upto :  vehicleData.otherDetails.taxUpto ? vehicleData.otherDetails.taxUpto : '',
              rc_np_no :  '',
              rc_np_upto : '',
              rc_np_issued_by :  '',
              rc_unld_wt :  vehicleData.otherDetails.unldw ? vehicleData.otherDetails.unldw : '',
              is_update :  1,
              source :  'CI_EX',
              // source :  'CAR INFO PURCHASE',
            }
  
            const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            if (id != "" || reg_num != "") {
              record.updated_at = currentTime
              if (reg_num != "") {
                const updateQuery = `UPDATE \`${tableName}\` SET 
                status = :status,
                rto = :rto,
                reg_no = :reg_no,
                regn_dt = :regn_dt,
                chasi_no  = :chasi_no ,
                engine_no  = :engine_no ,
                owner_name  = :owner_name ,
                vh_class  = :vh_class ,
                fuel_type  = :fuel_type ,
                maker  = :maker ,
                maker_modal  = :maker_modal ,
                father_name  = :father_name ,
                address  = :address ,
                owner_sr_no  = :owner_sr_no ,
                fitness_upto  = :fitness_upto ,
                vehicle_age  = :vehicle_age ,
                insUpto  = :insUpto ,
                state  = :state ,
                policy_no  = :policy_no ,
                puc_no  = :puc_no ,
                puc_upto  = :puc_upto ,
                insurance_comp  = :insurance_comp ,
                vehicle_color  = :vehicle_color ,
                financer_details  = :financer_details ,
                fuel_norms  = :fuel_norms ,
                no_of_seats  = :no_of_seats ,
                body_type_desc  = :body_type_desc ,
                regn_at  = :regn_at ,
                manufacturer_month_yr = :manufacturer_month_yr
                gvw  = :gvw ,
                no_of_cyl  = :no_of_cyl ,
                cubic_cap  = :cubic_cap ,
                sleeper_cap  = :sleeper_cap ,
                stand_cap  = :stand_cap ,
                wheelbase  = :wheelbase ,
                mobile_no  = :mobile_no ,
                permit_no  = :permit_no ,
                permit_issue_date  = :permit_issue_date ,
                permit_from  = :permit_from ,
                permit_upto  = :permit_upto ,
                permit_type  = :permit_type ,
                blacklist_status  = :blacklist_status ,
                noc_details  = :noc_details ,
                tax_upto  = :tax_upto ,
                rc_np_no  = :rc_np_no ,
                rc_np_upto  = :rc_np_upto ,
                rc_np_issued_by  = :rc_np_issued_by ,
                rc_unld_wt  = :rc_unld_wt ,
                is_update  = :is_update ,
                source = :source,
                updated_at= :updated_at WHERE reg_no = : reg_num `
                const [updateResult,metadata] = await db.RC.query(updateQuery, {
                  replacements: {...record,reg_num:reg_num},
                  type: Sequelize.QueryTypes.UPDATE
                })
                tempData =updateResult
              }else{
                const updateQuery = `UPDATE \`${tableName}\` SET 
                status = :status,
                rto = :rto,
                reg_no = :reg_no,
                regn_dt = :regn_dt,
                chasi_no  = :chasi_no ,
                engine_no  = :engine_no ,
                owner_name  = :owner_name ,
                vh_class  = :vh_class ,
                fuel_type  = :fuel_type ,
                maker  = :maker ,
                maker_modal  = :maker_modal ,
                father_name  = :father_name ,
                address  = :address ,
                owner_sr_no  = :owner_sr_no ,
                fitness_upto  = :fitness_upto ,
                vehicle_age  = :vehicle_age ,
                insUpto  = :insUpto ,
                state  = :state ,
                policy_no  = :policy_no ,
                puc_no  = :puc_no ,
                puc_upto  = :puc_upto ,
                insurance_comp  = :insurance_comp ,
                vehicle_color  = :vehicle_color ,
                financer_details  = :financer_details ,
                fuel_norms  = :fuel_norms ,
                no_of_seats  = :no_of_seats ,
                body_type_desc  = :body_type_desc ,
                regn_at  = :regn_at ,
                manufacturer_month_yr = :manufacturer_month_yr
                gvw  = :gvw ,
                no_of_cyl  = :no_of_cyl ,
                cubic_cap  = :cubic_cap ,
                sleeper_cap  = :sleeper_cap ,
                stand_cap  = :stand_cap ,
                wheelbase  = :wheelbase ,
                mobile_no  = :mobile_no ,
                permit_no  = :permit_no ,
                permit_issue_date  = :permit_issue_date ,
                permit_from  = :permit_from ,
                permit_upto  = :permit_upto ,
                permit_type  = :permit_type ,
                blacklist_status  = :blacklist_status ,
                noc_details  = :noc_details ,
                tax_upto  = :tax_upto ,
                rc_np_no  = :rc_np_no ,
                rc_np_upto  = :rc_np_upto ,
                rc_np_issued_by  = :rc_np_issued_by ,
                rc_unld_wt  = :rc_unld_wt ,
                is_update  = :is_update ,
                source = :source,
                updated_at= :updated_at WHERE WHERE id = ${id} `
                let [updatedData,metadata] = await db.RC.query(updateQuery, {
                  replacements:record,
                  type: Sequelize.QueryTypes.UPDATE
                })
                tempData =updatedData
      
              }
            }else{
              record.created_at = currentTime
              // record.updated_at = currentTime
                const insertQuery =  `INSERT INTO \`${tableName}\` (status,
                rto,
                reg_no,
                regn_dt,
                chasi_no,
                engine_no,
                owner_name,
                vh_class,
                fuel_type,
                maker,
                maker_modal,
                father_name,
                address,
                owner_sr_no,
                fitness_upto,
                vehicle_age,
                insUpto,
                state,
                policy_no,
                puc_no,
                puc_upto,
                insurance_comp,
                vehicle_color,
                financer_details,
                fuel_norms,
                no_of_seats,
                body_type_desc,
                regn_at,
                manufacturer_month_yr,
                gvw,
                no_of_cyl,
                cubic_cap,
                sleeper_cap,
                stand_cap,
                wheelbase,
                mobile_no,
                permit_no,
                permit_issue_date,
                permit_from,
                permit_upto,
                permit_type,
                blacklist_status,
                noc_details,
                tax_upto,
                rc_np_no,
                rc_np_upto,
                rc_np_issued_by,
                rc_unld_wt,
                is_update,
                source,
                created_at
              ) VALUES (:status,
                :rto,
                :reg_no,
                :regn_dt,
                :chasi_no,
                :engine_no,
                :owner_name,
                :vh_class,
                :fuel_type,
                :maker,
                :maker_modal,
                :father_name,
                :address,
                :owner_sr_no,
                :fitness_upto,
                :vehicle_age,
                :insUpto,
                :state,
                :policy_no,
                :puc_no,
                :puc_upto,
                :insurance_comp,
                :vehicle_color,
                :financer_details,
                :fuel_norms,
                :no_of_seats,
                :body_type_desc,
                :regn_at,
                :manufacturer_month_yr,
                :gvw,
                :no_of_cyl,
                :cubic_cap,
                :sleeper_cap,
                :stand_cap,
                :wheelbase,
                :mobile_no,
                :permit_no,
                :permit_issue_date,
                :permit_from,
                :permit_upto,
                :permit_type,
                :blacklist_status,
                :noc_details,
                :tax_upto,
                :rc_np_no,
                :rc_np_upto,
                :rc_np_issued_by,
                :rc_unld_wt,
                :is_update,
                :source,
                :created_at
                );`
              const [result,metadata] = await db.RC.query(insertQuery,{
                replacements: record,
                type: Sequelize.QueryTypes.INSERT,
              })
              tempData = result
            }
            if(tempData){
              if(vehicleData.registDate == "NOT AVAILABLE"){
                record.regn_dt ="0000-00-00"
              }
              record.created_at = "0000-00-00"
              record.updated_at = "0000-00-00"
      
              if (vehicleData.engineNo !== "XXXXXXXX") {
                record.engine_no = vehicleData.engineNo.substr(0,  vehicleData.engineNo.length - 4) + "XXXX";
              }
              if (vehicleData.chasisNo !== "XXXXXXXX") {
                record.chasi_no = vehicleData.chasisNo.substr(0, vehicleData.chasisNo.length - 4) + "XXXX";
              }
              if(record.owner_name && record.owner_name != ""){
                record.owner_name = await utils.maskString(record.owner_name)
              }
      
              if(record.father_name && record.father_name != ""){
                record.father_name = await utils.maskString(record.father_name)
              }
              const data2 = [];
              data2.push(record);
              await ourApiCallingInfo(1)
              const _response = {
                status :true,
                response_code : 200,
                response_message : "success",
                data : data2
              }
              return _response
            }else{
              await ourApiCallingInfo(0)
              const _response = {
                status :false,
                response_code : 404,
                response_message : "Data Not Found",
                data : []
              }
              return _response
            }
          }else{
            await ourApiCallingInfo(0)
            console.log("-callllllllllllllllllllllllllllElse pasakldnad");
            await storeFailData(regNumber,`CI_EX: ${vehicleDataResponse?.errors?.message}`)
            const _response = {
              status :false,
              response_code : 404,
              response_message : "Data Not Found",
              data : []
            }
            return _response
          }
        }else{
          console.log("-vehicleDataResponse CVDNKLDNZKLNK pasakldnad");
          await storeFailData(regNumber,`CI_EX: API Data not found `)
          await ourApiCallingInfo(0)
          const _response = {
            status :false,
            response_code : 404,
            response_message : "Data Not Found",
            data : []
          }
          return _response
        }
      }
    }
  } catch (error) {
    console.log("==errro",error);
    const _response = {
      status :false,
      response_code : 404,
      response_message : "Data Not Found",
      data : []
    }
    return _response
  }
}


// call new vihas api
const newvihasAPI = async (regNumber, tableName, id, reg_num, rcBlockStatus) => {
  try {
    const reg1 = regNumber.toUpperCase().slice(0, -4);
    const reg2 = regNumber.toUpperCase().slice(-4);
    let loginpassw = 'somish:Vasundhara_1234'
    let proxyArray = [
      "us-wa.proxymesh.com:31280",
      "fr.proxymesh.com:31280",
      "jp.proxymesh.com:31280",
      "au.proxymesh.com:31280",
      "de.proxymesh.com:31280",
      "nl.proxymesh.com:31280",
      "sg.proxymesh.com:31280",
      "us-il.proxymesh.com:31280",
      "us.proxymesh.com:31280",
      "us-ca.proxymesh.com:31280",
      "open.proxymesh.com:31280"
    ]
    const proxyRandomIp = proxyArray[Math.floor(Math.random() * proxyArray.length)];
    const proxyPort = '31280'
    let auth = await androidOidString()
    let cookie = await insertPeriodically(btoa("reg1:" + reg1 + "~reg2:" + reg2), 'a', 1)
    let postUrl = "http://spreadthequote.com/countryswebservices_0306/get-admob-fromdb";
    const post = {
      cookie: cookie,
      auth: auth
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(Object.entries(post)),
      agent: new http.Agent({
        keepAlive: true,
        maxSockets: 100,
        proxy: `${proxyRandomIp}`,
        auth: loginpassw
      })
    };
    const response = await fetch(postUrl, options);
    let responseText = await response.text();
    let status = convertString(responseText, '<status>', '</status>')
    let chassisNo, engineNo, vehClass, fuelType, rtoData, makerCompany, makerModel, insUpto, date
    if(status && status == "SUCCESS") {
      let registrationNumber = convertString(responseText, '<reg_no>', '</reg_no>');
      let registrationAuthority = convertString(responseText, '<rto>', '</rto>');
      let registrationDate = convertString(responseText, '<regn_dt>', '</regn_dt>');
      let chasiNo = convertString(responseText, '<chasi_no>', '</chasi_no>');
      let engNo = convertString(responseText, '<engine_no>', '</engine_no>');
      let ownerName = convertString(responseText, '<owner_name>', '</owner_name>');
      let vhClass = convertString(responseText, '<vh_class>', '</vh_class>');
      let fuelTypeConvert = convertString(responseText, '<fuel_type>', '</fuel_type>');
      let maker = convertString(responseText, '<maker>', '</maker>');
      let insUptoData = convertString(responseText, '<insUpto>', '</insUpto>');

      chassisNo = (chasiNo && chasiNo != "") ? chasiNo : ""
      engineNo = (engNo && engNo != "") ? engNo : ""
      vehClass = (vhClass && vhClass != "") ? vhClass : ""
      fuelType = (fuelTypeConvert && fuelTypeConvert != "") ? fuelTypeConvert : ""
      if (registrationAuthority && registrationAuthority !== "") {
        let rto = registrationAuthority.replace("State:", "").replace('Registering Authority:', "").replace(':', "");
        rto = rto.replace(/^\s+/, "");
        rtoData =rto
      } else {
        rtoData = '';
      }

      if (maker !== "") {
        let makerData = maker.split("/");
        makerCompany = makerData[0] || "";
        makerModel = makerData[1] || "";
      } else {
        makerCompany = "";
        makerModel = "";
      }

      if (insUptoData.trim() !== "") {
        insUpto = insUptoData;
      } else {
        insUpto = "";
      }

      if (registrationDate !== "") {
        // let time = new Date(registrationDate)
        // date = new Date(time).toLocaleDateString("en-US", {day: "2-digit", month: "short", year: "numeric"});
        date = registrationDate
      } else {
        date = null;
      }
      if (insUpto.length >= 30) {
        insUpto = "NA";
      }
      let record = {
        status: status,
        rto: rtoData,
        reg_no: registrationNumber,
        regn_dt: date,
        chasi_no: chassisNo,
        engine_no: engineNo,
        owner_name: ownerName,
        vh_class: vehClass,
        fuel_type: fuelType,
        maker: makerCompany,
        vehicle_age: "",
        address: "",
        insUpto: insUpto,
        state: "",
        policy_no: "",
        puc_no: "",
        puc_upto: "",
        insurance_comp: "",
        maker_modal: makerModel,
        financer_details: "",
        fuel_norms: "",
        no_of_seats: 0,
        body_type_desc: "",
        regn_at: "",
        manufacturer_month_yr: "",
        gvw: "",
        no_of_cyl: "",
        cubic_cap: "",
        sleeper_cap: "",
        stand_cap: "",
        wheelbase: "",
        mobile_no: "",
        permit_no: "",
        permit_issue_date: "",
        permit_from: "",
        permit_upto: "",
        permit_type: "",
        blacklist_status: "",
        noc_details: "",
        tax_upto: "",
        rc_np_no: "",
        rc_np_upto: "",
        rc_np_issued_by: "",
        rc_unld_wt: "",
        // source: "VIHAS"
        source: "API"
      }
      let tempData
      const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      if (id != "" || reg_num != "") {
        record.updated_at = currentTime
        if (reg_num != "") {
          const updateQuery = `UPDATE \`${tableName}\` SET 
          status = : status,
          rto = :rto,reg_no = :reg_no,
          regn_dt = :regn_dt,
          chasi_no = :chasi_no,
          engine_no = :engine_no,
          owner_name = :owner_name,
          vh_class = :vh_class,
          fuel_type = :fuel_type,
          maker = :aker,
          vehicle_age = :vehicle_age,
          insUpto = :insUpto,
          state = :state,
          policy_no = :policy_no,
          puc_no = :uc_no,
          puc_upto = :puc_upto,
          insurance_comp = :insurance_comp,
          source = :source,
          maker_modal = :maker_modal,
          address = :address,
          financer_details = :financer_details,
          fuel_norms = :fuel_norms,
          no_of_seats = :no_of_seats,
          body_type_desc = :body_type_desc,
          regn_at = :regn_at,
          manufacturer_month_yr = :manufacturer_month_yr,
          gvw = :gvw,
          no_of_cyl = :no_of_cyl,
          cubic_cap = :cubic_cap,
          sleeper_cap = :sleeper_cap,
          stand_cap = :stand_cap,
          wheelbase = :wheelbase,
          mobile_no = :mobile_no,
          permit_no = :permit_no,
          permit_issue_date = :permit_issue_date,
          permit_from = :permit_from,
          permit_upto = :permit_upto,
          permit_type = :permit_type,
          rc_np_no = :rc_np_no,
          rc_np_upto = :rc_np_upto,
          rc_np_issued_by = :rc_np_issued_by,
          rc_unld_wt = :rc_unld_wt,
          blacklist_status = :blacklist_status,
          noc_details = :noc_details,
          tax_upto = :tax_upto,
          is_update = :is_update,
          updated_at = :updated_at WHERE reg_no = : reg_num `
          const [updateResult,metadata] = await db.RC.query(updateQuery, {
            replacements: {
              reg_num : reg_num,
              status: status,
              rto: rtoData,
              reg_no: registrationNumber,
              regn_dt: date,
              chasi_no: chassisNo,
              engine_no: engineNo,
              owner_name: ownerName,
              vh_class: vehClass,
              fuel_type: fuelType,
              maker: makerCompany,
              vehicle_age: "",
              address: "NA",
              insUpto: insUpto,
              state: "",
              policy_no: "XXXXXXXX",
              puc_no: "XXXXXXXX",
              puc_upto: "XXXXXXXX",
              insurance_comp: "XXXXXXXX",
              maker_modal: makerModel,
              financer_details: "NA",
              fuel_norms: "NA",
              no_of_seats: 0,
              body_type_desc: "NA",
              regn_at: "NA",
              manufacturer_month_yr: "NA",
              gvw: "NA",
              no_of_cyl: "NA",
              cubic_cap: "NA",
              sleeper_cap: "NA",
              stand_cap: "NA",
              wheelbase: "NA",
              mobile_no: "NA",
              permit_no: "NA",
              permit_issue_date: "NA",
              permit_from: "NA",
              permit_upto: "NA",
              permit_type: "NA",
              blacklist_status: "NA",
              noc_details: "NA",
              tax_upto: "NA",
              rc_np_no: "NA",
              rc_np_upto: "NA",
              rc_np_issued_by: "NA",
              rc_unld_wt: "NA",
              source: "VIHAS",
              updated_at :currentTime
            },
            type: Sequelize.QueryTypes.UPDATE
          })
          tempData =updateResult
        }else{
          const updateQuery = `UPDATE  \`${tableName}\` SET 
          status = :status,
          rto = :rto,
          reg_no = :reg_no,
          regn_dt = :regn_dt,
          chasi_no = :chasi_no,
          engine_no = :engine_no,
          owner_name = :owner_name,
          vh_class = :vh_class,
          fuel_type = :fuel_type,
          maker = :aker,
          vehicle_age = :vehicle_age,
          insUpto = :insUpto,
          state = :state,
          policy_no = :policy_no,
          puc_no = :uc_no,
          puc_upto = :puc_upto,
          insurance_comp = :insurance_comp,
          source = :source,
          maker_modal = :maker_modal,
          address = :address,
          financer_details = :financer_details,
          fuel_norms = :fuel_norms,
          no_of_seats = :no_of_seats,
          body_type_desc = :body_type_desc,
          regn_at = :regn_at,
          manufacturer_month_yr = :manufacturer_month_yr,
          gvw = :gvw,
          no_of_cyl = :no_of_cyl,
          cubic_cap = :cubic_cap,
          sleeper_cap = :sleeper_cap,
          stand_cap = :stand_cap,
          wheelbase = :wheelbase,
          mobile_no = :mobile_no,
          permit_no = :permit_no,
          permit_issue_date = :permit_issue_date,
          permit_from = :permit_from,
          permit_upto = :permit_upto,
          permit_type = :permit_type,
          rc_np_no = :rc_np_no,
          rc_np_upto = :rc_np_upto,
          rc_np_issued_by = :rc_np_issued_by,
          rc_unld_wt = :rc_unld_wt,
          blacklist_status = :blacklist_status,
          noc_details = :noc_details,
          tax_upto = :tax_upto,
          is_update = :is_update,
          updated_at = :updated_at WHERE id = : id `
          let [updatedData,metadata] = await db.RC.query(updateQuery, {
            replacements: {
              id : id,
              status: status,
              rto: rtoData,
              reg_no: registrationNumber,
              regn_dt: date,
              chasi_no: chassisNo,
              engine_no: engineNo,
              owner_name: ownerName,
              vh_class: vehClass,
              fuel_type: fuelType,
              maker: makerCompany,
              vehicle_age: "",
              address: "NA",
              insUpto: insUpto,
              state: "",
              policy_no: "XXXXXXXX",
              puc_no: "XXXXXXXX",
              puc_upto: "XXXXXXXX",
              insurance_comp: "XXXXXXXX",
              maker_modal: makerModel,
              financer_details: "NA",
              fuel_norms: "NA",
              no_of_seats: 0,
              body_type_desc: "NA",
              regn_at: "NA",
              manufacturer_month_yr: "NA",
              gvw: "NA",
              no_of_cyl: "NA",
              cubic_cap: "NA",
              sleeper_cap: "NA",
              stand_cap: "NA",
              wheelbase: "NA",
              mobile_no: "NA",
              permit_no: "NA",
              permit_issue_date: "NA",
              permit_from: "NA",
              permit_upto: "NA",
              permit_type: "NA",
              blacklist_status: "NA",
              noc_details: "NA",
              tax_upto: "NA",
              rc_np_no: "NA",
              rc_np_upto: "NA",
              rc_np_issued_by: "NA",
              rc_unld_wt: "NA",
              source: "VIHAS",
              updated_at :currentTime
            },
            type: Sequelize.QueryTypes.UPDATE
          })
          tempData =updatedData

        }
      }else{
        record.created_at = currentTime
        record.updated_at = currentTime
        
          const insertQuery =  `INSERT INTO \`${tableName}\` (status,
          rto,
          reg_no,
          regn_dt,
          chasi_no,
          engine_no,
          owner_name,
          vh_class,
          fuel_type,
          maker,
          vehicle_age,
          address,
          insUpto,
          state,
          policy_no,
          puc_no,
          puc_upto,
          insurance_comp,
          maker_modal,
          financer_details,
          fuel_norms,
          no_of_seats,
          body_type_desc,
          regn_at,
          manufacturer_month_yr,
          gvw,
          no_of_cyl,
          cubic_cap,
          sleeper_cap,
          stand_cap,
          wheelbase,
          mobile_no,
          permit_no,
          permit_issue_date,
          permit_from,
          permit_upto,
          permit_type,
          blacklist_status,
          noc_details,
          tax_upto,
          rc_np_no,
          rc_np_upto,
          rc_np_issued_by,
          rc_unld_wt,
          source,
          created_at,
          updated_at
        ) VALUES (
          :status,
          :rto,
          :reg_no,
          :regn_dt,
          :chasi_no,
          :engine_no,
          :owner_name,
          :vh_class,
          :fuel_type,
          :maker,
          :vehicle_age,
          :address,
          :insUpto,
          :state,
          :policy_no,
          :puc_no,
          :puc_upto,
          :insurance_comp,
          :maker_modal,
          :financer_details,
          :fuel_norms,
          :no_of_seats,
          :body_type_desc,
          :regn_at,
          :manufacturer_month_yr,
          :gvw,
          :no_of_cyl,
          :cubic_cap,
          :sleeper_cap,
          :stand_cap,
          :wheelbase,
          :mobile_no,
          :permit_no,
          :permit_issue_date,
          :permit_from,
          :permit_upto,
          :permit_type,
          :blacklist_status,
          :noc_details,
          :tax_upto,
          :rc_np_no,
          :rc_np_upto,
          :rc_np_issued_by,
          :rc_unld_wt,
          :source,
          :created_at,
          :updated_at);`
        console.log("=record",record);
        const [result,metadata] = await db.RC.query(insertQuery,{
          replacements: record,
          type: Sequelize.QueryTypes.INSERT,
        })
        tempData =result
      }

      if(tempData){
        if(registrationDate == "NOT AVAILABLE"){
          record.regn_dt ="0000-00-00"
        }
        record.created_at = "0000-00-00"
        record.updated_at = "0000-00-00"

        if (engineNo!== "XXXXXXXX") {
          record.engine_no = engineNo.substr(0, engineNo.length - 4) + "XXXX";
        }
        if (chassisNo!== "XXXXXXXX") {
          record.chasi_no = chassisNo.substr(0, chassisNo.length - 4) + "XXXX";
        }
        record.is_rc_block = rcBlockStatus;
        if(record.owner_name && record.owner_name != ""){
          record.owner_name = await utils.maskString(record.owner_name)
        }

        if(record.father_name && record.father_name != ""){
          record.father_name = await utils.maskString(record.father_name)
        }
        const data2 = [];
        data2.push(record);
        const _response = {
          status :true,
          response_code : 200,
          response_message : "success",
          data : data2
        }
        return _response
      }else{
        const _response = {
          status :false,
          response_code : 404,
          response_message : "Data Not Found",
          data : []
        }
        return _response
      }
    }else{
      const _response = {
        status :false,
        response_code : 404,
        response_message : "Data Not Found",
        data : []
      }
      return _response
    }
  } catch (error) {
    console.log("---error",  error);
  }
}


//call challan API

const challaAPI = async(reg_number,chassis_no) => {
  try {
    // const url = "https://vahanmaster.com/challan.php"
    // const postrequestData = {
    //   veh_no: reg_number,
    //   chassis_no: chassis_no,
    //   eng_no: '',
    // };
    // const responseResult = await fetch(url, {
    //   method: "POST",
    //   body: postrequestData,
    // });
    // let response = await responseResult.text();
    // console.log("---responseresponseresponse",response);
    // if(response && response.status === "Success"){
    //   if(response && response.results){
    //     for (let i = 0; i < response.results.length; i++) {
    //       const challanElement = response.results[i];
    //       const checkChallan = await RCChallanDetails.findOne({
    //         where: {
    //           reg_no: reg_number,
    //           challan_no: challanElement.challan_no
    //         }
    //       });
    //       if(!checkChallan){
    //         const insertObject = {
    //           reg_no: reg_number,
    //           violator_name: challanElement.accused_name || "",
    //           dl_rc_no: challanElement.doc_no || "",
    //           challan_no: challanElement.challan_no || "",
    //           challan_date: challanElement.date_time ? moment(challanElement.date_time).format('DD-MMM-YYYY HH:mm') : "",
    //           challan_amount: challanElement.amount || "",
    //           challan_status: challanElement.challan_status || "",
    //           challan_payment_date: challanElement.payment_date ?  moment(challanElement.payment_date).format('DD-MMM-YYYY HH:mm') : "",
    //           transaction_id: challanElement.transaction_id || "",
    //           payment_source: challanElement.payment_source || "",
    //           challan_url: challanElement.pdf_url || "",
    //           receipt_url: challanElement.receipt_url || "",
    //           payment_url: "",
    //           state: challanElement.state_code || "",
    //           date: moment(new Date()).format("DD-MMM-YYYY")
    //         };

    //         let insertId
    //         await RCChallanDetails.create(insertObject).then(data => {
    //           insertId =data && data.id
    //         })
    //         .catch(error => {
    //           console.error(error);
    //         });

    //         const offenceData = Array.from(new Set(challanElement.offences));
    //         for (const offence of offenceData) {
    //           const offenceArray = {
    //               challan_id: insertId,
    //               offence_name: offence.offence_name || "",
    //               mva:  offence.mva || "",
    //               penalty: offence.penalty || ""
    //           };
    //           await RCChallanOffence.create(offenceArray);
    //       }
    //       }
    //     }
    //   }
    // }

    const challanDetails = await RCChallanDetails.findAll({
      where: { reg_no: reg_number },
      include: [{
        model: RCChallanOffence,
        as: "offece",
        attributes : ["id","challan_id","offence_name","mva","penalty"]
      }],
      order :[['id' ,'ASC']]
    }).then((rows) => {
      if(rows){
        return rows.map((r) => {
          let element = r.dataValues
          delete element.created_at
          delete element.updated_at
          return element;
        });
      }
    });
    if(challanDetails && challanDetails.length){
      return {
        status : true,
        data :challanDetails
      }
    }else{
      return {
        status : false
      }
    }
  } catch (error) {
    console.log("===errrorrrr",error);
    return {
      status : false
    }
  }
}


const ourApiCallingInfo = async(success) => {
  try {
    const currentDate = moment(new Date()).format("YYYY-MM-DD");
    let existRecord = await CarinfoApiCallingInfo.findOne({
      where:{ 
        date :currentDate
      }
    })
    if(success == 1){
      if(existRecord){
        await CarinfoApiCallingInfo.update({'carinfo_to_rto_success' :  Sequelize.literal('carinfo_to_rto_success + 1')},{
          where:{ 
            id :existRecord.id
          }
        })
      }else{
        const insertValue ={
          date : currentDate,
          carinfo_to_rto_success : 1,
          type : 1
        }
        await CarinfoApiCallingInfo.create(insertValue)
      }
    }else{
      if(existRecord){
        await CarinfoApiCallingInfo.update({'carinfo_to_rto_fail' : Sequelize.literal('carinfo_to_rto_success + 1')},{
          where:{ 
            id :existRecord.id
          }
        })
      }else{
        const insertValue ={
          date : currentDate,
          carinfo_to_rto_fail : 1,
          type : 1
        }
        await CarinfoApiCallingInfo.create(insertValue)
      }
    }
  } catch (error) {
    console.log("=error",error);
  }
}
async function androidOidString() {
  let str1 = "A2ZXX007";
  let getKey = "C0deRed";
  const bArr = btoa(getKey);
  const bArr1 = btoa(str1);
  const slength = bArr.length;
  const slength1 = bArr1.length;
  let authString1 = "";
  let authString2 = "";
  for (let i = 0; i <= slength; i++) {
    if (i % 2 === 0) {
      authString1 += bArr.charAt(i);
    } else {
      authString1 += getRandomString(1);
      authString1 += bArr.charAt(i);
      authString1 += getRandomString(1);
    }
  }
  for (let j = 0; j <= slength1; j++) {
    if (j % 2 === 0) {
      authString2 += bArr1.charAt(j);
    } else {
      authString2 += getRandomString(1);
      authString2 += bArr1.charAt(j);
      authString2 += getRandomString(1);
    }
  }
  let sb = "";
  sb += getRandomString(1);
  sb += getRandomString(1);
  sb += authString1;
  sb += "~";
  sb += authString2;
  sb += getRandomString(1);
  sb += "+";
  sb += getRandomString(4);
  return sb

}

function getRandomString(length) {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  let randomString = '';

  for (let j = 0; j < length; j++) {
    randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return randomString;
}

function getRandomNumber(length) {
  const characters = "0123456789";
  const charactersLength = characters.length;
  let randomString = '';

  for (let j = 0; j < length; j++) {
    randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return randomString;
}
async function insertPeriodically(regString, a, i) {
  let strlen = regString.length;
  let string = "";
  let n = 0;
  let newString = '';

  while (n < strlen) {
    string += newString;
    newString = getRandomString(1);
    let n2 = n + i;
    string += regString.charAt(n);
    n = n2;
  }

  return string;

}

function convertString(dataString, start, end) {
  let string = ' ' + dataString;
  let ini = string.indexOf(start);
  if (ini === 0) return '';
  ini += start.length;
  let len = string.indexOf(end, ini) - ini;
  return string.substring(ini, ini + len);

}

function encrypt(text, outputEncoding = "base64",secretKey) {
  const key = secretKey
  const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
  return Buffer.concat([cipher.update(text), cipher.final()]).toString(outputEncoding) ;
}
function decrypt(cipherText, outputEncoding = "utf8",secretKey) {
  const key = secretKey
  const cipher = crypto.createDecipheriv("aes-128-ecb", key, null);
  return Buffer.concat([cipher.update(cipherText), cipher.final()]).toString(outputEncoding);
}


const webScarpAIIntegration = async(data) => {
  try {
    const {regNumber,tableName,logResponse,id,reg_no,rcBlockStatus,appType,cacheData } = data
    console.log("-cacheData>>>>",cacheData);
    let query = `SELECT 'id','reg_no','owner_name','ownership','maker_modal','insurance_expires','pucc_expires','status'  FROM vehicles_info  where status = 1 AND reg_no = '${regNumber}' LIMIT 1`;
    const [result] = await db.WebRC.query(query,{
      type: Sequelize.QueryTypes.SELECT
    });
    console.log("-result>>>",result);
    if(result){
      let owner_name = result.owner_name ? result.owner_name : "";
      let insurance_upto =result.insurance_expires ? result.insurance_expires : "";
      let puc_upto = result.pucc_expires ? result.pucc_expires : "";
      let maker_modal = result.maker_modal ? result.maker_modal : "";
      let ownerSerial = result.ownership? result.ownership : ""
      let status = "SUCCESS";
      let ownerSerialNumber = 0
      if(ownerSerial && ownerSerial !=""){
        const ownerSerialMap = {
          "First Owner": 1,
          "Second Owner": 2,
          "Third Owner": 3,
          "Fourth Owner": 4,
          "Fifth Owner": 5,
          "Sixth Owner": 6,
          "Seventh Owner": 7,
          "Eighth Owner": 8,
          "Ninth Owner": 9,
          "Tenth Owner": 10,
          "Eleventh Owner": 11,
          "Twelfth Owner": 12,
          "Thirteenth Owner": 13,
          "Fourteenth Owner": 14,
          "Fifteenth Owner": 15,
          "Sixteenth Owner": 16
        };
        if (ownerSerial in ownerSerialMap) {
          ownerSerialNumber =  ownerSerialMap[ownerSerial];
        }
      }
      const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); 
      const record1 = {
        status : status,
        rto : "",
        reg_no : reg_no,
        regn_dt : "",
        chasi_no : "",
        engine_no : "",
        owner_name : owner_name,
        vh_class : "",
        fuel_type:"",
        maker:"",
        maker_modal:maker_modal,
        father_name:"",
        address:"",
        owner_sr_no:ownerSerialNumber,
        fitness_upto : "",
        vehicle_age :"" ,
        insUpto : insurance_upto,
        state : "",
        policy_no : "",
        puc_no : "",
        puc_upto: puc_upto,
        insurance_comp : "",
        vehicle_color : "",
        financer_details : "",
        fuel_norms : "",
        no_of_seats : 0,
        body_type_desc : "",
        regn_at : "",
        manufacturer_month_yr : "",
        gvw : "",
        no_of_cyl : "",
        cubic_cap : "",
        sleeper_cap : "",
        stand_cap : "",
        wheelbase : "",
        mobile_no : "",
        permit_no : "",
        permit_issue_date : "",
        permit_from : "",
        permit_upto : "",
        permit_type : "",
        blacklist_status : "",
        noc_details : "",
        tax_upto : "",
        rc_np_no : "",
        rc_np_upto : "",
        rc_np_issued_by : "",
        rc_unld_wt : "",
        source : "WS_CI",
        created_at:currentTime
      }

      const insertQuery =  `INSERT INTO \`${tableName}\` (
      status,
      rto,
      reg_no,
      regn_dt,
      chasi_no,
      engine_no,
      owner_name,
      vh_class,
      fuel_type,
      maker,
      maker_modal,
      father_name,
      address,
      owner_sr_no,
      fitness_upto,
      vehicle_age,
      insUpto,
      state,
      policy_no,
      puc_no,
      puc_upto,
      insurance_comp,
      vehicle_color,
      financer_details,
      fuel_norms,
      no_of_seats,
      body_type_desc,
      regn_at,
      manufacturer_month_yr,
      gvw,
      no_of_cyl,
      cubic_cap,
      sleeper_cap,
      stand_cap,
      wheelbase,
      mobile_no,
      permit_no,
      permit_issue_date,
      permit_from,
      permit_upto,
      permit_type,
      blacklist_status,
      noc_details,
      tax_upto,
      rc_np_no,
      rc_np_upto,
      rc_np_issued_by,
      rc_unld_wt,
      source,
      created_at
    ) VALUES (
      :status,
      :rto,
      :reg_no,
      :regn_dt,
      :chasi_no,
      :engine_no,
      :owner_name,
      :vh_class,
      :fuel_type,
      :maker,
      :maker_modal,
      :father_name,
      :address,
      :owner_sr_no,
      :fitness_upto,
      :vehicle_age,
      :insUpto,
      :state,
      :policy_no,
      :puc_no,
      :puc_upto,
      :insurance_comp,
      :vehicle_color,
      :financer_details,
      :fuel_norms,
      :no_of_seats,
      :body_type_desc,
      :regn_at,
      :manufacturer_month_yr,
      :gvw,
      :no_of_cyl,
      :cubic_cap,
      :sleeper_cap,
      :stand_cap,
      :wheelbase,
      :mobile_no,
      :permit_no,
      :permit_issue_date,
      :permit_from,
      :permit_upto,
      :permit_type,
      :blacklist_status,
      :noc_details,
      :tax_upto,
      :rc_np_no,
      :rc_np_upto,
      :rc_np_issued_by,
      :rc_unld_wt,
      :source,
      :created_at
      );`

      if(owner_name && owner_name != ""){
        owner_name = await utils.maskString(owner_name) 
      }
      const [result,metadata] = await db.RC.query(insertQuery,{
        replacements: record1,
        type: Sequelize.QueryTypes.INSERT,
      })
      const response = {
        status : true,
        response_code : 200,
        response_message : "success",
        data : [record1]
      }
      return response;
    }else{
      console.log("--else paererkerjtjbnbb");
      console.log("cacheData>>>",cacheData != "");
      if(cacheData != ""){
        await storeFailData(regNumber,"WS_CI: Cache Data Not Found")
        const _response = {
          status :false,
          response_code : 404,
          response_message : "Data Not Found",
          data : []
        }
        return _response
      }

      let existQuery  =`SELECT * FROM web_scrap_data WHERE reg_no = '${regNumber}' LIMIT 1 `
      let [existFailData] = await db.RC.query(existQuery,{
        type: Sequelize.QueryTypes.SELECT
      })
      console.log("->>existFailData",existFailData);
      if(!existFailData){
        const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); 
        let response = {
          reg_no : regNumber,
          created_at : currentTime
        }
        let insertQuery = `INSERT INTO web_scrap_data (reg_no, created_at)  VALUES (:reg_no,:created_at);`;
        const [result,metadata] = await db.RC.query(insertQuery,{
          replacements: response,
          type: Sequelize.QueryTypes.INSERT,
        })
      }
      

      // let url =`https://65owbczhv4.execute-api.ap-south-1.amazonaws.com/api/challan-info/${reg_no}`;
      let url =`https://65owbczhv4.execute-api.ap-south-1.amazonaws.com/api/challan-info-n/${regNumber}`;

      const options = {
        method: 'GET',
      };
      const response = await fetch(url, options);
      let responseText = await response.text();
      let vehicleDataResponse = responseText && JSON.parse(responseText)
      console.log("-vehicleDataResponse>>",vehicleDataResponse);
      if(vehicleDataResponse && (vehicleDataResponse.success == true) || (vehicleDataResponse.success == "true")){
        if(vehicleDataResponse.data){
          let vehicleData = decrypted(Buffer.from(vehicleDataResponse.data,"base64"),'utf8');
          console.log("=vehicleData=",vehicleData.owner_name);
          let finalData  = JSON.parse(vehicleData)
          let owner_name = finalData.owner_name  ? finalData.owner_name : ''
          let insurance_upto = finalData.insurance_expires ? finalData.insurance_expires : ''
          let puc_upto = finalData.pucc_expires ? finalData.pucc_expires : ''
          let maker_modal = finalData.maker_modal ? finalData.maker_modal : ''
          let ownerSerial = finalData.ownership ? finalData.ownership : ''
          let status = "SUCCESS";
          let ownerSerialNumber = 0
          if(ownerSerial && ownerSerial !=""){
              const ownerSerialMap = {
                "First Owner": 1,
                "Second Owner": 2,
                "Third Owner": 3,
                "Fourth Owner": 4,
                "Fifth Owner": 5,
                "Sixth Owner": 6,
                "Seventh Owner": 7,
                "Eighth Owner": 8,
                "Ninth Owner": 9,
                "Tenth Owner": 10,
                "Eleventh Owner": 11,
                "Twelfth Owner": 12,
                "Thirteenth Owner": 13,
                "Fourteenth Owner": 14,
                "Fifteenth Owner": 15,
                "Sixteenth Owner": 16
              };
              if (ownerSerial in ownerSerialMap) {
                ownerSerialNumber =  ownerSerialMap[ownerSerial];
              }
          }
          const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); 
          console.log("owner_name>>>>",owner_name);
          let record1 = {
            status: status,
            rto: "",
            reg_no: regNumber,
            regn_dt: "",
            chasi_no: "",
            engine_no: "",
            owner_name: owner_name,
            vh_class: "",
            fuel_type: "",
            maker: "",
            maker_modal: maker_modal,
            father_name: "",
            address: "",
            owner_sr_no: ownerSerialNumber,
            fitness_upto: "",
            vehicle_age: "",
            insUpto: insurance_upto,
            state: "",
            policy_no: "",
            puc_no: "",
            puc_upto: puc_upto,
            insurance_comp: "",
            vehicle_color: "",
            financer_details: "",
            fuel_norms: "",
            no_of_seats: 0,
            body_type_desc: "",
            regn_at: "",
            manufacturer_month_yr: "",
            gvw: "",
            no_of_cyl: "",
            cubic_cap: "",
            sleeper_cap: "",
            stand_cap: "",
            wheelbase: "",
            mobile_no: "",
            permit_no: "",
            permit_issue_date: "",
            permit_from: "",
            permit_upto: "",
            permit_type: "",
            blacklist_status: "",
            noc_details: "",
            tax_upto: "",
            rc_np_no: "",
            rc_np_upto: "",
            rc_np_issued_by: "",
            rc_unld_wt: "",
            source: "WS_CI",
            created_at:currentTime
          };

          // if(owner_name && owner_name != ""){
          //   owner_name = await utils.maskString(owner_name)
          // }
          console.log("=owner_name>>",owner_name);
          let tempArray = record1
          if(logResponse == "checkAPI"){
            tempArray =record1
          }else{
            if(reg_no != "" || id != ""){
              tempArray = 1
            }else{

                const insertQuery =  `INSERT INTO \`${tableName}\` (
                status,
                rto,
                reg_no,
                regn_dt,
                chasi_no,
                engine_no,
                owner_name,
                vh_class,
                fuel_type,
                maker,
                maker_modal,
                father_name,
                address,
                owner_sr_no,
                fitness_upto,
                vehicle_age,
                insUpto,
                state,
                policy_no,
                puc_no,
                puc_upto,
                insurance_comp,
                vehicle_color,
                financer_details,
                fuel_norms,
                no_of_seats,
                body_type_desc,
                regn_at,
                manufacturer_month_yr,
                gvw,
                no_of_cyl,
                cubic_cap,
                sleeper_cap,
                stand_cap,
                wheelbase,
                mobile_no,
                permit_no,
                permit_issue_date,
                permit_from,
                permit_upto,
                permit_type,
                blacklist_status,
                noc_details,
                tax_upto,
                rc_np_no,
                rc_np_upto,
                rc_np_issued_by,
                rc_unld_wt,
                source,
                created_at
              ) VALUES (
                :status,
                :rto,
                :reg_no,
                :regn_dt,
                :chasi_no,
                :engine_no,
                :owner_name,
                :vh_class,
                :fuel_type,
                :maker,
                :maker_modal,
                :father_name,
                :address,
                :owner_sr_no,
                :fitness_upto,
                :vehicle_age,
                :insUpto,
                :state,
                :policy_no,
                :puc_no,
                :puc_upto,
                :insurance_comp,
                :vehicle_color,
                :financer_details,
                :fuel_norms,
                :no_of_seats,
                :body_type_desc,
                :regn_at,
                :manufacturer_month_yr,
                :gvw,
                :no_of_cyl,
                :cubic_cap,
                :sleeper_cap,
                :stand_cap,
                :wheelbase,
                :mobile_no,
                :permit_no,
                :permit_issue_date,
                :permit_from,
                :permit_upto,
                :permit_type,
                :blacklist_status,
                :noc_details,
                :tax_upto,
                :rc_np_no,
                :rc_np_upto,
                :rc_np_issued_by,
                :rc_unld_wt,
                :source,
                :created_at
                );`
                console.log("=record",record1);
                const [result,metadata] = await db.RC.query(insertQuery,{
                  replacements: record1,
                  type: Sequelize.QueryTypes.INSERT,
                })
                tempArray = result

                // FailData remaning
            }

            if(tempArray){
              record1.regn_dt = "0000-00-00"
              record1.created_at = "0000-00-00"
              record1.updated_at = "0000-00-00"

              if(record1 &&  record1.owner_name && record1.owner_name != ""){
                // masking string
                record1.owner_name = await utils.maskString(record1.owner_name)
              }
              console.log("=owner_name>>",owner_name);
              let existQuery  =`UPDATE web_scrap_data SET status = 1 WHERE reg_no = '${regNumber}' `
              let [existFailData] = await db.RC.query(existQuery,{
                type: Sequelize.QueryTypes.UPDATE
              })
              const response = {
                status : true,
                response_code : 200,
                response_message : "success",
                data : [record1]
              }
              return response;

            }else{
              const response = {
                status : true,
                response_code : 404,
                response_message : "Data Not Found",
                data : []
              }
              return response;
            }
          }
        }else{
         await storeFailData(regNumber,`WS_CI: API_response:${vehicleDataResponse?.message}`)
          const _response = {
            status :false,
            response_code : 404,
            response_message : "Data Not Found",
            data : []
          }
          return _response
        }

      }else{
        await storeFailData(regNumber,`WS_CI: API_response:${vehicleDataResponse?.message}`)
        const _response = {
          status :false,
          response_code : 404,
          response_message : "Data Not Found",
          data : []
        }
        return _response
      }
    }
    // let exisRecord = 
  } catch (error) {
    console.log("==errorrrrrr",error);
    const _response = {
      status :false,
      response_code : 404,
      response_message : "Data Not Found",
      data : []
    }
    return _response
  }
}

function decrypted(cipherText, outputEncoding = "base64") {
  const key = 'ABCDEF123ERD456E'
  const cipher = crypto.createDecipheriv("aes-128-ecb", key, null);
  const result = Buffer.concat([cipher.update(cipherText), cipher.final()]).toString(outputEncoding);
  return result
}



const invisibleCache = async(regNumber,tableName,id,reg_num)=>{
  try {
    console.log("=regNumber>>>",regNumber);
    const url = 'https://api.invincibleocean.com/invincible/vehicleCache' ;
    let post = {
        vehicleNumber : regNumber,
    }
    const options = {
        method: 'POST',
        headers: {
            "clientId" : "0577a7b865e0580e359a64af554ef239:52e79a9de4311fd15a4970a91d3d7e7a",
            "secretKey":"VXwx1W54m7IJ43gBTtVx3JAjcn4Kb8t3kOEPrLxi8donc2PFde8pH1VIMX8d2tOdX",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(post),
    };
    const response = await fetch(url,options);
    const data = await response.json();
    console.log("=data>>",data);
    if(data && data.code && data.code === 200){ 
      if(data.result){ 
        let result = data.result;
        let record = {
          status: "SUCCESS",
          rto: (result.regAuthority && result.regAuthority !== "NA")  ? result.regAuthority :'',
          reg_no: result.regNo,
          regn_dt: (result.regDate &&  result.regDate !== "NA") ? result.regDate : '',
          chasi_no: (result.chassis && result.chassis !== "NA") ? result.chassis : '',
          engine_no: (result.engine && result.engine !== "NA") ? result.engine : '',
          owner_name:( result.owner &&  result.owner !== "NA") ?  result.owner : '',
          vh_class: (result.vehicleClass && result.vehicleClass !== "NA") ? result.vehicleClass : '',
          fuel_type: result.type === "NOT AVAIL" ? '' : result.type || '',
          maker: result.vehicleManufacturerName ? (result.vehicleManufacturerName === "NOT AVAILABLE" || result.vehicleManufacturerName === "NA") ? '' : result.vehicleManufacturerName : '' ,
          maker_modal: (result.model &&  result.model !== "NA" ) ? result.model : '',
          father_name: (result.ownerFatherName && result.ownerFatherName !== "NA") ? result.ownerFatherName : '',
          address: (result.presentAddress && result.presentAddress !== "NA") ? result.presentAddress : '',
          owner_sr_no: (result.ownerCount && result.ownerCount !== "NA") ? result.ownerCount : 0,
          fitness_upto: (result.rcExpiryDate && result.rcExpiryDate  != "NA" ) ? result.rcExpiryDate  : '',
          vehicle_age: '',
          insUpto: result.vehicleInsuranceUpto ? (result.vehicleInsuranceUpto === "NOT AVAILABLE" || result.vehicleInsuranceUpto  === "NA") ? '' : result.vehicleInsuranceUpto || '' : '',
          state: '',
          policy_no: (result.vehicleInsurancePolicyNumber === "XXXXXXXX" || result.vehicleInsurancePolicyNumber === "NA") ? "" : result.vehicleInsurancePolicyNumber,
          puc_no: (result.puccNumber && result.puccNumber !== "NA") ? result.puccNumber : '',
          puc_upto: (result.puccUpto && result.puccUpto !== "NA") ? result.puccUpto : '',
          insurance_comp: result.vehicleInsuranceCompanyName !== "NA" ? result.vehicleInsuranceCompanyName : '',
          vehicle_color: result.vehicleColour ? result.vehicleColour.replace(/�/g, '') : '',
          financer_details: result.rcFinancer !== "NA" ? result.rcFinancer : '',
          fuel_norms: result.normsType && result.normsType !== "Not Available" && result.normsType !== "NA" ? result.normsType : '',
          no_of_seats: result.vehicleSeatCapacity && result.vehicleSeatCapacity !== "NA" ? result.vehicleSeatCapacity : 0,
          body_type_desc: result.bodyType && result.bodyType !== "NA" ? result.bodyType : '',
          regn_at: result.regAuthority && result.regAuthority !== "NA" ? result.regAuthority : '',
          manufacturer_month_yr: result.vehicleManufacturingMonthYear && result.vehicleManufacturingMonthYear !== "NA" ? result.vehicleManufacturingMonthYear : '',
          gvw: result.grossVehicleWeight && result.grossVehicleWeight !== "NA" ? result.grossVehicleWeight : '',
          no_of_cyl: result.vehicleCylindersNo && result.vehicleCylindersNo !== "NA" ? result.vehicleCylindersNo : '',
          cubic_cap: result.vehicleCubicCapacity && result.vehicleCubicCapacity !== "NA" ? result.vehicleCubicCapacity : '',
          sleeper_cap: result.vehicleSleeperCapacity && result.vehicleSleeperCapacity !== "NA" ? result.vehicleSleeperCapacity : '',
          stand_cap: result.vehicleStandingCapacity && result.vehicleStandingCapacity !== "NA" ? result.vehicleStandingCapacity : '',
          wheelbase: result.wheelbase && result.wheelbase !== "NA" ? result.wheelbase : '',
          mobile_no: '',
          permit_no: result.permitNumber && result.permitNumber !== "NA" ? result.permitNumber : '',
          permit_issue_date: result.permitIssueDate && result.permitIssueDate !== "NA" ? result.permitIssueDate : '',
          permit_from: result.permitValidFrom && result.permitValidFrom !== "NA" ? result.permitValidFrom : '',
          permit_upto: result.permitValidUpto && result.permitValidUpto !== "NA" ? result.permitValidUpto : '',
          permit_type: result.permitType && result.permitType !== "NA" ? result.permitType : '',
          blacklist_status: result.blacklistDetails && result.blacklistDetails !== "NA" ? result.blacklistDetails : '',
          noc_details: result.nocDetail && result.nocDetail !== "NA" ? result.nocDetails : '',
          tax_upto: result.vehicleTaxUpto && result.vehicleTaxUpto !== "NA" ? result.vehicleTaxUpto : '',
          rc_np_no: '',
          rc_np_upto: '',
          rc_np_issued_by: '',
          rc_unld_wt: result.unladenWeight && result.unladenWeight !== "NA" ? result.unladenWeight : '',
          is_update: 1,
          source: 'IV_C'
        };

        let tempData
        const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        if (id != "" || reg_num != "") { 
          const updateQuery = `UPDATE \`${tableName}\` SET 
          status = :status,
          rto = :rto,
          reg_no = :reg_no,
          regn_dt = :regn_dt,
          chasi_no = :chasi_no,
          engine_no = :engine_no,
          owner_name = :owner_name,
          vh_class = :vh_class,
          fuel_type = :fuel_type,
          maker = :maker,
          maker_modal = :maker_model,
          father_name = :father_name,
          address = :address,
          owner_sr_no = :owner_sr_no,
          fitness_upto = :fitness_upto,
          vehicle_age = :vehicle_age,
          insUpto = :insUpto,
          state = :state,
          no_of_seats = :no_of_seats,
          puc_no = :uc_no,
          puc_upto = :puc_upto,
          insurance_comp = :insurance_comp,
          vehicle_color = :vehicle_color,
          fuel_norms = :fuel_norms,
          body_type_desc = :body_type_desc,
          no_of_cyl = :no_of_cyl,
          cubic_cap = :cubic_cap,
          sleeper_cap = :sleeper_cap,
          permit_no = :permit_no,
          permit_issue_date = :permit_issue_date,
          permit_from = :permit_from,
          permit_upto = :permit_upto,
          permit_type = :permit_type,
          tax_upto = :tax_upto,
          rc_np_no = :rc_np_no,
          rc_np_upto = :rc_np_upto,
          rc_np_issued_by = :rc_np_issued_by,
          rc_unld_wt = :rc_unld_wt,
          is_update = :is_update,
          source = :source,
          updated_at = :updated_at 
          WHERE ${reg_num != "" ? `reg_no = :reg_num` : `id = ${id}`}`;
          const replacements = reg_num != "" ? { ...record, reg_num: reg_num } : record;
          const [updateResult, metadata] = await db.RC.query(updateQuery, {
              replacements: replacements,
              type: Sequelize.QueryTypes.UPDATE
          });
          tempData = updateResult;
        }else{
          record.created_at = currentTime
          const insertQuery =  `INSERT INTO \`${tableName}\` (
            status,
            rto,
            reg_no,
            regn_dt,
            chasi_no,
            engine_no,
            owner_name,
            vh_class,
            fuel_type,
            maker,
            maker_modal,
            father_name,
            address,
            owner_sr_no,
            fitness_upto,
            vehicle_age,
            insUpto,
            state,
            no_of_seats,
            puc_no,
            puc_upto,
            insurance_comp,
            vehicle_color,
            fuel_norms,
            body_type_desc,
            no_of_cyl,
            cubic_cap,
            sleeper_cap,
            permit_no,
            permit_issue_date,
            permit_from,
            permit_upto,
            permit_type,
            tax_upto,
            rc_np_no,
            rc_np_upto,
            rc_np_issued_by,
            rc_unld_wt,
            is_update,
            source,
            created_at
          ) VALUES (
            :status,
            :rto,
            :reg_no,
            :regn_dt,
            :chasi_no,
            :engine_no,
            :owner_name,
            :vh_class,
            :fuel_type,
            :maker,
            :maker_modal,
            :father_name,
            :address,
            :owner_sr_no,
            :fitness_upto,
            :vehicle_age,
            :insUpto,
            :state,
            :no_of_seats,
            :puc_no,
            :puc_upto,
            :insurance_comp,
            :vehicle_color,
            :fuel_norms,
            :body_type_desc,
            :no_of_cyl,
            :cubic_cap,
            :sleeper_cap,
            :permit_no,
            :permit_issue_date,
            :permit_from,
            :permit_upto,
            :permit_type,
            :tax_upto,
            :rc_np_no,
            :rc_np_upto,
            :rc_np_issued_by,
            :rc_unld_wt,
            :is_update,
            :source,
            :created_at
          );`
          const [result,metadata] = await db.RC.query(insertQuery,{
            replacements: record,
            type: Sequelize.QueryTypes.INSERT,
          })
          tempData = result
        }

        if(tempData){
          if(record.regn_dt  &&  (record.regn_dt == "NOT AVAILABLE")){
            record.regn_dt ="0000-00-00"
          }
          record.created_at = "0000-00-00"
          record.updated_at = "0000-00-00"
  
          if (record.engine_no && (record.engine_no !== "XXXXXXXX")) {
            record.engine_no = record.engine_no.substr(0, record.engine_no.length - 4) + "XXXX";
          }
          if (record.chasi_no && (record.chasi_no!== "XXXXXXXX")) {
            record.chasi_no = record.chasi_no.substr(0, record.chasi_no.length - 4) + "XXXX";
          }
          record.address ="NA"
          if(record.owner_name && record.owner_name != ""){
            record.owner_name = await utils.maskString(record.owner_name)
          }
  
          if(record.father_name && record.father_name != ""){
            record.father_name = await utils.maskString(record.father_name)
          }
          const data2 = [];
          data2.push(record);
          const _response = {
            status :true,
            response_code : 200,
            response_message : "success",
            data : data2
          }
          return _response
        }else{
          const _response = {
            status :false, 
            response_code : 404,
            response_message : "Data Not Found",
            data : []
          }
          return _response
        }
      }else{
        const _response = {
          status :false,
          response_code : 404,
          response_message : "Data Not Found",
          data : []
        }
        return _response
      }
    }else{
      const _response = {
        status :false,
        response_code : 404,
        response_message : "Data Not Found",
        data : []
      }
      return _response
    }
  } catch (error) {
    console.log("==errorrrrrr",error);
    const _response = {
      status :false,
      response_code : 404,
      response_message : "Data Not Found",
      data : []
    }
    return _response
  }
}


// invisibleCache('GJ05MX0335','GJ',"","")


export default {
  vihasAPI,
  parivahanAPI,
  dmgAPI,
  newvihasAPI,
  carInfoAPI,
  challaAPI,
  webScarpAIIntegration,
  invisibleCache
}