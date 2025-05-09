from flask import Blueprint, jsonify, request, session
from models import db, Transaction, Task, User
from blueprints.auth import login_required
from datetime import datetime

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('/complete-task/<int:task_id>/complete', methods=['POST'])
@login_required
def complete_task(task_id):
    try:
        
        # Extract data
        task = Task.query.get_or_404(task_id)
        user_id = session.get('user_id')
        
        # Verify the current user is the assigned worker
        if user_id != task.worker_id:
            return jsonify({'error': 'You are not assigned to this task'}), 403
        
        # Verify the task is assigned
        if task.status != 'Assigned':
            return jsonify({'error': 'Task is not in progress'}), 400
        
        # Create a new transaction
        transaction = Transaction(
            sender_id=task.user_id,  
            receiver_id=task.worker_id,  
            task_id=task.id,
            amount=task.budget,
            description=f"Payment for task: {task.task_title}",
            status='Completed'
        )
        task.status = 'Completed'
        
        # Add transaction to the database
        db.session.add(transaction)
        db.session.commit()
        
        # Update task status once transaction is successfully added
        
        response = jsonify({
            'message': 'Task completed and payment initiated',
            'transaction': {
                'id': transaction.id,
                'amount': transaction.amount,
                'status': transaction.status,
                'description': transaction.description
            }
        })

        return response
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@transactions_bp.route('/transactions/received', methods=['GET'])
@login_required
def get_received_transactions():
    
    try:
        # Extract data
        user_id = session.get('user_id')
        
        # Query transactions where the current user is the receiver
        transactions = Transaction.query.filter_by(receiver_id=user_id).all()
        
        # Return list of transactions for the specific user
        return jsonify({
            'transactions': [{
                'id': t.id,
                'amount': t.amount,
                'status': t.status,
                'timestamp': t.timestamp.isoformat() if t.timestamp else None,
                'description': t.description,
                'task': {
                    'id': t.task.id,
                    'task_title': t.task.task_title,
                    'budget': t.task.budget
                } if t.task else None
            } for t in transactions]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 

@transactions_bp.route('/transactions/sent', methods=['GET'])
@login_required
def get_sent_transactions():
    
    try: 
        #Extract the dat
        user_id = session.get('user_id')
        
        transactions = Transaction.query.filter_by(sender_id=user_id).all()
        
        return jsonify({
            'transactions': [{
                'id': t.id,
                'amount': t.amount,
                'status': t.status,
                'timestamp': t.timestamp.isoformat() if t.timestamp else None,
                'description': t.description,
                'task': {
                    'id': t.task.id,
                    'task_title': t.task.task_title,
                    'budget': t.task.budget
                } if t.task else None
            } for t in transactions]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500