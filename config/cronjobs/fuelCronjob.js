import dotenv from 'dotenv'
import FuelState from '../../models/FuelState.js';
import fetch from "node-fetch";
import cheerio from "cheerio";
import moment from 'moment';
import FuelPrice from "../../models/FuelAPI.js"
dotenv.config()
export const getFuelDataByCron = async(req,res) =>  {
    try {
        const isFuelCronRun = process.env.IS_FUEL_CRON_RUN
        console.log("====isFuelCronRun>>>",isFuelCronRun);
        if(isFuelCronRun && (isFuelCronRun == "true")){
            console.log("=calllllllllllllll");
            const petrolDieselPrice = []
            const fuelState = await FuelState.findAll({
                where:{
                    deleted_at : null
                },
                // offset: 20
            })
            // return res.send(fuelState)
            // if(fuelState && fuelState.length){
            //     for (let i = 0; i < fuelState.length; i++) {
            //         const element = fuelState[i];
            //         console.log("=element>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",element.state);
            //         // await getPertorlDieselPrice(element.state)
            //         await getLpgPriceCityWise(element)
            //         // break;
            //     }
            // }
            const _result = await getCngPrice()
            return res.send(_result)
            return res.send({
                status :true,
                message : "Cron run SuccessFully !",
                data :_result
            })
        }else{

        }
    } catch (error) {
        console.log('Error -->>', error)
        return res.send(
            {
                status: false,
                message: "Error Eccoured !",
            },
        );
    }
}

