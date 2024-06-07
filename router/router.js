import express from 'express';
const router = express.Router()
import  { scrappingResaleValue, scrappingResaleValueCompany, scrappingResaleValueModel, scrappingResaleValueTrim, scrappingResaleValueYear } from '../controller/index.js'


router.post('/resale-scrapping', scrappingResaleValue)
router.post('/resale-scrapping-company', scrappingResaleValueCompany)
router.post('/resale-scrapping-model', scrappingResaleValueModel)
router.post('/resale-scrapping-year', scrappingResaleValueYear)
router.post('/resale-scrapping-trim', scrappingResaleValueTrim)

export default router;
