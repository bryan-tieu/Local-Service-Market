from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        print("Received data:", data) 
        
        if not data or 'name' not in data or 'password' not in data:
            return jsonify({'message': 'Name and password are required'}), 400
        
        name = data['name']
        email = data['email']
        password = data['password']
        
        response_data = {
            'status': 'success',
            'message': 'User registered successfully',
            'user': {
                'name': name,
                'email': email,
            }
        }
        
        return jsonify(response_data), 201
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)