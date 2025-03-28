from functools import wraps 
from flask import redirect, url_for, session

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_type' not in session or session['user_type'] != role:
                return redirect(url_for('login'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator
