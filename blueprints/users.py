from flask import Blueprint, request, jsonify, session
from models import db, User, Task
import pytz

users_bp = Blueprint('users', __name__)

# User Database Route (manual testing)
@users_bp.route('/users', methods=['GET'])
def get_users():
    # Extract data
    users = User.query.all()
    
    # Return users as JSON
    return jsonify([{
        'id': f"{user.id:08d}",
        'name': user.name,
        'email': user.email,
        'phone_number': user.phone_number,
        'user_type': user.user_type
    } for user in users])

# Fetch all tasks in DB, Used as a debugger
@users_bp.route('/get_all_tasks', methods=['GET'])
def get_all_tasks():
    try:
        tasks = Task.query.all()
        pst = pytz.timezone('America/Los_Angeles')
        
        # Return tasks as JSON
        return jsonify([{
            'id': task.id,
            'date_created': task.created.astimezone(pst).isoformat() if task.created else None,
            'task_title': task.task_title,
            'task_description': task.task_description,
            'task_type': task.task_type,
            'location': task.location,
            'status': task.status,
            'budget': task.budget,
            'deadline': task.deadline,
            'user_id': f"{task.user_id:08d}",
            'worker_id': f"{task.worker_id:08d}" if task.worker_id else None,
            'employer_name': task.creator.name,
            'employer_id': f"{task.user_id:08d}",
            'worker_name': task.worker.name if task.worker else None,
            'worker_id': f"{task.worker_id:08d}" if task.worker_id else None,
        } for task in tasks])
        
    except Exception as error:
        return jsonify({'message': str(error)}), 500
    