const { pool } = require('../config/database');

class ContentModel {
  static async create(image_name, image_path, caption) {
    const query = `
      INSERT INTO generated_content (image_name, image_path, caption)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.execute(query, [image_name, image_path, caption]);
    return result.insertId;
  }

  static async find_by_id(id) {
    const query = 'SELECT * FROM generated_content WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  static async find_all(filters = {}) {
    let query = 'SELECT * FROM generated_content WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
      
      if (filters.offset) {
        query += ' OFFSET ?';
        params.push(parseInt(filters.offset));
      }
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async update(id, updates) {
    const allowed_fields = ['caption', 'status', 'social_media_posted'];
    const set_clauses = [];
    const params = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowed_fields.includes(key) && value !== undefined) {
        set_clauses.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (set_clauses.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(id);
    const query = `
      UPDATE generated_content 
      SET ${set_clauses.join(', ')} 
      WHERE id = ?
    `;

    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
  }

// In models/content_model.js
static async approve(id, social_media_posted) {
  // Directly store the JSON object (no conversion needed)
  return this.update(id, {
    status: 'approved',
    social_media_posted: JSON.stringify(social_media_posted)
  });
}

static async reject(id) {
  return this.update(id, { 
    status: 'rejected',
    social_media_posted: null  // Add this line
  });
}

  static async delete(id) {
    const query = 'DELETE FROM generated_content WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  static async count(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM generated_content WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }
}

module.exports = ContentModel;