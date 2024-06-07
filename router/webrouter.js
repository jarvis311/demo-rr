import express from 'express';
const router = express.Router()
import DrivingSchoolwebController from '../controller/Webapi/DrivingSchoolwebController.js';
import AffilationAdminControllerAPI from '../controller/Webapi/AffilationAdminControllerAPI.js';
import ServiceCenterwebController from '../controller/Webapi/ServiceCenterwebController.js';
import VehicleInformationConterollerWeb from '../controller/Webapi/VehicleInformationConterollerWeb.js'
import { getNewsCategoryDataById, handleChangeStatusNewsCategory, handleCreateNewsCategory, handleDeleteNewsCategory, handleGetNewsCategory, handleNewsCategoryDropdown, handleUpdateNewsCategory } from '../controller/Webapi/RTO-News/NewsCategory.controller.js';
import { changeStatusOfNewsHeadline, getAllNewsHeadlineWithoutLimits, handleCreatNewsHeadline, handleFetchNewsHeadline, handleGetBrandOptionsIdWise, handleGetCategoryOptions, handleGetNewsCategoryById, handleGetNewsHeadlinesCategoryOptions, handleUpdateNewsHeadlines, removeNewsHeadline } from '../controller/Webapi/RTO-News/NewsHeadline.controller.js';
import { CreateNewTags, GetAllTags, GetTagById, RemoveTag, UpdateTag } from '../controller/Webapi/RTO-News/NewsTag.controller.js';
import { CreateNewNews, GetAllNews, GetNewsById, RemoveNews, UpdateNews } from '../controller/Webapi/RTO-News/News.controller.js';
import RC_DL_information from '../controller/Webapi/RC_information.js'

import fuelpriceController from '../controller/Webapi/Fuelprice.js'

import { GetAllBrandsForVariantSpecificationDropDown, GetAllCategorysForVariantSpecificationDropDown, GetAllKeySpecificatioForDropDown, GetAllPriceVariantForVariantSpecificationDropDown, GetAllPriceVariants, GetAllPriceVariantsByIdWithOtherDetails, GetAllPriceVariantsByIdWithOtherDetailsForEdit, GetAllSpecificatioForDropDown, GetAllVehicleForVariantSpecificationDropDown, addVariantSpecification, deletePriceVariantAndSpecification, editVariantSpecification } from '../controller/Webapi/rto-vehicle-information/VariantSpecification.js';

import Rcdetailcontroller from '../controller/Webapi/Rcdetail.js'
import APIcontroller from '../controller/Webapi/API.js'
import Authentication from '../controller/Webapi/Authentication.js';
import Auth from '../middleware/Auth.js';
import QuotesController from '../controller/Webapi/Quotes.js'
import { verifyToken } from '../middleware/auth.middleware.js';
import { getFailData, viewFailData } from '../controller/Webapi/FailData.js';
import { getDashboardSummary } from '../controller/Webapi/Dashboard/DashboardAPI.js';
/**************Driving school state Nirmal 02-11-2023 *************************************/

router.post("/get_driving_school_state", DrivingSchoolwebController.get_driving_school_state)
router.post("/store_driving_school_state", DrivingSchoolwebController.store_driving_school_state)
router.post("/get_update_driving_school_state/:id", DrivingSchoolwebController.get_update_driving_school_state)
router.post("/update_driving_school_state/:id", DrivingSchoolwebController.update_driving_school_state)
router.post("/delete_driving_school_state/:id", DrivingSchoolwebController.delete_driving_school_state)
router.post("/driving_school_state_search", DrivingSchoolwebController.driving_school_state_search)
router.post("/get_all_driving_school_state", DrivingSchoolwebController.get_all_driving_school_state)


/**************Driving school city Nirmal 02-10-2023 **************************************/
router.post("/get_driving_school_city", DrivingSchoolwebController.get_driving_school_city)
router.post("/add_driving_school_city", DrivingSchoolwebController.add_driving_school_city)
router.post("/delete_driving_school_city/:id", DrivingSchoolwebController.delete_driving_school_city)
router.post("/update_driving_school_city/:id", DrivingSchoolwebController.update_driving_school_city)
router.post("/get_update_driving_school_city/:id", DrivingSchoolwebController.get_update_driving_school_city)
router.post("/driving_school_city_search", DrivingSchoolwebController.driving_school_city_search)
router.post("/get_all_driving_school_city", DrivingSchoolwebController.get_all_driving_school_city)



