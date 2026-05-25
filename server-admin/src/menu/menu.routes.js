import { Router } from 'express';
import { getMenus, createMenu, updateMenu, deleteMenu, restoreMenu } from './menu.controller.js';
import { validateJWT } from '../../middleware/validate-JWT.js';

const router = Router();

router.get('/',              getMenus);
router.post('/',             validateJWT, createMenu);
router.put('/:id',           validateJWT, updateMenu);
router.patch('/delete/:id',  deleteMenu);
router.patch('/restore/:id', restoreMenu);

console.log('✅ menu.routes cargado');
export default router;