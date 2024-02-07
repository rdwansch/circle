import { Router } from 'express';
import ThreadController from '../controller/ThreadController';
import AuthenticateToken from '../middleware/AuthenticateToken';

import UploadFile from '../middleware/UploadFile';

const router = Router();

router.get('/thread', AuthenticateToken, ThreadController.findAll);
router.get('/thread/:id', AuthenticateToken, ThreadController.findById);
router.get('/thread/user/:id', AuthenticateToken, ThreadController.findByUserId);
router.post('/thread', AuthenticateToken, UploadFile.upload('image'), ThreadController.post);

export let reqSSE, resSSE;

router.get('/sse', (req, res) => {
  reqSSE = req;
  resSSE = res;
});

export default router;