/***************Driving school area Nirmal 03-11-2023 **************************************/
router.post("/get_driving_school_area", DrivingSchoolwebController.get_driving_school_area)
router.post("/edit_driving_school_area/:id", DrivingSchoolwebController.edit_driving_school_area)
router.post("/update_driving_school_area/:id", DrivingSchoolwebController.update_driving_school_area)
router.post("/delete_driving_school_area/:id", DrivingSchoolwebController.delete_driving_school_area)
router.post("/store_driving_school_area", DrivingSchoolwebController.store_driving_school_area)
router.post("/driving_school_area_search", DrivingSchoolwebController.driving_school_area_search)
router.post("/get_all_area", DrivingSchoolwebController.get_all_area)


/**************Driving school Detail Nirmal 03-11-2023*************************************/
router.post("/get_driving_school_detail", DrivingSchoolwebController.get_driving_school_detail)
router.post("/add_driving_school_detail", DrivingSchoolwebController.add_driving_school_Detail)
router.post("/delete_driving_school_detail/:id", DrivingSchoolwebController.delete_driving_school_detail)
router.post("/edit_driving_school_detail/:id", DrivingSchoolwebController.edit_driving_school_detail)
router.post("/update_driving_school_detail/:id", DrivingSchoolwebController.update_driving_school_detail)
router.post("/changeStatusDSdetails", DrivingSchoolwebController.changeStatusDSdetails)
router.post("/driving_school_detail_search", DrivingSchoolwebController.driving_school_detail_search)
router.post("/get_all_details", DrivingSchoolwebController.get_all_details)



/**************Service center state Nirmal 03-11-2023******************************************/
router.post("/get_service_center_state", ServiceCenterwebController.get_service_center_state)
router.post("/store_service_center_state", ServiceCenterwebController.store_service_center_state)
router.post("/delete_service_center_state/:id", ServiceCenterwebController.delete_service_center_state)
router.post("/edit_driving_school_state/:id", ServiceCenterwebController.edit_driving_school_state)
router.post("/update_service_center_state/:id", ServiceCenterwebController.update_service_center_state)
router.post("/get_all_service_state", ServiceCenterwebController.get_all_service_state)
router.post("/Servicestatuschange", ServiceCenterwebController.Servicestatuschange)


/*************service center city Nirmal 04-11-2023**********************************************/
router.post("/get_Service_center_city", ServiceCenterwebController.get_Service_center_city)
router.post("/store_service_center_city", ServiceCenterwebController.store_service_center_city)
router.post("/delete_service_center_city/:id", ServiceCenterwebController.delete_service_center_city)
router.post("/edit_service_center_city/:id", ServiceCenterwebController.edit_service_center_city)
router.post("/update_service_center_city/:id", ServiceCenterwebController.update_service_center_city)
router.post("/service_center_city_search", ServiceCenterwebController.service_center_city_search)
router.post("/Citystatuschange", ServiceCenterwebController.Citystatuschange)
router.post("/getAllcity", ServiceCenterwebController.getAllcity)

/*************service center brand Nirmal 07-11-2023***********************************************/
router.post("/get_Service_center_Brand", ServiceCenterwebController.get_Service_center_Brand)
router.post("/SearchBrand", ServiceCenterwebController.SearchBrand)
router.post("/statuschangeBrand", ServiceCenterwebController.statuschangeBrand)
router.post("/edit_service_center_Brand/:id", ServiceCenterwebController.edit_service_center_Brand)
router.post("/store_service_Brand", ServiceCenterwebController.store_service_Brand)
router.post("/update_Service_center_Brand/:id", ServiceCenterwebController.update_Service_center_Brand)
router.post("/getallBrand", ServiceCenterwebController.getallBrand)
router.post("/deletebrand/:id", ServiceCenterwebController.deletebrand)

