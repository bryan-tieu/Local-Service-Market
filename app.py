from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask import session
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = "lemonade"
CORS(app)  

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

class User(db.Model):     
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(128), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)
    
with app.app_context():
    db.create_all()

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        required_fields = ['name', 'email', 'password', 'userType']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400
            
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already exists'}), 409
        
        prefix = '0' if data['userType'] == 'employer' else '1'
        random_digits = ''.join([str(random.randint(0, 9)) for _ in range(7)])
        user_id = int(prefix + random_digits)
        
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user = User(
            id=user_id,
            name=data['name'],
            email=data['email'],
            password=hashed_password,
            user_type=data['userType']
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfuly',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'userType': user.user_type
            }
        }), 201
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Received data:", data)
        userID = data.get('userID')
        password = data.get('password')
        
        print("Extracted:", userID, password)
        if not userID or not password:
            return jsonify({'message': 'UserID and password are required'}), 400
        
        user = User.query.filter_by(id=userID).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if bcrypt.check_password_hash(user.password, password):
            session['user_id'] = user.id
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email
                }
            }), 200
        else:
            return jsonify({'message': 'Invalid password'}), 401
    except Exception as e:
        return jsonify({'message': str(e)}), 500
        
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': f"{user.id:08d}",
        'name': user.name,
        'email': user.email,
        'user_type': user.user_type
    } for user in users])
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)