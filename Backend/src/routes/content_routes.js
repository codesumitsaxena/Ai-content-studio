const express = require('express');
const ContentController = require('../controllers/content_controller');

const router = express.Router();

router.post('/content', ContentController.create_content);
router.get('/content', ContentController.get_all_content);
router.get('/content/:id', ContentController.get_content_by_id);
router.put('/content/:id', ContentController.update_content);
router.patch('/content/:id/approve', ContentController.approve_content);
router.patch('/content/:id/reject', ContentController.reject_content);
router.delete('/content/:id', ContentController.delete_content);

module.exports = router;