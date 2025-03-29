from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

from LocalServiceMarket.auth import login_required
from LocalServiceMarket.db import get_db

bp = Blueprint('listing', __name__)

@bp.route('/')
def index():
    db = get_db()
    listings = db.execute(
        'SELECT p.id, title, body, created, creator_id, username'
        ' FROM listing p JOIN user u ON p.creator_id = u.id'
        ' ORDER BY created DESC'
    ).fetchall()
    return render_template('listing/index.html', listings=listings)

@bp.route('/create', methods=('GET', 'POST'))
@login_required
def create():
    if request.method == 'POST':
        title = request.form['title']
        body = request.form['body']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'INSERT INTO listing (title, body, creator_id)'
                ' VALUES (?, ?, ?)',
                (title, body, g.user['id'])
            )
            db.commit()
            return redirect(url_for('listing.index'))

    return render_template('listing.create.html')

def get_listing(id, check_creator=True):
    listing = get_db().execute(
        'SELECT p.id, title, body, created, creator_id, username'
        ' FROM listing p JOIN user u ON p.creator.id = u.id'
        ' WHERE p.id = ?',
        (id)
    ).fetchone()

    if listing is None:
        abort(404, f"Listing {id} doesn't exist.")

    if check_creator and listing['creator_id'] != g.user['id']:
        abort(403)

    return listing

@bp.route('/<int:id>/update', methods=('GET', 'POST'))
@login_required
def update(id):
    listing = get_listing(id)

    if request.method == 'POST':
        title = request.form['title']
        body = request.form['body']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'UPDATE listing SET title = ?, body = ?'
                ' Where id = ?',
                (title, body, id)
            )
            db.commit()
            return redirect(url_for('listing.index'))

    return render_template('listing/update.html', listing=listing)

@bp.route('/<int:id>/delete', methods=('POST'))
@login_required
def delete(id):
    get_listing(id)
    db = get_db()
    db.execute('DELETE FROM listing WHERE id = ?', (id))
    db.commit()
    return redirect(url_for('listing.index'))