/*******************service center data api Nirmal 07-11-2023**************************************/
router.post("/getAll_service_center_data", ServiceCenterwebController.getAll_service_center_data)
router.post("/searchservicedata", ServiceCenterwebController.searchservicedata)
router.post("/changefeature", ServiceCenterwebController.changefeature)
router.post("/changestatus", ServiceCenterwebController.changestatus)
router.post("/add_service_center_data", ServiceCenterwebController.add_service_center_data)
router.post("/edit_service_center_data/:id", ServiceCenterwebController.edit_service_center_data)
router.post("/deleteservicedata/:id", ServiceCenterwebController.deleteservicedata)
router.post("/update_service_center/:id", ServiceCenterwebController.update_service_center)
router.post("/get_all_service_center_data", ServiceCenterwebController.get_all_service_center_data)
router.post("/get_service_center_brand_option", ServiceCenterwebController.getSeviceCenterBrandOption)

/*****************service dealer data api Nirmal 08-11-2023**************************************/
router.post("/get_all_service_dealer", ServiceCenterwebController.get_all_service_dealer)
router.post("/change_featured", ServiceCenterwebController.change_featured)
router.post("/change_status", ServiceCenterwebController.change_status)
router.post("/search_dealer", ServiceCenterwebController.search_dealer)
router.post("/store_service_dealer", ServiceCenterwebController.store_service_dealer)
router.post("/delete_service_dealer/:id", ServiceCenterwebController.delete_service_dealer)
router.post("/getalldealer", ServiceCenterwebController.getalldealer)
router.post("/update_service_dealer/:id", ServiceCenterwebController.update_service_dealer)
router.post("/get_service_dealer/:id", ServiceCenterwebController.edit_service_deler_data)

/*****************News Category data api Jignesh Patel 08-11-2023**************************************/
router.post("/get-news-category", handleGetNewsCategory)
router.post("/create-news-category", handleCreateNewsCategory)
router.post("/get-news-category_by_id/:id", getNewsCategoryDataById)
router.post("/update-news-category/:id", handleUpdateNewsCategory)
router.post("/update-status-news-category", handleChangeStatusNewsCategory)
router.post("/delete-news-category", handleDeleteNewsCategory)
router.post("/news-category-dropdown", handleNewsCategoryDropdown)

/*****************News Headlines data api Jignesh Patel 08-11-2023**************************************/
router.post("/get-news-headlines", handleFetchNewsHeadline)
router.post("/get-news-headline/:id", handleGetNewsCategoryById)
router.post("/create-news-headline", handleCreatNewsHeadline)
router.post("/get-news-headline-category-dropdown", handleGetNewsHeadlinesCategoryOptions)
router.post("/get-news-category-dropdown", handleGetCategoryOptions)
router.post("/get-news-brand-dropdown", handleGetBrandOptionsIdWise)
router.post("/update-news-headline/:id", handleUpdateNewsHeadlines)
router.post("/update-status-news-headline", changeStatusOfNewsHeadline)
router.post("/get-all-news-headline", getAllNewsHeadlineWithoutLimits)
router.post("/delete-news-headline/:id", removeNewsHeadline)

/*****************Tags data api Jignesh Patel 08-11-2023**************************************/
router.post("/get-tags", GetAllTags)
router.post("/get-tag/:id", GetTagById)
router.post("/create-tag", CreateNewTags)
router.post("/detete-tag/:id", RemoveTag)
router.post("/update-tag/:id", UpdateTag)

/*****************Tags data api Jignesh Patel 08-11-2023**************************************/
router.post("/get-news", GetAllNews)
router.post("/get-news/:id", GetNewsById)
router.post("/create-news", CreateNewNews)
router.post("/detete-news/:id", RemoveNews)
router.post("/update-news/:id", UpdateNews)
/******************DL-RC information api Nirmal 09-11-2023***************************************/

router.post("/get_all_rcdl_info", RC_DL_information.get_all_rcdl_info)
router.post("/rc_dl_status", RC_DL_information.RC_DL_status)
router.post("/rc_dl_search", RC_DL_information.rc_dl_search)
router.post("/get_rcdl_info/:id", RC_DL_information.getDlRcInfoById)
router.post("/store_rc_dl_detail", RC_DL_information.store_rc_dl_detail)
router.post("/update_rc_dl_info/:id", RC_DL_information.update_rc_dl_info)
router.post("/delete_dl_rc_info/:id", RC_DL_information.delete_dl_rc_info)
router.post("/alloffence", RC_DL_information.alloffence)
router.post("/get_all_rcdl_info_dropdown", RC_DL_information.getAllRcDLinfo)


