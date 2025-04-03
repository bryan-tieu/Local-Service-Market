from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask import session
import random

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = "lemonade"
CORS(app)  

# Database Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
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
    
# Create the database and tables
with app.app_context():
    db.create_all()

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
            
            # Return success response
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'userType': user.user_type
                }
            }), 200
        else:
            # Invalid password
            return jsonify({'message': 'Invalid password'}), 401
    
    # Error handling
    except Exception as e:
        return jsonify({'message': str(e)}), 500
        
        
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
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)