const getPertorlDieselPrice = async(state) =>{
    let petrolPriceUrl = "https://www.petroldieselprice.com/petrol-diesel-price";
    let cities = await getCity(petrolPriceUrl,state)

    let urls = [
        {
            petrol : "https://www.petroldieselprice.com/petrol-rate-in-"
        },
        {
            diesel : "https://www.petroldieselprice.com/diesel-rate-in-"
        }
    ]

    let get_petrol_data = []
    let inserted = 0
    let notInserted = []
    console.log("=cities>>>>",cities.length);
    if(cities.length){
        for (let i = 0; i < cities.length; i++) {
            const cityElement = cities[i];
            // for (let index = 0; index < urls.length; index++) {
            //     const url_element = urls[index];
                let url = "https://www.petroldieselprice.com/petrol-rate-in-"+cityElement.city
                // if(url_element.petrol){
                //     url = cityElement.url
                // }else{
                //     url = url_element.diesel + cityElement.city
                // }
                console.log("==cityElement.city>?>>>>>>>>>>>>>>>>>>>>>>",cityElement.city);
                let urlResponse = await fetch(url);
                const urlTextResponse = await urlResponse.text()
                const city$ = cheerio.load(urlTextResponse);
                const table = city$('table[id="customers"]').eq(0);
                // const row = table.find("tfoot tr")
                // console.log("=row>>>>>>>>>>>>>>>",row.length);
                // for (const iterator of row) {
                //     const tds = city$(iterator)
                //     const fuelTableDate = tds.find("tr td").eq(0).text()
                //     const fuelTablePetrolPrice = tds.find("tr td").eq(1).text()
                //     const fuelTablePetrolPriceDiff = tds.find("tr td").eq(2).text()
                //     const fuelTableDieselPrice = tds.find("tr td").eq(3).text()
                //     const fuelTableDieselPriceDiff = tds.find("tr td").eq(4).text()
                //     let date 
                //     if(fuelTableDate){
                //         date = moment(fuelTableDate ,'DD MMMM YYYY').format('YYYY-MM-DD')
                //     }
                //     let petrolPrice = fuelTablePetrolPrice ? fuelTablePetrolPrice.replace("₹","") : -1
                //     let petrolDiff = fuelTablePetrolPriceDiff ? fuelTablePetrolPriceDiff.replace("₹","") : -1
                //     let dieselPrice = fuelTableDieselPrice ? fuelTableDieselPrice.replace("₹","") : -1
                //     let dieselDiff = fuelTableDieselPriceDiff ? fuelTableDieselPriceDiff.replace("₹","") : -1
    
    
                //     let data = {
                //         main_id  : 1,
                //         company_id  : 'BPCL',
                //         state  : state.toUpperCase(),
                //         city  : cityElement.city.toUpperCase(),
                //         petrol_price  : petrolPrice,
                //         extra_premium_petrol_price  : 0,
                //         diesel_price : dieselPrice,
                //         extra_premium_diesel_price  : 0,
                //         date  : date,
                //         petrol_diff  : petrolDiff,
                //         diesel_diff  : dieselDiff,
                //     }
                //     let exist = await FuelPrice.findOne({
                //         where : {
                //             state : state.toUpperCase(),
                //             city :cityElement.city.toUpperCase(),
                //             date : date
                //         }
                //     })
                //     // console.log("=exist",exist);
                //     if(!exist){
                //         const insertedResult = await FuelPrice.create(data)
                //         if(insertedResult){
                //             inserted++;
                //         }else{
                //             notInserted.push(data)
                //         }
                //     }else{
                //         // console.log("===updated value ==========");
                //         //update the existing one with new values
                //         await FuelPrice.update(data,{
                //             where :{
                //                 id : exist.id
                //             }
                //         })
                //     }
                // }
                const fuelTableDate = table.find("tfoot tr td").eq(0).text()
                const fuelTablePetrolPrice = table.find("tfoot tr td").eq(1).text()
                const fuelTablePetrolPriceDiff = table.find("tfoot tr td").eq(2).text()
                const fuelTableDieselPrice = table.find("tfoot tr td").eq(3).text()
                const fuelTableDieselPriceDiff = table.find("tfoot tr td").eq(4).text()
                let date 
                if(fuelTableDate){
                    date = moment(fuelTableDate ,'DD MMMM YYYY').format('YYYY-MM-DD')
                }
                let petrolPrice = fuelTablePetrolPrice ? fuelTablePetrolPrice.replace("₹","").trim() : -1
                let petrolDiff = fuelTablePetrolPriceDiff ? fuelTablePetrolPriceDiff.replace("₹","").trim() : -1
                let dieselPrice = fuelTableDieselPrice ? fuelTableDieselPrice.replace("₹","").trim() : -1
                let dieselDiff = fuelTableDieselPriceDiff ? fuelTableDieselPriceDiff.replace("₹","").trim() : -1


                let data = {
                    main_id  : 1,
                    company_id  : 'BPCL',
                    state  : state.toUpperCase(),
                    city  : cityElement.city.toUpperCase(),
                    petrol_price  : petrolPrice,
                    extra_premium_petrol_price  : 0,
                    diesel_price : dieselPrice,
                    extra_premium_diesel_price  : 0,
                    date  : date,
                    petrol_diff  : petrolDiff,
                    diesel_diff  : dieselDiff,
                }
                console.log("=data",data);
                if(table.text() != ""){
                    let exist = await FuelPrice.findOne({
                        where : {
                            state : state.toUpperCase(),
                            city :cityElement.city.toUpperCase(),
                            date : date
                        }
                    })
                    // console.log("=exist",exist);
                    if(!exist){
                        const insertedResult = await FuelPrice.create(data)
                        if(insertedResult){
                            inserted++;
                        }else{
                            notInserted.push(data)
                        }
                    }else{
                        // console.log("===updated value ==========");
                        //update the existing one with new values
                        await FuelPrice.update(data,{
                            where :{
                                id : exist.id
                            }
                        })
                    }
                }
               
                // console.log("=data>>>>",data);
            // }
            console.log("===iiiiii>>>>>>>>>>>>>>>>>",i);
        }
    }
    console.log("=calllllllllllllllllllllllFinsihhhhhhhhhhhhhhhhhhhhh>>>>>>>>>>>>>>>>>>>>");
    const temp = {
        inserted : inserted,
        not_inserted : notInserted.length ? notInserted : "All data sucessfully inserted.."
    }

    return temp
}

const getCity = async(url,state) =>{
    const options = {
        method: 'GET',
    };
    const response = await fetch(url, options);
    const responseText = await response.text()
    // console.log("=responseText>>>",responseText);
    const htmlText = cheerio.load(responseText);
    const link = htmlText(`a:contains(${state})`).attr('href');
    const cityUrl = new URL(link, url);
    const cityResponse = await fetch(cityUrl);
    const cityHtml = await cityResponse.text();
    const city$ = cheerio.load(cityHtml);
    const table = city$('table[id="customers"]').eq(3);
    const h2Tag = city$('h2:contains("Find Petrol diesel Price in")');
    const table2 = h2Tag.next();
    const rows = table.find('tr');
    const tfooter = table2.find('tfoot tr td a')
    const cities = [];
    tfooter.each((index, row) => {
        const tds = city$(row)
        const temp = {
            url: "https://www.petroldieselprice.com" + tds.attr("href").trim(),
            city: tds.text().trimRight()
        };
        cities.push(temp)
    });
    return cities;

}