/*****************traffic state api Nirmal 10-11-2023 */
router.post("/get_all_traffic_state", RC_DL_information.get_all_traffic_state)
router.post("/edit_traffic_state/:id", RC_DL_information.edit_traffic_state)
router.post("/store_traffic_state", RC_DL_information.store_traffic_state)
router.post("/update_traffic_state/:id", RC_DL_information.update_traffic_state)
router.post("/delete_traffic_state/:id", RC_DL_information.delete_traffic_state)
router.post("/get_traffic_states_dropdown", RC_DL_information.GetAllTrafficStateWithoutLimit)


/*****************traffic rule api Nirmal 10-11-2023**********/
router.post("/get_all_traffic_rule", RC_DL_information.get_all_traffic_rule)
router.post("/search_traffic_rule", RC_DL_information.search_traffic_rule)
router.post("/edit_traffic_rules/:id", RC_DL_information.edit_traffic_rules)
router.post("/update_traffic_rules/:id", RC_DL_information.update_traffic_rules)
router.post("/get_traffic_language", RC_DL_information.get_traffic_language)
router.post("/storetrafficstate", RC_DL_information.storetrafficstate)
router.post("/delete_traffic_rule/:id", RC_DL_information.RemoveTrafficRule)
router.post("/update-traffic-rules-language", RC_DL_information.updateTrafficRulesLanguage)




/************* Affilation Admin API************** 
************** Mansi  ************** 
************** 02-11-23 ************** 
************** affilation dashboard Admin API **************/
router.get("/affilation_dashboard", AffilationAdminControllerAPI.getAffilationDashboard)
router.post("/affilation_dashboard_data", AffilationAdminControllerAPI.getAffilationDashboardData)
router.post('/affilation_dashboard_update_status', AffilationAdminControllerAPI.updateAffilationStatus)

/************** affilation Program Admin API **************/
router.get('/affilation', AffilationAdminControllerAPI.getAffilationData)
router.get('/affiliation_place', AffilationAdminControllerAPI.getAffilationPlace)
router.post('/pagination_affiliate', AffilationAdminControllerAPI.getPaginationAffilation)
router.get('/view_affilation/:id', AffilationAdminControllerAPI.getAffilationById)
router.post('/affilation_data_show', AffilationAdminControllerAPI.getAffilationDataShow)
router.post('/update_app_status', AffilationAdminControllerAPI.updateAppStatus)
router.post('/get_affilation_data', AffilationAdminControllerAPI.getAffilationProgramData)
router.post('/clear_default_affilation', AffilationAdminControllerAPI.updateDefaultAffilation)
router.get('/get_affilation_dropdown', AffilationAdminControllerAPI.getAffilationDropDown)
router.post('/add_affilation', AffilationAdminControllerAPI.addAffilationData)

/************** affilation Program Offer Data API **************/
router.get('/offer_data', AffilationAdminControllerAPI.getOfferData)
router.post('/add_offer', AffilationAdminControllerAPI.addOfferData)
router.delete('/delete_affilation/:id', AffilationAdminControllerAPI.deleteAffilationData)
router.post('/update_position_affilation', AffilationAdminControllerAPI.updateAffilationSort)


/************** Affilation Data API **************/
router.get('/dynamic_dropdown', AffilationAdminControllerAPI.getDynamicDropDown)
router.post('/edit_dynamic_dropdown', AffilationAdminControllerAPI.updateDynamicDropDown)

/************** Affilation Data Language API **************/
router.get('/get_language', AffilationAdminControllerAPI.getLanguage)
router.post('/store_language_lable', AffilationAdminControllerAPI.addLanguageLabel)
router.post('/delete_language_lable', AffilationAdminControllerAPI.deleteLanguageLable)


/************** Affilation Service City List **************/
router.get('/affilation_state', AffilationAdminControllerAPI.getAffilationState)
router.post('/affilation_city_data', AffilationAdminControllerAPI.getAffilationCityData)
router.get('/get_affilation_city/:id', AffilationAdminControllerAPI.getAffilationCityIdWise)
router.post('/add_affilation_city', AffilationAdminControllerAPI.addAffilationCity)
router.delete('/delete_affilation_city/:id', AffilationAdminControllerAPI.deleteAffilationCity)
router.post('/get_service_provider_city', AffilationAdminControllerAPI.getServiceProviderCity)
router.get('/get_service_provider_dropdown', AffilationAdminControllerAPI.getServiceProviderDropDown)
router.get('/get_service_city_wise_pincode/:id', AffilationAdminControllerAPI.getServiceWisePincodeData)
router.get('/view_service_provider_city/:id', AffilationAdminControllerAPI.getViewServiceProviderCity)
router.post('/add_service_provider_city', AffilationAdminControllerAPI.addServiceProviderCity)
router.post('/update_pincode_status', AffilationAdminControllerAPI.updatePincodeStatus)
router.delete('/delete_service_provider_city/:id', AffilationAdminControllerAPI.deleteServiceProviderCity)
router.get('/get_service_city_id_wise_pincode', AffilationAdminControllerAPI.getServiceIdWisePincodeData)
router.post('/delete_service_city', AffilationAdminControllerAPI.deleteCityList)






