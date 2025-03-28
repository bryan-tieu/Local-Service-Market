from flask import Flask, redirect, url_for, render_template, request, session
from decorators import *
app = Flask(__name__)
app.secret_key = "Pink Lemonade"


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        userID = request.form["user_id"]
        if userID.startswith('0'):
            session['user'] = userID
            session['user_type'] = 'employer'
            return redirect(url_for("employer"))
        elif userID.startswith('1'):
            session['user'] = userID
            session['user_type'] = 'worker'
            return redirect(url_for("worker"))
        else:
            return render_template("login.html", error="Invalid ID")
    return render_template("login.html")

@app.route("/employer")
@login_required
@role_required('employer')
def employer():
    if "user" in session:
        return render_template("employer.html")

@app.route("/worker")
@login_required
@role_required('worker')
def worker():
    if "user" in session:
        return render_template("worker.html")
    
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == "__main__":
    app.run(debug=True)