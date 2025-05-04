from flask import Flask
from flask_cors import CORS
from extensions import bcrypt
from models import db
from blueprints.auth import auth_bp
from blueprints.tasks import tasks_bp
from blueprints.users import users_bp
from blueprints.skills import skills_bp
from blueprints.messages import messages_bp

# Initialize Flask app
app = Flask(__name__)

# App Config
app.config.update(
    SECRET_KEY = 'lemonade',
    
    # Session settings
    SESSION_COOKIE_NAME = 'my_cookie',
    SESSION_COOKIE_HTTPONLY = True,
    SESSION_COOKIE_SECURE = False,
    SESSION_COOKIE_SAMESITE = 'Lax',
    PERMANENT_SESSION_LIFETIME = 86400,  # 1 day in seconds
    
    # Required for Chrome/Firefox localhost testing
    SESSION_COOKIE_DOMAIN =None  
)

# CORS Settings
CORS(app, 
    supports_credentials=True,
    origins=["http://localhost:5174", "http://localhost:5173", "http://localhost:5000"],
    allow_headers=["Content-Type", "Authorization", "credentials", "Accept"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    expose_headers=["Set-Cookie"]
)
# Register blueprints with URL prefixes
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(tasks_bp, url_prefix='/api')
app.register_blueprint(skills_bp, url_prefix='/api')
app.register_blueprint(messages_bp, url_prefix='/api')
app.register_blueprint(users_bp, url_prefix='/api')

# Database Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
bcrypt.init_app(app)

# Create the database and tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