/************** Vehicle Information List API Mansi 20-11-23 **************/

/************** Categorie API Start **************/
router.get('/get_categories', VehicleInformationConterollerWeb.getCategories)
router.get('/get_categorie_id/:id', VehicleInformationConterollerWeb.getCategorieById)
router.post('/add_categorie', VehicleInformationConterollerWeb.addCategories)
router.post('/update_category_status', VehicleInformationConterollerWeb.updateCategoryStatus)
router.post('/edit_categorie', VehicleInformationConterollerWeb.editCategories)
router.delete('/delete_categorie/:id', VehicleInformationConterollerWeb.deleteCategorie)
/************** Categorie API End**************/


/************** Brand API Start **************/
router.post('/get_brands', VehicleInformationConterollerWeb.getBrands)
router.post('/add_brands', VehicleInformationConterollerWeb.addBrands)
router.get('/get_brand_id_wise/:id', VehicleInformationConterollerWeb.getBrandIdWise)
router.post('/update_brand_status', VehicleInformationConterollerWeb.updateBrandStatus)
router.post('/edit_brand', VehicleInformationConterollerWeb.editBrandData)
router.delete('/delete_brand/:id', VehicleInformationConterollerWeb.deleteBrand)
/************** Brand API End **************/



/************** Vehicle Information API Start **************/
router.post('/get_vehicle_information', VehicleInformationConterollerWeb.getVehicleInformation)
router.post('/update_vehicle_status', VehicleInformationConterollerWeb.updateVehicleStatus)
router.post('/get_brand_category_wise', VehicleInformationConterollerWeb.getBrandDetailsCategoryWise)
router.post('/add_vehicle_information_data', VehicleInformationConterollerWeb.addVehicleInformationData) // image validation pending
router.delete('/delete_vehicle/:id', VehicleInformationConterollerWeb.deleteVehicleInformationData)
router.post('/get_bodtype_category_wise', VehicleInformationConterollerWeb.getBodyTypeBrandWise)
router.get('/view_vehicle_information/:id', VehicleInformationConterollerWeb.getViewVehicleInformationIdWise)
router.post('/update_vehicle_information/:id', VehicleInformationConterollerWeb.updateVehicleInformation)
router.get('/get_all_vehicle_information_model_name', VehicleInformationConterollerWeb.getAllVehicleInformationModelName)


/************** Vehicle Information API End **************/


/************** Body Type API Start **************/
router.post('/get/vehicle/bodytype', VehicleInformationConterollerWeb.getBodyTypeData)
router.post('/add/vehicle/bodytype', VehicleInformationConterollerWeb.addBodyType)
router.get('/vehicle/bodytype/:id', VehicleInformationConterollerWeb.getBodyTypeIdWise)
router.post('/toggle/body_type', VehicleInformationConterollerWeb.updateBodyTypeStatus)
router.post('/update/vehicle/bodytype/:id', VehicleInformationConterollerWeb.editBodyType)
router.post('/delete/vehicle/bodytype', VehicleInformationConterollerWeb.deleteBodyType)



/************** Body Type API End **************/

/************key specification API Nirmal 22-11-2023 start*********/
router.post('/get_all_keyspecification', VehicleInformationConterollerWeb.get_all_keyspecification)
router.post("/get_singlekey/:id", VehicleInformationConterollerWeb.get_singlekey)
router.post("/get_all_keyname", VehicleInformationConterollerWeb.get_all_keyname)
router.post("/store_key", VehicleInformationConterollerWeb.store_key)
router.post("/deletekeyinfo/:id", VehicleInformationConterollerWeb.deletekeyinfo)
router.post("/update_key_specs/:id", VehicleInformationConterollerWeb.update_key_specs)

