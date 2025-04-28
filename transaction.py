from models.transaction import Transaction # import the models of transaction table
from app import db # an instance bridge to do transactions
from flask import redirect, url_for, flash

def create_transaction(transaction_id, sender_id, receiver_id, amount, task_id=None):
    new_transaction = Transaction(
        id=transaction_id,
        sender_id=sender_id,
        receiver_id=receiver_id,
        amount=amount,
        task_id=task_id,
        status="Pending"
    )
    db.session.add(new_transaction)
    db.session.commit()

    return new_transaction

@app.route('/transactions/<int>:transaction_id>', methods=['PUT'])
def edit_transaction(transaction_id):
    data = request.get_json()

    transaction = Transaction.query.get(transaction_id)
    if transaction:
        transaction.amount = data.get('amount', transaction.amount)
        transaction.description = data.get('description', transaction.description)
        db.session.commit()
        return jsonify({'message': 'Transaction updated successfully'})
    else:
        return jsonify({'message': 'Transaction not found'}), 404

@app.route('/cancel_transaction/<int:transaction_id>', methods=['POST'])
def cancel_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)

    transaction.status = "Cancelled"
    db.session.commit()

    flash('Transaction has been cancelled', 'success')
    return redirect(url_for('transaction_page'))

