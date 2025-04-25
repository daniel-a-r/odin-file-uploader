import { Router } from 'express';
import controller from '../controllers/dashboardController.js';

const router = new Router();

router.get('/', controller.dashboardGet);
router.get('/:currentFolderId', controller.dashboardCurrentFolderIdGet);

router.post('/:currentFolderId/new-folder', controller.newFolderPost);
router.post('/:currentFolderId/folder-rename', controller.renamePost);

export default router;
