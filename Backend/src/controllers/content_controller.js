const ContentModel = require('../models/content_model');
const { save_base64_image, delete_image } = require('../utils/file_helper');
const {
  validate_content_data,
  validate_social_platforms,
  validate_update_data
} = require('../utils/validator');

class ContentController {
  static async create_content(req, res, next) {
    try {
      const { image_data, caption } = req.body;

      const validation_errors = validate_content_data({ image_data, caption });
      if (validation_errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors: validation_errors
        });
      }

      const { image_name, image_path } = await save_base64_image(image_data);
      const content_id = await ContentModel.create(image_name, image_path, caption);

      res.status(201).json({
        success: true,
        message: 'Content created successfully',
        data: {
          id: content_id,
          image_name,
          image_path,
          caption,
          status: 'pending'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async get_all_content(req, res, next) {
    try {
      const { status, limit, offset } = req.query;
      
      const filters = {};
      if (status) filters.status = status;
      if (limit) filters.limit = limit;
      if (offset) filters.offset = offset;

      const content_list = await ContentModel.find_all(filters);
      const total = await ContentModel.count(filters);

      res.status(200).json({
        success: true,
        data: content_list,
        pagination: {
          total,
          limit: parseInt(limit) || total,
          offset: parseInt(offset) || 0
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async get_content_by_id(req, res, next) {
    try {
      const { id } = req.params;
      const content = await ContentModel.find_by_id(id);

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      res.status(200).json({
        success: true,
        data: content
      });
    } catch (error) {
      next(error);
    }
  }

  static async update_content(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const validation_errors = validate_update_data(updates);
      if (validation_errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors: validation_errors
        });
      }

      const content = await ContentModel.find_by_id(id);
      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      const updated = await ContentModel.update(id, updates);

      if (!updated) {
        return res.status(400).json({
          success: false,
          message: 'No changes made'
        });
      }

      const updated_content = await ContentModel.find_by_id(id);

      res.status(200).json({
        success: true,
        message: 'Content updated successfully',
        data: updated_content
      });
    } catch (error) {
      next(error);
    }
  }

static async approve_content(req, res, next) {
  try {
    const { id } = req.params;
    const { social_media_posted } = req.body;

    // Check if social_media_posted is an object
    if (!social_media_posted || typeof social_media_posted !== 'object' || Array.isArray(social_media_posted)) {
      return res.status(400).json({
        success: false,
        message: 'social_media_posted must be an object'
      });
    }

    // Validate that all values are 0 or 1
    const invalid_values = Object.entries(social_media_posted).filter(
      ([key, value]) => value !== 0 && value !== 1
    );

    if (invalid_values.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'All platform values must be 0 or 1'
      });
    }

    // Check at least one platform is selected (has value 1)
    const has_selected = Object.values(social_media_posted).some(val => val === 1);
    if (!has_selected) {
      return res.status(400).json({
        success: false,
        message: 'At least one platform must be set to 1'
      });
    }

    const content = await ContentModel.find_by_id(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    await ContentModel.approve(id, social_media_posted);
    const updated_content = await ContentModel.find_by_id(id);

    res.status(200).json({
      success: true,
      message: 'Content approved successfully',
      data: updated_content
    });
  } catch (error) {
    next(error);
  }
}

  static async reject_content(req, res, next) {
    try {
      const { id } = req.params;

      const content = await ContentModel.find_by_id(id);
      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      await ContentModel.reject(id);
      const updated_content = await ContentModel.find_by_id(id);

      res.status(200).json({
        success: true,
        message: 'Content rejected successfully',
        data: updated_content
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete_content(req, res, next) {
    try {
      const { id } = req.params;

      const content = await ContentModel.find_by_id(id);
      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      await delete_image(content.image_path);
      await ContentModel.delete(id);

      res.status(200).json({
        success: true,
        message: 'Content deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ContentController;