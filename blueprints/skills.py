from flask import Blueprint, request, jsonify, session
from models import db, Skill, User
from blueprints.auth import login_required

skills_bp = Blueprint('skills', __name__)

# Get skills for current user
@skills_bp.route('/skills', methods=['GET'])
@login_required
def get_skills():
    
    try:
        #Extract Data
        user_id = session.get('user_id')
        skills = Skill.query.filter_by(user_id=user_id).all()
        
        # Return object
        return jsonify([{
            'id': skill.id,
            'skill_name': skill.skill_name,
            'proficiency': skill.proficiency,
            'years_of_experience': skill.years_of_experience
            } for skill in skills]), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Add a new skill
@skills_bp.route('/skills', methods=['POST'])
@login_required
def add_skill():
    
    try:
        #Extract data
        user_id = session.get('user_id')
        data = request.get_json()
        
        # print('Received data:', data)
        
        # Validate required fields
        required_fields = ['skill_name', 'proficiency', 'years_of_experience']
        if not all(field in data for field in required_fields):
            print('Required fields:', required_fields)
            return jsonify({'message': 'Missing required fields'}), 400

        # Validate proficiency range
        if not (1 <= data['proficiency'] <= 10):
            return jsonify({'message': 'Proficiency must be between 1-10'}), 400

        # Validate years_of_experience
        if data['years_of_experience'] < 0:
            return jsonify({'message': 'Experience cannot be negative'}), 400

        # Database object        
        skill = Skill(
            skill_name=data['skill_name'],
            proficiency=data['proficiency'],
            years_of_experience=data['years_of_experience'],
            user_id=user_id
        )
        
        # Add to database
        db.session.add(skill)
        db.session.commit()
        
        # Return success object
        return jsonify({
            'message': 'Skill added successfully',
            'skill': {
                'id': skill.id,
                'skill_name': skill.skill_name,
                'proficiency': skill.proficiency,
                'years_of_experience': skill.years_of_experience
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# Delete a skill
@skills_bp.route('/skills/<int:skill_id>', methods=['DELETE'])
@login_required
def delete_skill(skill_id):
    
    try:
        # Extract data
        user_id = session.get('user_id')
        skill = Skill.query.filter_by(id=skill_id, user_id=user_id).first()
        
        # No skills matched
        if not skill:
            return jsonify({'message': 'Skill not found'}), 404
        
        # Add to database
        db.session.delete(skill)
        db.session.commit()
        
        return jsonify({'message': 'Skill deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
    