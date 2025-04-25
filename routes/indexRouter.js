import { Router } from 'express';
import controller from '../controllers/indexController.js';

const router = new Router();

router.get('/', controller.indexGet);

// prettier-ignore
router
  .route('/sign-up')
  .get(controller.signUpGet)
  .post(controller.signUpPost);

// prettier-ignore
router
  .route('/login')
  .get(controller.loginGet)
  .post(controller.loginPost);

router.get('/logout', controller.logoutGet);

export default router;
