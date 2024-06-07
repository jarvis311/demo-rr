import axios from "axios";
import ResaleVehicleCategoryNew from "../models/ResaleVehicleCategoryNew.js";
import ResaleVehicleCompanyNew from "../models/ResaleVehicleCompanyNew.js";
import ResaleVehicleModelNew from "../models/ResaleVehicleModelNew.js";
import ResaleVehicleTrimNew from "../models/ResaleVehicleTrimNew.js";
import ResaleYearsNew from "../models/ResaleYearsNew.js";
import database from "../config/database.js";
import ResaleVehiclePriceNew from "../models/ResaleVehiclePriceNew.js";

export const scrappingResaleValue = async (req, res) => {
    try {
        console.log("fdsbfb")
        let fetchCategoryData = await axios.get('https://orangebookvalue.com/get-data/home')
        const categoriesArray = Object.entries(fetchCategoryData?.data?.data?.categories).map(([id, name]) => ({ id, name }));
        for (const categories of categoriesArray) {
            if (categories != 'All Products' && categories != 'Top Products') {
                let createCategory
                const findCetegoryExitOrNot = await ResaleVehicleCategoryNew.findOne({
                    where: {
                        category_name: categories?.name
                    }
                })
                if (findCetegoryExitOrNot) {
                    createCategory = findCetegoryExitOrNot
                } else {
                    createCategory = await ResaleVehicleCategoryNew.create({
                        category_name: categories.name
                    })
                }
                const fetchVehicleBrands = await axios.get(`https://orangebookvalue.com/mmyt?&category_id=${categories?.id?.trim()}&api_version=3`)
                if (fetchVehicleBrands.data.data) {
                    for (const brands of fetchVehicleBrands.data.data) {
                        if (brands?.name != 'All Products' && brands?.name != 'Top Products') {
                            let createCompany
                            const findIsExitOrNot = await ResaleVehicleCompanyNew.findOne({
                                where: {
                                    resale_vehicle_category_id: createCategory?.dataValues?.id,
                                    name: brands?.name
                                }
                            })
                            if (findIsExitOrNot) {
                                createCompany = findIsExitOrNot
                            } else {
                                createCompany = await ResaleVehicleCompanyNew.create({
                                    resale_vehicle_category_id: createCategory?.dataValues?.id,
                                    name: brands?.name
                                })
                            }
                            const fetchvehicleModelData = await axios.get(`https://orangebookvalue.com/mmyt?&category_id=${categories?.id?.trim()}&make=${brands?.name?.trim()?.replace(" ", "%20")}&api_version=3`)
                            if (fetchvehicleModelData.data.data) {
                                for (const model of fetchvehicleModelData.data.data) {
                                    let createModel
                                    const findModelExitOrNot = await ResaleVehicleModelNew.findOne({
                                        where: {
                                            name: model,
                                            resale_vehicle_company_id: createCompany.dataValues.id,
                                        }
                                    })
                                    if (findModelExitOrNot) {
                                        createModel = findModelExitOrNot
                                    } else {
                                        createModel = await ResaleVehicleModelNew.create({
                                            name: model,
                                            resale_vehicle_company_id: createCompany.dataValues.id,
                                            is_cron: 0
                                        })
                                    }
                                    const fetchVehicleYear = await axios.get(`https://orangebookvalue.com/mmyt?&category_id=${categories?.id?.trim()}&make=${brands?.name?.trim()?.replace(" ", "%20")}&model=${model?.trim()?.replace(" ", "%20")}&api_version=3`)
                                    if (fetchVehicleYear?.data?.data) {
                                        console.log('fetchVehicleYear?.data?.data', fetchVehicleYear?.data?.data)
                                        for (const year of fetchVehicleYear.data.data) {
                                            let createVehicleyear
                                            let findVehicleYear = await ResaleYearsNew.findOne({
                                                where: {
                                                    name: year,
                                                    category_id: createCategory?.dataValues?.id,
                                                    resale_vehicle_model_id: createModel.dataValues.id
                                                }
                                            })
                                            if (findVehicleYear) {
                                                createVehicleyear = findVehicleYear
                                            } else {
                                                createVehicleyear = await ResaleYearsNew.create({
                                                    name: year,
                                                    category_id: createCategory?.dataValues?.id,
                                                    resale_vehicle_model_id: createModel.dataValues.id
                                                })
                                            }
                                            const fetchVehicleTrims = await axios.get(`https://orangebookvalue.com/mmyt?&category_id=${categories?.id?.trim()}&make=${brands?.name?.trim()?.replace(" ", "%20")}&model=${model?.trim()?.replace(" ", "%20")}&year=${year?.trim()?.replace(" ", "%20")}&check_obv=1&api_version=3`)
                                            console.log('fetchVehicleTrims?.data?.data===>>', fetchVehicleTrims?.data?.data)
                                            if (fetchVehicleTrims?.data?.data) {
                                                for (const trims of fetchVehicleTrims?.data?.data?.result) {
                                                    let createVehicleTrims
                                                    const findTrimExitOrNot = await ResaleVehicleTrimNew.findOne({
                                                        where: {
                                                            name: trims,
                                                            resale_year_id: createVehicleyear?.dataValues?.id,
                                                            resale_vehicle_model_id: createModel.dataValues.id,
                                                        }
                                                    })
                                                    if (findTrimExitOrNot) {
                                                        createVehicleTrims = findTrimExitOrNot
                                                    } else {
                                                        createVehicleTrims = await ResaleVehicleTrimNew.create({
                                                            name: trims,
                                                            resale_year_id: createVehicleyear?.dataValues?.id,
                                                            resale_vehicle_model_id: createModel.dataValues.id,
                                                            is_cron: 0
                                                        })
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                }

            }
        }
    } catch (error) {
        console.log(error)
    }
}
let resale_category_id = 1
let main_category_id = 6
export const scrappingResaleValueCompany = async (req, res) => {
    try {
        const fetchVehicleBrands = await axios.get(`https://orangebookvalue.com/mmyt?&category_id=${resale_category_id}&api_version=3`)
        console.log('------------------------------------------------')
        console.log('------------------------------------------------')
        console.log('fetchVehicleBrands', fetchVehicleBrands?.data?.code)
        console.log('------------------------------------------------')
        console.log('fetchVehicleBrands', fetchVehicleBrands?.data?.code)
        console.log('------------------------------------------------')
        console.log('------------------------------------------------')
        if (fetchVehicleBrands.data.data) {
            for (const brands of fetchVehicleBrands.data.data) {
                if (brands?.name != 'All Products' && brands?.name != 'Top Products') {
                    const findIsExitOrNot = await ResaleVehicleCompanyNew.findOne({
                        where: {
                            resale_vehicle_category_id: main_category_id,
                            name: brands?.name
                        }
                    })
                    if (findIsExitOrNot) {
                        console.log("======================Esist Category===============================")
                    } else {
                        await ResaleVehicleCompanyNew.create({
                            resale_vehicle_category_id: main_category_id,
                            name: brands?.name
                        })
                    }

                }

            }
        }
    } catch (error) {

    }
}
export const scrappingResaleValueModel = async (req, res) => {
    try {

        const findAllCompany = await ResaleVehicleCompanyNew.findAll({
            where: {
                resale_vehicle_category_id: main_category_id
            },
            // limit: 200,
            // offset: 0
        })
        // console.log('findAllCompany -->', findAllCompany)
        for (const company of findAllCompany) {
            const fetchvehicleModelData = await axios.get(`https://orangebookvalue.com/mmyt?&category_id=${resale_category_id}&make=${company?.name?.trim()?.replace(" ", "%20")}&api_version=3`)
            let count = 1
            console.log("------------------------------------------------------")
            console.log('fetchVehicleBrands', fetchvehicleModelData?.data)
            console.log("------------------------------------------------------")
            console.log("------------------------------------------------------")
            console.log('fetchVehicleBrands', fetchvehicleModelData?.data?.code)
            console.log(`----------------------${count++}--------------------------------`)
            console.log("------------------------------------------------------")

            if (fetchvehicleModelData.data.data) {
                for (const __company of fetchvehicleModelData.data.data) {
                    if (__company != 'All Products' && __company != 'Top Products') {
                        const findIsExitOrNot = await ResaleVehicleModelNew.findOne({
                            where: {
                                name: __company,
                                resale_vehicle_company_id: company?.dataValues?.id,
                            }
                        })
                        if (findIsExitOrNot) {
                            console.log("======================Esist Model===============================")
                        } else {
                            await ResaleVehicleModelNew.create({
                                name: __company,
                                resale_vehicle_company_id: company?.dataValues?.id,
                                category_id: main_category_id,
                                is_cron: 0
                            })
                        }

                    }

                }
            }
        }
        console.log("======================== DOne =========================")

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

export const scrappingResaleValueYear = async (req, res) => {
    try {
        let count = 1 
        const findAllModel = await ResaleVehicleModelNew.findAll({
            where: {
                category_id: main_category_id
            },
            include: [{
                model: ResaleVehicleCompanyNew,
                as: "ResaleModelYearData"
            }],
            // limit: 150,
            // offset: 400
        })
        // console.log('findAllCompany -->', findAllModel)
        for (const model of findAllModel) {
            // const  = await axios.get(`https://orangebookvalue.com/mmyt?&category_id=${resale_category_id}&make=${company?.name?.trim()?.replace(" ", "%20")}&api_version=3`)
            const fetchvehicleYearData = await axios.get(`https://orangebookvalue.com/mmyt?&category_id=${resale_category_id}&make=${model?.dataValues?.ResaleModelYearData?.name?.trim()?.replace(" ", "%20")}&model=${model?.dataValues?.name?.trim()?.replace(" ", "%20")}&api_version=3`)

            console.log("------------------------------------------------------")
            console.log('fetchVehicleBrands', fetchvehicleYearData?.data)
            console.log("------------------------------------------------------")
            console.log("------------------------------------------------------")
            console.log('fetchVehicleBrands', fetchvehicleYearData?.data?.code)
            console.log(`----------------------${count++}--------------------------------`)

            if (fetchvehicleYearData.data.data) {
                for (const __year of fetchvehicleYearData.data.data) {
                    // if (__year != 'All Products' && __year != 'Top Products') {
                    const findIsExitOrNot = await ResaleYearsNew.findOne({
                        where: {
                            name: __year,
                            resale_vehicle_model_id: model?.dataValues?.id,
                            category_id: main_category_id,
                        }
                    })
                    if (findIsExitOrNot) {
                        console.log("======================Esist Year===============================")
                    } else {
                        await ResaleYearsNew.create({
                            name: __year,
                            resale_vehicle_model_id: model?.dataValues?.id,
                            category_id: main_category_id
                        })
                    }

                    // }

                }
            }
        }
        console.log("======================== DOne =========================")

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


export const scrappingResaleValueTrim = async (req, res) => {
    try {
        const findAllYear = await ResaleYearsNew.findAll({
            where: {
                category_id: main_category_id
            },
            include: [{
                model: ResaleVehicleModelNew,
                as: "ResaleModelTrimData",
                include: [{
                    model: ResaleVehicleCompanyNew,
                    as: "ResaleCompanyTrimYearData",
                }]
            }],
            limit: 1400,
            offset: 2330
        })
        let count = 1 

        const proxy = {
            host: '114.143.0.177',
            port: 80
        };
        for (const year of findAllYear) {
          
            // const  = await axios.get(`https://orangebookvalue.com/mmyt?&category_id=${resale_category_id}&make=${company?.name?.trim()?.replace(" ", "%20")}&api_version=3`)
            const fetchVehicleTrims = await axios.get(`https://orangebookvalue.com/mmyt?&category_id=${resale_category_id}&make=${year?.dataValues?.ResaleModelTrimData?.ResaleCompanyTrimYearData?.name?.trim()?.replace(" ", "%20")}&model=${year?.dataValues?.ResaleModelTrimData?.name?.trim()?.replace(" ", "%20")}&year=${year?.dataValues?.name?.trim()?.replace(" ", "%20")}&check_obv=1&api_version=3`)
            console.log("------------------------------------------------------")
            console.log('fetchVehicleBrands', fetchVehicleTrims?.data)
            console.log("------------------------------------------------------")
            console.log("------------------------------------------------------")
            console.log('fetchVehicleBrands', fetchVehicleTrims?.data?.code)
            console.log(`----------------------${count++}--------------------------------`)
            console.log("------------------------------------------------------")

            if (fetchVehicleTrims?.data?.data?.result) {
                for (const __trim of fetchVehicleTrims.data.data.result) {
                    // if (__trim != 'All Products' && __trim != 'Top Products') {
                    const findIsExitOrNot = await ResaleVehicleTrimNew.findOne({
                        where: {
                            name: __trim,
                            resale_year_id: year.dataValues.id,
                            resale_vehicle_model_id: year?.dataValues?.ResaleModelTrimData?.id,
                            is_cron: '',
                        }
                    })
                    if (findIsExitOrNot) {
                        console.log("======================Esist Year===============================")
                    } else {
                        await ResaleVehicleTrimNew.create({
                            name: __trim,
                            resale_year_id: year.dataValues.id,
                            resale_vehicle_model_id: year?.dataValues?.ResaleModelTrimData?.id,
                            is_cron: 0,
                        })
                    }

                    // }

                }
            }
        }
        console.log("======================== DOne =========================")
        res.send("done")
    } catch (error) {
        console.log(error)
        res.send(error)
    }
} 

// export const createResalePrice = async(req,res) => {
// try {
//     const findTrim = await ResaleVehicleTrimNew.findAll({
//         where: {

//         },
//         include: [
//             {
//                 model:ResaleYearsNew,
//                 as:"ResalePriceYearData"
//             },
//             {
//                 model: ResaleVehicleModelNew,
//                 as: "ResalePriceModelData",
//                 include: [{
//                     model: ResaleVehicleCompanyNew,
//                     as: "ResalePriceCompanyData",
//                 }]
//             },

//         ],
//         limit:500,
//         offset:0
//     })
//     for (const priceTrim of findTrim) {
        
//             const token = 'RHJvb218b3BlcmF0aW9uc0Bkcm9vbS5pbnxBI3cyKDBz';
//             const city = 'Mumbai';
//             const customerType = 'individual';
//             const transactionType = 'b';
//             let categoryId = values.resaleVehicleCompany.resaleVehicleCategory.id;
//             let maker = priceTrim.dataValues.ResalePriceModelData.ResalePriceCompanyData.name
//             let model = priceTrim.dataValues.ResalePriceModelData.name
//             let year = priceTrim.dataValues.ResalePriceYearData.name
//             let trim = priceTrim.dataValues.name
//             let responseOfVehiclePrice = await axios.get('https://orangebookvalue.com/trim_products', {
//                     params: {
//                         token: token,
//                         category_id: categoryId,
//                         make: maker,
//                         model: model,
//                         year: year,
//                         trim: trim,
//                         customer_type: customerType,
//                         car_condition: 'good',
//                         transaction_type: transactionType,
//                         kms_driven: '--',
//                         condition: 'good',
//                         city: city,
//                         future_all: '0',
//                         get_default: '0',
//                         exchangemake: '',
//                         exchangemodel: '',
//                         exchangetrim: '',
//                         exchangeyear: '',
//                         exchangekms_driven: '',
//                         expected_kms_driven: '',
//                         expected_months: ''
//                     }
//                 });
//             }
//             if(responseOfVehiclePrice?.data?.code == 'failed'){
//                 await ResaleVehiclePriceNew.create({
//                     resale_state_id: '1155',
//                     resale_vehicle_company_id: priceTrim.dataValues.ResalePriceModelData.ResalePriceCompanyData.id,
//                     resale_vehicle_model_id: priceTrim.dataValues.ResalePriceModelData.id,
//                     resale_year_id: priceTrim.dataValues.ResalePriceYearData.id,
//                     resale_vehicle_trim_id: priceTrim.dataValues.id,
//                     year: '',
//                     new_car_price: '',
//                     onraod_price: 0,
//                     logged_price: 0,
//                     din: '',
//                     price: 0,
//                     range_from: 0 ,
//                     range_to: 0,
//                     clunker_price: 0,
//                     is_updated: 0
//                 })
//                 await new Promise(resolve => setTimeout(resolve, 25000));
//             }
//             if(responseOfVehiclePrice?.data?.data){
//                 await ResaleVehiclePriceNew.create({
//                     resale_state_id: '1155',
//                     resale_vehicle_company_id: priceTrim.dataValues.ResalePriceModelData.ResalePriceCompanyData.id,
//                     resale_vehicle_model_id: priceTrim.dataValues.ResalePriceModelData.id,
//                     resale_year_id: priceTrim.dataValues.ResalePriceYearData.id,
//                     resale_vehicle_trim_id: priceTrim.dataValues.id,
//                     year: responseOfVehiclePrice?.year,
//                     new_car_price: responseOfVehiclePrice?.new_car_price,
//                     onraod_price: responseOfVehiclePrice?.onraod_price,
//                     logged_price: responseOfVehiclePrice?.logged_price,
//                     din: responseOfVehiclePrice?.din || '',
//                     price: responseOfVehiclePrice?.price || '',
//                     range_from: responseOfVehiclePrice?.range_from || '',
//                     range_to: responseOfVehiclePrice?.range_to || '',
//                     clunker_price: responseOfVehiclePrice?.clunker_price || '',
//                     is_updated: 1
//                 })
//             }

// } catch (error) {
    
// }
// }