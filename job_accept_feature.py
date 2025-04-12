from flask import Flask, request, jsonify
from models import db, Task


@app.route('/accept_task/<int:task_id>'), methods=['POST'])
def accept_job(task_id):
    worker_id = request.json.get('worker_id')

    task = Task.query.get(task_id)

    if not task:
        return jsonify({'error': 'Task not found'}), 404
    if task.status != 'open':
        return jsonify({'error': 'Task already taken'}), 404

    task.worker_id = worker_id
    task.status = 'accepted'
    db.session.commit()

    return jsonify({'message': f'Task {task_id} accepted by worker {worker_id}'}), 200

