import { Router } from 'express';
import { requireAuthentication, requireAuthorization } from '../middleware';
import { customers, orders } from '../handlers/api';

const router = Router();

router.use(requireAuthentication); // has SSO login
router.use(requireAuthorization); // has SCA macaroon
router.post('/purchases/customers', customers);
router.post('/purchases/orders', orders);

export default router;
