from flask import Blueprint, request, jsonify, session
from models import db, Message
from blueprints.auth import login_required

messages_bp = Blueprint('messages', __name__)

# Message another account
@messages_bp.route('/messages', methods=['GET'])
@login_required
def get_messages():
    me = session['user_id']
    user_filter = request.args.get('user')
    print("Now filtering by user:", user_filter)  # DEBUGGING
    if user_filter != 'All':
        msgs = Message.query.filter(
            ((Message.sender_id == me) & (Message.receiver_id == user_filter)) |
            ((Message.sender_id == user_filter) & (Message.receiver_id == me))
        ).order_by(Message.timestamp).all()
        
    elif user_filter == 'All':
        msgs = Message.query.filter(
            (Message.sender_id   == me) |
            (Message.receiver_id == me)
        ).order_by(Message.timestamp).all()

    return jsonify([{
        'id'         : m.id,
        'text'       : m.text,
        'timestamp'  : m.timestamp.isoformat(),
        'sender_id'  : m.sender_id,          # internal reference
        'sender_name': m.sender.name,        # for display
        'receiver_id': m.receiver_id,
        'receiver_name': m.receiver.name
    } for m in msgs])


@messages_bp.route('/messages', methods=['POST'])
@login_required
def post_message():
    data = request.get_json()
    sender_id   = session['user_id']
    receiver_id = data.get('receiver_id')
    text        = data.get('text', '').strip()
    if not receiver_id or not text:
        return jsonify({'message':'receiver_id and text required'}), 400

    m = Message(sender_id=sender_id, receiver_id=receiver_id, text=text)
    db.session.add(m)
    db.session.commit()

    return jsonify({
        'id'          : m.id,
        'text'        : m.text,
        'timestamp'   : m.timestamp.isoformat(),
        'sender_id'   : m.sender_id,
        'sender_name' : m.sender.name
    }), 201