/*************Fuel price API Nirmal 22-11-2023*********/
router.post("/get_allprice", fuelpriceController.get_allprice)
router.post("/getall_withLimit_fuel_price", fuelpriceController.getall_withLimit_fuel_price)
router.post("/allFulepricestate", fuelpriceController.allFulepricestate)
router.post("/store_fule_price", fuelpriceController.store_fule_price)
router.post("/get_single_fuelprice/:id", fuelpriceController.get_single_fuelprice)
router.post("/edit_fuel_price/:id", fuelpriceController.edit_fuel_price)
router.post("/copy_fuel_price", fuelpriceController.copy_fuel_price)

/*************Compare API Nirmal 23-11-2023*****************/
router.post("/get_all_compareData", VehicleInformationConterollerWeb.get_all_compareData)
router.post("/dropdownformodelname", VehicleInformationConterollerWeb.dropdownformodelname)
router.post("/storeComparedata", VehicleInformationConterollerWeb.storeComparedata)
router.post("/get_single_comparedata/:id", VehicleInformationConterollerWeb.get_single_comparedata)
router.post("/update_comparedata/:id", VehicleInformationConterollerWeb.update_comparedata)
router.post("/delete_compareData/:id", VehicleInformationConterollerWeb.delete_compareData)
router.post("/compare_status", VehicleInformationConterollerWeb.compare_status)

/************** Vehicle information variant specification API start jignesh patel 22-11 **************/
router.post('/get_pricevariant', GetAllPriceVariants)
router.post('/get_variant_details/:id', GetAllPriceVariantsByIdWithOtherDetails)
router.post('/get_category_dropdown', GetAllCategorysForVariantSpecificationDropDown)
router.post('/get_brand_dropdown', GetAllBrandsForVariantSpecificationDropDown)
router.post('/get_vehicleinfo_dropdown', GetAllVehicleForVariantSpecificationDropDown)
router.post('/get_pricevariant_dropdown', GetAllPriceVariantForVariantSpecificationDropDown)
router.post('/get_specification_dropdown', GetAllSpecificatioForDropDown)
router.post('/get_key_specification_dropdown', GetAllKeySpecificatioForDropDown)
router.post('/create_keyspecification', addVariantSpecification)
router.post('/get_edit_detsils/:id', GetAllPriceVariantsByIdWithOtherDetailsForEdit)
router.post('/delete_specification_detsils/:id', deletePriceVariantAndSpecification)
router.post('/edit_variant_details/:id', editVariantSpecification)


/************** Vehicle information variant specification API End jignesh patel 22-11 **************/

/********************Athentication API Nirmal 24-11-2023*********************************/
router.post("/login", Authentication.login)
// router.post("/registeration",Auth.jwtverification,Authentication.registeration)
router.post("/logout", Authentication.logout)




/********************************RC INFORNATION ADMIN PANEL API ************************************************************/

/**RC information  Nirmal 27-11-2023*************************************************/
router.post("/rcdetailsearch", verifyToken('RC-Details-list'), Rcdetailcontroller.searchRcdetails)
router.post("/sourceInfo", verifyToken('RC-Details-list'), Rcdetailcontroller.sourceInfo)
router.post("/rcCount", verifyToken('RC-Details-list'), Rcdetailcontroller.rcCount)
router.post("/carInfocount", verifyToken('RC-Count-list'), Rcdetailcontroller.carInfocount)
router.post("/rcBlockSearch", verifyToken('Rc-Block-list'), Rcdetailcontroller.rcBlockSearch)
router.post("/changeRCblockStatus", verifyToken('Rc-Block-edit'), Rcdetailcontroller.changeRCblockStatus)
router.post("/deleteRCblockdetail/:id", verifyToken('Rc-Block-delete'), Rcdetailcontroller.deleteRCblockdetail)
router.post("/storeRcblockregNum", verifyToken('Rc-Block-create'), Rcdetailcontroller.storeRcblockDetail)
router.post("/getlicenseInformation", verifyToken('License-info-list'), Rcdetailcontroller.getlicenseInformation)
router.post("/getReminder", verifyToken('Reminder-list'), Rcdetailcontroller.getReminder)
router.post("/getFeedBackData", verifyToken('Feedback-New-list'), Rcdetailcontroller.getFeedBackData)
router.post("/feedBackVersioncode", verifyToken('Feedback-New-list'), Rcdetailcontroller.feedBackVersioncode)
router.post("/updateStatusinFeedback", verifyToken('Feedback-New-edit'), Rcdetailcontroller.updateStatusinFeedback)
router.post("/rcReport", verifyToken('RC-Report-list'), Rcdetailcontroller.rcReport)
router.post("/getNotificationReportData", verifyToken('Notification-Report-list'), Rcdetailcontroller.getNotificationReportData)

