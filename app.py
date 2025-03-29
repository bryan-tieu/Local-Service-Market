from flask import Flask, redirect, url_for, render_template, request, session
from decorators import *

app = Flask(__name__)
app.secret_key = "Pink Lemonade"

@app.route("/")
def home():
    return render_template("base.html")

@app.route("/auth/login", methods=["POST", "GET"])
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
            return render_template("auth/login.html", error="Invalid ID")
    return render_template("auth/login.html")

@app.route("/employer")
@login_required
@role_required('employer')
def employer():
    if "user" in session:
        return render_template("shared/list_tasks.html")

@app.route("/worker")
@login_required
@role_required('worker')
def worker():
    if "user" in session:
        return render_template("worker/worker_base.html")
    
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route("/employer/post_tasks", methods=["POST", "GET"])
@login_required
@role_required('employer')
def post_task():
    return render_template("employer/post_tasks.html")

@app.route("/shared/list_tasks", methods=["POST", "GET"])
@login_required
@role_required('employer')
def list_tasks():
    return render_template("shared/list_tasks.html")

@app.route("/account/account_info", methods=["POST", "GET"])
@login_required
def account_info():
    return render_template("account/account_info.html")

@app.route("/account/messages", methods=["POST", "GET"])
@login_required
def messages():
    return render_template("account/messages.html")
if __name__ == "__main__":
    app.run(debug=True)