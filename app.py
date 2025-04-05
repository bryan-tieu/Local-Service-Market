from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask import session
from functools import wraps 
from datetime import datetime, timezone
import pytz
import random

# Initialize Flask app
app = Flask(__name__)
# Add these critical session configurations ABOVE your routes
app.config.update(
    # Use a proper secret key (not "lemonade")
    SECRET_KEY = 'lemonade',
    
    # Session settings
    SESSION_COOKIE_NAME = 'my_cookie',
    SESSION_COOKIE_HTTPONLY = True,
    SESSION_COOKIE_SECURE = False,  # True in production with HTTPS
    SESSION_COOKIE_SAMESITE = 'Lax',
    PERMANENT_SESSION_LIFETIME = 86400,  # 1 day in seconds
    
    # Required for Chrome/Firefox localhost testing
    SESSION_COOKIE_DOMAIN =None  
)

# Update CORS to be more permissive for debugging
CORS(app, 
    supports_credentials=True,
    origins=["http://localhost:5174", "http://localhost:5173"],
    allow_headers=["Content-Type", "Authorization", "credentials"],
    methods=["GET", "POST", "PUT", "DELETE"],
    expose_headers=["Set-Cookie"]
)

# Database Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# User Model
class User(db.Model):   
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True) 
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(128), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)

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
    
    user = db.relationship('User', backref='tasks')
    
# Create the database and tables
with app.app_context():
    db.create_all()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('user_id'):
            return jsonify({'authenticated': False}), 401
        return f(*args, **kwargs)
    return decorated_function

# Routes
# Signup Route
@app.route('/api/signup', methods=['POST'])
def signup():
    
    try:
        data = request.get_json()
        
        # Check for required fields
        required_fields = ['name', 'email', 'password', 'userType']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400
            
        # Check if email already exists (should be unique for each user)
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already exists'}), 409
        
        # Generate a unique user ID (0 for employer, 1 for worker)
        prefix = '0' if data['userType'] == 'Employer' else '1'
        random_digits = ''.join([str(random.randint(0, 9)) for _ in range(7)])
        user_id = int(prefix + random_digits)
        
        # Hash the password
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create a new user
        user = User(
            id=user_id,
            name=data['name'],
            email=data['email'],
            password=hashed_password,
            user_type=data['userType']
        )
        
        # Add user to the database
        db.session.add(user)
        db.session.commit()
        
        # Return success response
        return jsonify({
            'message': 'User created successfuly',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'userType': user.user_type
            }
        }), 201
    
    # Error handling
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# Login Route
@app.route('/api/login', methods=['POST'])
def login():
    
    try:
        data = request.get_json()
        
        # Extract data
        userID = data.get('userID')
        password = data.get('password')
        
        # Check for required fields
        if not userID or not password:
            return jsonify({'message': 'UserID and password are required'}), 400
        
        # Find user by ID
        user = User.query.filter_by(id=userID).first()
        
        # Check if user exists
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Check password
        if bcrypt.check_password_hash(user.password, password):
            
            # Store user ID in session
            session['user_id'] = user.id
            session['user_id'] = user.id  # Store user ID in session
            
            # Return success response
            return jsonify({
                'authenticated': True,
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'userType': user.user_type
                }
            })
            
        else:
            # Invalid password
            return jsonify({'authentication': False}), 401
    
    # Error handling
    except Exception as error:
        return jsonify({
            'authenticated': False,
            'message': str(error)
            }), 500
        
        
# User Database Route (manual testing)
@app.route('/api/users', methods=['GET'])
def get_users():
    # Fetch all users from the database
    users = User.query.all()
    
    # Return users as JSON
    return jsonify([{
        'id': f"{user.id:08d}",
        'name': user.name,
        'email': user.email,
        'user_type': user.user_type
    } for user in users])

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'message': 'Not authenticated'}), 401
        
        tasks = Task.query.filter_by(user_id=user_id).all()
        pst = pytz.timezone('America/Los_Angeles')
        return jsonify([{
            'id': task.id,
            'date_created': task.created.astimezone(pst).isoformat() if task.created else None,
            'task_title': task.task_title,
            'task_description': task.task_description,
            'task_type': task.task_type,
            'location': task.location,
            'budget': task.budget,
            'deadline': task.deadline,
            'user_id': f"{task.user_id:08d}"
        } for task in tasks])
        
    except Exception as error:
        return jsonify({'message': str(error)}), 500

@app.route('/api/check-auth', methods=['GET'])
@login_required
def check_auth():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'message': 'Not authenticated'}), 401
        
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 401
        
        return jsonify({
            'authenticated': True,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'userType': user.user_type
            }
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
@app.route('/api/posttask', methods=['POST'])
def post_task():
    print(f"Current session: {session}")
    print(f"Session contents: {dict(session)}")
    print(f"Cookies received: {request.cookies}")
    if 'user_id' not in session:
        return jsonify({'message': 'Please login first'}), 401
    
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'Not authenticated'}), 401
    
    user = User.query.get(user_id)
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
            budget=data['budget'],
            deadline=data['deadline']
        )
        
        db.session.add(task)
        db.session.commit()
        
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
                'deadline': task.deadline
            }
        }), 201
        
    except ValueError as error:
        return jsonify({'message': 'Invalid date format'}), 400
    except Exception as error:
        db.session.rollback() 
        return jsonify({'message': str(error)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        response = jsonify({'message': 'Logged out successfully'})
        
        response.set_cookie(
            'my_cookie',
            value='',
            expires=0,
            httponly=True,
            samesite='Lax',
            path='/'
        )
        
        return response
    except Exception as error:
        return jsonify({'message': str(error)}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)