/****RC API Nirmal 30-11-2023***********************************/
router.post("/getAppDataDetail", verifyToken('App-Update-list'), APIcontroller.getAppDataDetail)
router.post("/getSingleAppdata/:id", verifyToken('App-Update-list'), APIcontroller.getSingleAppdata)
router.post("/updateAppdata/:id", verifyToken('App-Update-edit'), APIcontroller.updateAppdata)
router.post("/deleteAppdata/:id", verifyToken('App-Update-delete'), APIcontroller.deleteAppdata)
router.post("/storeAppData", verifyToken('App-Update-create'), APIcontroller.storeAppData)
router.post("/changeStatusForAppdata", verifyToken('App-Update-edit'), APIcontroller.changeStatusForAppdata)
router.post("/getApiPriority", verifyToken('API-Priority-list'), APIcontroller.getApiPriority)
router.post("/getSingleapiPrioritydata/:id", verifyToken('API-Priority-list'), APIcontroller.getSingleapiPrioritydata)
router.post("/updateApiPrioritydata/:id", verifyToken('API-Priority-edit'), APIcontroller.updateApiPrioritydata)
router.post("/changeApiPriorityPosition", verifyToken('API-Priority-edit'), APIcontroller.changeApiPriorityPosition)
router.post("/apiPriorityStatusChange", verifyToken('API-Priority-edit'), APIcontroller.apiPriorityStatusChange)
router.post("/deleteApiPriority/:id", verifyToken('API-Priority-delete'), APIcontroller.deleteApiPriority)
router.post("/storeApiPriority", verifyToken('API-Priority-create'), APIcontroller.storeApiPriority)


/*****ApiPurchasePriority Mitul 27-12-2023 **************/
router.post("/getApiPurchasePriority", APIcontroller.getApiPurchasePriority)
router.post("/getSingleapiPurchasePrioritydata/:id", APIcontroller.getSingleapiPurchasePrioritydata)
router.post("/updateApiPurchasePrioritydata/:id", APIcontroller.updateApiPurchasePrioritydata)
router.post("/changeApiPurchasePriorityPosition", APIcontroller.changeApiPurchasePriorityPosition)
router.post("/apiPurchasePriorityStatusChange", APIcontroller.apiPurchasePriorityStatusChange)
router.post("/deleteApiPurchasePriority/:id", APIcontroller.deleteApiPurchasePriority)
router.post("/storeApiPurchasePriority", APIcontroller.storeApiPurchasePriority)



/*****Quotes Nirmal 01-12-2023 */
router.post("/getAllQuotes", verifyToken('Quotes-list'), QuotesController.getAllQuotes)
router.post("/changeQuotesStatus", verifyToken('Quotes-edit'), QuotesController.changeQuotesStatus)
router.post("/deleteQuotesDetail/:id", verifyToken('Quotes-delete'), QuotesController.deleteQuotesDetail)
router.post("/storeQuotes", verifyToken('Quotes-create'), QuotesController.storeQuotes)
router.post("/getSinglequotes/:id", verifyToken('Quotes-list'), QuotesController.getSinglequotes)
router.post("/editQuotedata/:id", verifyToken('Quotes-edit'), QuotesController.editQuotedata)

/********Dashboard**************/
router.post("/DashboardCount", Rcdetailcontroller.DashboardCount)
router.get("/Dashboard", Rcdetailcontroller.DashboardCountNEw)
router.post("/vehiclesourceCount", Rcdetailcontroller.vehiclesourceCount)


/********Clear redis cache**************/
router.get("/clear_cache",APIcontroller.clearCache)


router.post("/get_fail_data", getFailData)
router.post("/view_fail_data", viewFailData)

/********Dashboard API NEW **************/
router.get('/get_dashboard_summary',getDashboardSummary)


export default router;
