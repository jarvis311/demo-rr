import express from 'express';
const router = express.Router()

import { getUserList, userSignIn } from '../controller/UserAuthentication/UserAuthanticateCotroller.js';
import { checkUserPermission, createPermission, deletePermisssion, fetchPermission, fetchPermissionForRoles, getViwePermission, modulePermissionNameUpdate, updateUserPermission } from '../controller/UserAuthentication/PemissionController.js';
import { createRole, deleteRole, gteRoles, viewRoleWithPermission } from '../controller/UserAuthentication/Role.controller.js';
import { assingPermissionToRole, createUser, deleteUser, fetchUsers, getViweUser, testingRoutes, updateUser } from '../controller/UserAuthentication/UserController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

router.post('/signin', userSignIn)
router.post('/permission/create', createPermission)
router.post('/permission/get-permission', fetchPermission)
router.post('/permission/viwe-permission/:id', getViwePermission)
router.post('/permission/get-permission-role', fetchPermissionForRoles)
router.post('/permission/delete-permission/:id', deletePermisssion)
router.post('/permission/update-module/:id', modulePermissionNameUpdate)
// router.get('/get_user_list', getUserList)


router.post('/permission/update-permission/:id', updateUserPermission)
router.post('/check-permission', checkUserPermission)
router.post('/permission/roles', gteRoles)
router.post('/permission/roles-delete/:role_id', deleteRole)
// router.post('/protected-rotes', verifyToken, getAllPRotectedRouts)

router.post('/permission/fetch-user', fetchUsers)
router.post('/permission/create-user', createUser)
router.post('/permission/viwe-user/:id', getViweUser)
router.post('/permission/update-user/:id', updateUser)
router.post('/permission/delete-user/:id', deleteUser)

router.post('/permission/create-role', createRole)
router.post('/permission/assing-permission', assingPermissionToRole)
router.post('/permission/view-role', viewRoleWithPermission)
router.post('/testing', verifyToken('RC-Details-list'), testingRoutes)

export default router;