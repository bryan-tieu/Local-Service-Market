from flask import Blueprint, request, jsonify, session
from extensions import bcrypt, db
from models import User
from functools import wraps
import random

auth_bp = Blueprint('auth', __name__)

# Decorators
# Requires users to be logged in
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('user_id'):
            return jsonify({'authenticated': False}), 401
        return f(*args, **kwargs)
    return decorated_function

# Routes

# Signup Route
@auth_bp.route('/signup', methods=['POST'])
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
            phone_number=data['phoneNumber'],
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
                'phone_number': user.phone_number,
                'userType': user.user_type
            }
        }), 201
    
    # Error handling
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# Login Route
@auth_bp.route('/login', methods=['POST'])
def login():
    
    try:
        data = request.get_json()

        # Extract data
        userEmail = data.get('userEmail')
        password = data.get('password')
        
        
        # Check for required fields
        if not userEmail or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Find user by Email
        user = User.query.filter_by(email=userEmail).first()
        print(user) # DEBUGGING
        
        # Check if user exists
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Check password
        if bcrypt.check_password_hash(user.password, password):
            
            # Store user ID in session
            session['user_id'] = user.id
            
            # Return success response
            return jsonify({
                'authenticated': True,
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'phone_number': user.phone_number,
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
        
# Logout Feature 
@auth_bp.route('/logout', methods=['POST'])
def logout():
    
    try:
        
        # Clear the session
        session.clear()
        response = jsonify({'message': 'Logged out successfully'})
        
        # Clear the cookie
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
    
# Authentication checking, check if user is logged in
@auth_bp.route('/check-auth', methods=['GET'])
@login_required
def check_auth():
    
    try:
        user_id = session.get('user_id')
        
        # Check if user is authenticated
        if not user_id:
            return jsonify({'message': 'Not authenticated'}), 401
        
        user = User.query.filter_by(id=user_id).first()
        
        # Check if user exists
        if not user:
            return jsonify({'message': 'User not found'}), 401
        
        # Return user information
        return jsonify({
            'authenticated': True,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone_number': user.phone_number,
                'userType': user.user_type
            }
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500