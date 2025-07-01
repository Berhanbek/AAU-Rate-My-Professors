from flask import Flask, request, jsonify
import ratemyprofessordb as database
import json
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, origins=["https://aau-rate-my-professors.onrender.com"])

@app.route('/api/search', methods=['GET'])
def api_search_professor():
    query = request.args.get('q', '')
    result_json = database.search_professor(query)
    return jsonify({"results": json.loads(result_json)})

@app.route('/api/professor/<int:prof_id>/short', methods=['GET'])
def api_load_professor_short(prof_id):
    result_json = database.load_professor_short(prof_id)
    return jsonify(json.loads(result_json))

@app.route('/api/professor/<int:prof_id>/long', methods=['GET'])
def api_load_professor_long(prof_id):
    result_json = database.load_professor_long(prof_id)
    return jsonify(json.loads(result_json))

@app.route('/api/professor/<int:prof_id>/review', methods=['POST'])
def api_create_review(prof_id):
    data = request.get_json()
    content = data.get("content")
    workload = data.get("workload")
    fairness = data.get("fairness")
    difficulty = data.get("difficulty")
    attendance = data.get("attendance")
    engagement = data.get("engagement")
    course_taken = data.get("course_taken")
    grade = data.get("grade")
    # All rating fields are required and must be between 1 and 5
    if not content or any(
        v is None or not (1 <= int(v) <= 5)
        for v in [workload, fairness, difficulty, attendance, engagement]
    ):
        return jsonify({"success": False, "error": "Missing or invalid required fields"}), 400
    result_json = database.create_review(
        prof_id, content, int(workload), int(fairness), int(difficulty), int(attendance), int(engagement), course_taken, grade
    )
    return jsonify(json.loads(result_json))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)