const getLpgPriceCityWise = async(element) =>{
    try {
        let lpglPriceUrl = "https://www.petroldieselprice.com/auto-lpg-gas-price-in-";
        let cities = await getCity("https://www.petroldieselprice.com/petrol-diesel-price",element.state)
        let inserted = 0
        let notInserted = []
        let insertedRecord = []
        let updatedRecord = []
        let notUpdatedRecord = []

        if(cities && cities.length){
            for (let i = 0; i < cities.length; i++) {
                const elementCity = cities[i];
                console.log("===elementCity>>>>",elementCity.city);
                let state = element.state.replace(" ","-")
                let url = `${lpglPriceUrl+elementCity.city+"/"+state}`
                const cityResponse = await fetch(url);
                const cityHtml = await cityResponse.text();
                const city$ = cheerio.load(cityHtml);
                const table = city$('table[id="customers"]').eq(0);
                const lpgPriceData = table.find("tfoot tr td").eq(1)
                let lpgPrice = lpgPriceData.text() ? lpgPriceData.text() : -1
                let date = moment().format('YYYY-MM-DD')
                let data = {
                    main_id  : 1,
                    company_id  : 'BPCL',
                    state  : element.state.toUpperCase(),
                    city  : elementCity.city.toUpperCase(),
                    lpg_price  : lpgPrice !== -1 ? lpgPrice.replace(/Rs\.|\/|Litre/g,'').trim() : -1,
                    date  : date,
                }
                let exist = await FuelPrice.findOne({
                    where : {
                        state : element.state.toUpperCase(),
                        city :elementCity.city.toUpperCase(),
                        date : date
                    }
                })
                if(!exist){
                    const insertedResult = await FuelPrice.create(data)
                    if(insertedResult){
                        inserted++;
                        insertedRecord.push(insertedResult)
                    }else{
                        notInserted.push(data)
                    }
                }else{
                    console.log("===updated value ==========");
                    //update the existing one with new values
                    const updateresult = await FuelPrice.update(data,{
                        where :{
                            id : exist.id
                        }
                    })
                    if(updateresult){
                        updatedRecord.push(updateresult)
                    }else{
                        notUpdatedRecord.push(data)
                    }
                }
            }
        }
        const temp = {
            inserted : inserted,
            not_inserted : notInserted.length ? notInserted : "All data sucessfully inserted..",
            updated_record: updatedRecord.length ? updatedRecord : 0,
            inserted_record : insertedRecord.length ? insertedRecord : 0,
            not_updated_record : notUpdatedRecord.length ? notUpdatedRecord : 0
        }
        console.log("=temp>>>>>>>>>>>",temp);
        return temp
    } catch (error) {
        console.log('Error -->>', error)
        // return res.send(
        //     {
        //         status: false,
        //         message: "Error Eccoured !",
        //     },
        // );
    }
}

