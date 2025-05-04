from flask import Blueprint, request, jsonify, session
from models import db, Task, User
from blueprints.auth import login_required
from datetime import datetime, timezone
import pytz

tasks_bp = Blueprint('tasks', __name__)

# Used to get specific tasks for employers
@tasks_bp.route('/tasks', methods=['GET'])
def get_tasks():
    
    try:
        
        user_id = session.get('user_id')
        user_id_str = str(user_id)

        status_filter = request.args.get('status')
        print("Status filter:", status_filter)  # DEBUGGING
        # Check if user is authenticated
        if not user_id:
            return jsonify({'message': 'Not authenticated'}), 401
    
        # Checks for employer/worker (workers will have 8 digits while employers have 0 because of 
        # leading zero in employers ID)
        if len(user_id_str) == 8:
            query = Task.query.filter_by(worker_id=user_id)
        else:
            query = Task.query.filter_by(user_id=user_id)
            
        print("Now filtering by status:", status_filter)  # DEBUGGING
        if status_filter == 'Completed':
            query = query.filter_by(status='Completed')
        elif status_filter == 'Incomplete':
            query = query.filter(Task.status != 'Completed') 
            
        tasks = query.all()
        
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
            'worker_name': task.worker.name if task.worker else None,
            'worker_id': f"{task.worker_id:08d}" if task.worker_id else None,
            
        } for task in tasks])
        
    except Exception as error:
        return jsonify({'message': str(error)}), 500

# Find tasks for workers
@tasks_bp.route('/find_tasks', methods=['GET'])
@login_required
def find_tasks():
    try:
        
        # Find all open tasks
        tasks = Task.query.filter_by(status='Open').all()
        pst = pytz.timezone('America/Los_Angeles')
        
        # Return tasks as JSON
        return jsonify([{
            'id': task.id,
            'date_created': task.created.astimezone(pst).isoformat() if task.created else None,
            'task_title': task.task_title,
            'task_description': task.task_description,
            'task_type': task.task_type,
            'location': task.location,
            'budget': task.budget,
            'deadline': task.deadline,
            'user_id': f"{task.user_id:08d}",
            'employer_name': task.creator.name,
            'status': task.status,
            'user_type': 'Worker',
        } for task in tasks])
        
    except Exception as error:
        return jsonify({'message': str(error)}), 500
    

    
# Post Task Feature for employers
@tasks_bp.route('/post_task', methods=['POST'])
def post_task():
    
    # Check if user is authenticated
    if 'user_id' not in session:
        return jsonify({'message': 'Please login first'}), 401
    
    user_id = session.get('user_id')
    
    # Check if user exists
    if not user_id:
        return jsonify({'message': 'Not authenticated'}), 401
    
    user = User.query.get(user_id)
    
    # Check if user exists
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    try:
        data = request.get_json()
        
        # Check for required fields
        required_fields = ['task_title', 'task_description', 'task_type', 'location', 'budget', 'deadline']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Store task in the database
        task = Task(
            user_id=user.id,
            task_title=data['task_title'],
            task_description=data['task_description'],
            task_type=data['task_type'],
            location=data['location'],
            status='Open',
            budget=data['budget'],
            deadline=data['deadline'],
            created=datetime.now(timezone.utc).astimezone(pytz.timezone('America/Los_Angeles'))                                  
        )
        
        db.session.add(task)
        db.session.commit()
        
        # Return success response
        return jsonify({
            'message': 'Task posted successfully',
            'task': {
                'id': task.id,
                'user_id': task.user_id,
                'task_title': task.task_title,
                'task_description': task.task_description,
                'task_type': task.task_type,
                'location': task.location,
                'budget': task.budget,
                'deadline': task.deadline,
                'status': task.status,
                'created': task.created.isoformat()
            }
        }), 201
        
    except ValueError as error:
        return jsonify({'message': 'Invalid date format'}), 400
    except Exception as error:
        db.session.rollback() 
        return jsonify({'message': str(error)}), 500


    

# Workers Flow for accepting a task
@tasks_bp.route('/tasks/<int:task_id>/accept', methods=['POST'])
@login_required
def accept_task(task_id):
    try:
        user_id = session.get('user_id')
        task = Task.query.get(task_id)
        
        # Check if task is still available/not taken
        if not task:
            return jsonify({'message': 'Task not found'}), 404
        if task.status != 'Open':
            return jsonify({'message': 'Task is no longer available'}), 400
        
        # Assign the worker to the task
        task.worker_id = user_id
        task.status = 'Assigned'
        db.session.commit()
        
        return jsonify({'message': 'Task accepted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
    
# Workers Flow for completing a task
@tasks_bp.route('/tasks/<int:task_id>/complete', methods=['POST'])
@login_required
def complete_task(task_id):
    try:
        user_id = session.get('user_id')
        task = Task.query.get(task_id)
        
        # Check if task is assigned to the worker
        if not task:
            return jsonify({'message': 'Task not found'}), 404
        if task.worker_id != user_id:
            return jsonify({'message': 'You are not assigned to this task'}), 403
        
        # Mark the task as completed
        task.status = 'Completed'
        db.session.commit()
        
        return jsonify({'message': 'Task marked as completed successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
    