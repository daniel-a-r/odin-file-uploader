import { Router } from 'express';
import controller from '../controllers/indexController.js';

const indexRouter = new Router();

indexRouter.get('/', controller.indexGet);

indexRouter
  .route('/sign-up')
  .get(controller.signUpGet)
  .post(controller.signUpPost);

// prettier-ignore
indexRouter
  .route('/login')
  .get(controller.loginGet)
  .post(controller.loginPost);

indexRouter.get('/logout', controller.logoutGet);

indexRouter.get('/dashboard', controller.dashboardGet);
indexRouter.get(
  '/dashboard/:currentFolderId',
  controller.dashboardCurrentFolderIdGet,
);

indexRouter.post(
  '/dashboard/:currentFolderId/new-folder',
  controller.newFolderPost,
);

export default indexRouter;