const getCngPrice = async(element) =>{
    try {
        let cnglPriceUrl = "https://www.mypetrolprice.com/cng-price-in-india.aspx";
        const cngResponse = await fetch(cnglPriceUrl);
        const cngHtml = await cngResponse.text();
        const price$ = cheerio.load(cngHtml);
        // let cityCngPrice = {}
        let cityCngPrice = []
        let cityTotalPrice ={}

        const table = price$('.container .sixteen').each((index, element) => {
            const tds = price$(element)
            if(tds.find('.txtC') && tds.find('.txtC').length > 1){
                const price = price$(element).text();
                // console.log("=price>>>",price);

                if(tds.find('.txtC .SF')){
                    const filterTable = tds.find('.txtC .SF')
                    // console.log("=filterTable",filterTable);
                    if(filterTable.length){
                        filterTable.each((index, row)  => {
                            let temp ={}
                            const elementFilter = price$(row)
                            const cityText = elementFilter.find('.CH').text().replace(/[^A-Za-z\-]/g, '');
                            const city = cityText.toUpperCase()
                            temp.city = city
                            let price = elementFilter.find('.txtC').text()
                            price =  price.split(" (");
                            temp.cng_price = price[0].replace(/[^\d.-]/g,'');
                            temp.cng_diff_price = price[1].replace(/[^\d.-]/g,'');
                            let state 


                            if (temp['city'] == 'DELHI'){
                                temp['city'] = 'NEW DELHI';
                                state = 'DELHI';
                            }
                            if (temp['city'] == 'HYDERABAD'){
                                state = 'TELANGANA';
                            }
                            if (temp['city'] == 'VIJAYAWADA'){
                                state = 'ANDHRA PRADESH';
                            }
                            if (temp['city'] == 'GURGAON' || temp['city'] == 'FARIDABAD'){
                                state = 'HARYANA';
                            }
                            if (temp['city'] == 'AHMEDABAD' || temp['city'] == 'VADODARA' || temp['city'] == 'GANDHINAGAR'){
                                state = 'GUJARAT';
                            }
                            if (temp['city'] == 'GANDHINAGAR'){
                                state = 'GUJARAT';
                            }
                            if (temp['city'] == 'VADODARA'){
                                state = 'GUJARAT';
                            }
                            if (temp['city'] == 'FARIDABAD'){
                                state = 'HARYANA';
                            }
                            if (temp['city'] == 'GWALIOR' || temp['city'] == 'INDORE' || temp['city'] == 'UJJAIN'){
                                state = 'MADHYA PRADESH';
                            }
                            if (temp['city'] == 'DHULE' || temp['city'] == 'MUMBAI' || temp['city'] == 'NASHIK' || temp['city'] == 'NAVIMUMBAI' || temp['city'] == 'PUNE' || temp['city'] == 'THANE'){
                                state = 'MAHARASHTRA';
                            }
                            if (temp['city'] == 'AMRITSAR'){
                                state = 'PUNJAB';
                            }
                            
                            if (temp['city'] == 'AJMER' || temp['city'] == 'KOTA'){
                                state = 'RAJASTHAN';
                            }
                            
                            if (temp['city'] == 'AGRA' || temp['city'] == 'FIROZABAD' || temp['city'] == 'GHAZIABAD' || temp['city'] == 'GREATERNOIDA' || temp['city'] == 'KANPUR' || temp['city'] == 'LUCKNOW' || temp['city'] == 'MEERUT' || temp['city'] == 'NOIDA' || temp['city'] == 'UNNAO'){
                                state = 'UTTAR PRADESH';
                            }
                            // let data = {
                            //     temp['city'] : 
                            // }
                            // cityCngPrice[state] = temp
                            // if(cityCngPrice.includes(state)){
                            //     cityCngPrice
                            // }
                            // cityCngPrice[state] [temp['city']] = temp
                            // cityCngPrice.push({[state] : temp})
                            // cityCngPrice[state] = {};
                            // cityCngPrice[state][temp.city] = temp;
                            temp.state = state
                            const checkCity = cityCngPrice.filter(item => Object.keys(item)[0] === state);
                            console.log("=checkCity>>>>",checkCity);
                            // if(checkCity && checkCity.length){

                            // }else{
                                cityCngPrice.push(temp)
                                // cityTotalPrice[state] = 
                                // cityCngPrice.push({[state] : [{[temp.city] : temp}]})
                            // }

                            
                            // $city_cng_price[$state][$temp['city']] = $temp;

                            // console.log("===elementFilter by the elemebt>>>>>=",city,"-price>>>>>>>>>>>>>>>>>>>>",price);
                        });
                    }
                }
            }
            // cngPrices.push(price);
        });
      
        if(cityCngPrice && cityCngPrice.length ){
            for (let i = 0; i < cityCngPrice.length; i++) {
                const elementCity = cityCngPrice[i];
                if(elementCity.city &&  elementCity.state){
                    let isExist = await FuelPrice.findOne({
                        where: {
                            state : elementCity.state.toUpperCase(),
                            city : elementCity.city.toUpperCase(),
                            date: new Date().toISOString().split('T')[0],
                        },
                        attributes : ["id","state","city"]
                    })
                    if(isExist){
                        console.log("===is EXUdghfvghsf");
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        let responsePrev = await FuelPrice.findOne({
                            where: {
                                state : elementCity.state.toUpperCase(),
                                city : elementCity.city.toUpperCase(),
                                date:yesterday.toISOString().split('T')[0],
                            },
                            attributes : ["id","state","city","cng_price"]
                        })
                        let data = {}
                        console.log("=responsePrev",responsePrev);
                        if(responsePrev){
                            if(responsePrev.cng_price == elementCity.cng_price){
                                data.cng_diff = 0
                            }else{
                                data.cng_diff = elementCity.cng_price
                            }
                            console.log("=responsePrev>>>", typeof responsePrev.cng_price,"--elementCity.cng_price>>>>",typeof elementCity.cng_price);
                        }
                    }
                }
            }
        }
        // console.log("=table",table.text());
        return cityCngPrice
        // const getCngPrice = await cngResponse.find('.container .sixteen').text()
        console.log("=cngResponse",table.find('.txtC').text());
    } catch (error) {
        console.log('Error -->>', error)
        // return res.send(
        //     {
        //         status: false,
        //         message: "Error Eccoured !",
        //     },
        // );
    }
}
