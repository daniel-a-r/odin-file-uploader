import { Router } from 'express';
import controller from '../controllers/dashboardController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = new Router();

router.get('/', controller.dashboardGet);
router.get('/:currentFolderId', controller.dashboardCurrentFolderIdGet);
router.post('/:currentFolderId/folder-create', controller.folderCreatePost);
router.post('/:currentFolderId/folder-rename', controller.folderRenamePost);
router.post('/:currentFolderId/folder-delete', controller.folderDeletePost);
router.post(
  '/:currentFolderId/file-upload',
  upload.single('uploadedFile'),
  controller.fileUploadPost,
);
router.post(
  '/:currentFolderId/folder-rename/:childFolderId',
  controller.childFolderRenamePost,
);
router.post(
  '/:currentFolderId/folder-delete/:childFolderId',
  controller.childFolderDeletePost,
);
router.post('/:currentFolderId/file-rename/:fileId', controller.fileRenamePost);

export default router;
