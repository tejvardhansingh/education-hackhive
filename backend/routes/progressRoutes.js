import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import {
  listMyProgress,
  getCourseProgress,
  startCourse,
  updateCourseProgress,
} from '../controllers/progressController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', listMyProgress);
router.get('/:courseTitle', getCourseProgress);
router.post('/start', startCourse);
router.put('/:courseTitle', updateCourseProgress);

export default router;
