from flask_sqlalchemy import SQLAlchemy
from extensions import db

# User Model
class User(db.Model):   
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True) 
    name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone_number = db.Column(db.String(15), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)

    #transactions_sent = db.relationship('Transaction', foreign_keys='Transaction.sender_id', back_populates='user', cascade="all, delete-orphan")
    #transactions_received = db.relationship()
    
class Skill(db.Model):
    __tablename__ = 'skill'
    id = db.Column(db.Integer, primary_key=True)
    skill_name = db.Column(db.String(80), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    proficiency = db.Column(db.Integer, nullable=False)
    years_of_experience = db.Column(db.Integer, nullable=False)
    user = db.relationship('User', backref='skills')

   # user = db.relationship()
    
class Task(db.Model):
    __tablename__ = 'task'
    id = db.Column(db.Integer, primary_key=True)
    task_title = db.Column(db.String(80), nullable=False)
    task_description = db.Column(db.String(200), nullable=False)
    task_type = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    budget = db.Column(db.Float, nullable=False)
    deadline = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) 
    created = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())
    worker_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    status = db.Column(db.String(20), default='Open')
    
    creator = db.relationship('User', foreign_keys=[user_id], backref='created_tasks')
    worker = db.relationship('User', foreign_keys=[worker_id], backref='assigned_tasks')

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    status = db.Column(db.String(20), nullable=False, default='Pending')

    sender = db.relationship('User', foreign_keys=[sender_id], backref='sent_transactions')
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='received_transactions')
    task = db.relationship('Task', backref='transactions')

class Message(db.Model):
    __tablename__ = 'message'
    id = db.Column(db.Integer, primary_key=True)
    
    # store just the IDs in the DB
    sender_id   = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    text      = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime(timezone=True),
                          nullable=False,
                          server_default=db.func.now())

    # relationships let you easily pull in the User object
    sender   = db.relationship('User', foreign_keys=[sender_id], backref='sent_messages')
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='received_messages')
