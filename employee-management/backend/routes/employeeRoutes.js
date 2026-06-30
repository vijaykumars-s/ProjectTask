import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getStats,
  getDepartments
} from '../controllers/employeeController.js';

const router = express.Router();

router.use(protect);

router.route('/stats').get(getStats);
router.route('/departments').get(getDepartments);

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.route('/:id')
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;
