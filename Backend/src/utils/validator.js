const VALID_STATUSES = ['pending', 'approved', 'rejected'];
//const VALID_PLATFORMS = ['instagram', 'twitter', 'linkedin', 'facebook'];

const validate_content_data = (data) => {
  const errors = [];

  if (!data.image_data || typeof data.image_data !== 'string') {
    errors.push('image_data is required and must be a base64 string');
  }

  if (!data.caption || typeof data.caption !== 'string' || data.caption.trim().length === 0) {
    errors.push('caption is required and cannot be empty');
  }

  return errors;
};

const validate_status = (status) => {
  if (!VALID_STATUSES.includes(status)) {
    return `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`;
  }
  return null;
};

// In utils/validator.js
const validate_social_platforms = (platforms) => {
  if (!platforms || platforms.length === 0) {
    return 'At least one social media platform must be selected';
  }

  const invalid = platforms.filter(p => typeof p !== 'string' || p.trim().length === 0);
  
  if (invalid.length > 0) {
    return 'All platforms must be non-empty strings';
  }

  return null;
};


const validate_update_data = (data) => {
  const errors = [];

  if (data.caption !== undefined && (typeof data.caption !== 'string' || data.caption.trim().length === 0)) {
    errors.push('caption cannot be empty');
  }

  if (data.status !== undefined) {
    const status_error = validate_status(data.status);
    if (status_error) errors.push(status_error);
  }

  return errors;
};

module.exports = {
  validate_content_data,
  validate_status,
  validate_social_platforms,
  validate_update_data
};