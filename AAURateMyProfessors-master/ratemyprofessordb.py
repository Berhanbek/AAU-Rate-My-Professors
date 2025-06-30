import os
from dotenv import load_dotenv
load_dotenv()
import mysql.connector
import json

def get_conn():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE"),
        port=int(os.getenv("MYSQL_PORT", 3306)),
        charset="utf8mb4"
    )

def init_db():
    conn = get_conn()
    c = conn.cursor()
    # Create staff table with nullable rating field
    c.execute('''
        CREATE TABLE IF NOT EXISTS staff (
            id INT AUTO_INCREMENT PRIMARY KEY,
            photo_path VARCHAR(255),
            name VARCHAR(255) NOT NULL,
            gender VARCHAR(32),
            nationality VARCHAR(64),
            college VARCHAR(128),
            department VARCHAR(128),
            specialization VARCHAR(128),
            qualification VARCHAR(128),
            position VARCHAR(128),
            academic_rank VARCHAR(128),
            email VARCHAR(128),
            rating FLOAT
        )
    ''')
    # Create reviews table with new rating fields
    c.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            staff_id INT NOT NULL,
            content TEXT NOT NULL,
            workload INT,
            fairness INT,
            difficulty INT,
            attendance INT,
            engagement INT,
            rating FLOAT,
            course_taken VARCHAR(64),
            grade VARCHAR(16),
            FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
        )
    ''')
    conn.commit()
    c.close()
    conn.close()

def update_professor_rating(staff_id):
    conn = get_conn()
    c = conn.cursor()
    c.execute('SELECT AVG(rating) FROM reviews WHERE staff_id = %s', (staff_id,))
    avg_rating = c.fetchone()[0]
    c.execute('UPDATE staff SET rating = %s WHERE id = %s', (avg_rating, staff_id))
    conn.commit()
    c.close()
    conn.close()

def load_professor_short(prof_id):
    conn = get_conn()
    c = conn.cursor()
    c.execute('SELECT * FROM staff WHERE id = %s', (prof_id,))
    row = c.fetchone()
    keys = [desc[0] for desc in c.description]
    c.close()
    conn.close()
    if row:
        return json.dumps(dict(zip(keys, row)))
    return json.dumps({})

def search_professor(query):
    conn = get_conn()
    c = conn.cursor()
    like_query = f"%{query}%"
    c.execute('''
        SELECT * FROM staff
        WHERE
            name LIKE %s OR
            gender LIKE %s OR
            nationality LIKE %s OR
            college LIKE %s OR
            department LIKE %s OR
            specialization LIKE %s OR
            qualification LIKE %s OR
            position LIKE %s OR
            academic_rank LIKE %s OR
            email LIKE %s
    ''', (
        like_query, like_query, like_query, like_query, like_query,
        like_query, like_query, like_query, like_query, like_query
    ))
    rows = c.fetchall()
    keys = [desc[0] for desc in c.description]
    c.close()
    conn.close()
    return json.dumps([dict(zip(keys, row)) for row in rows])

def load_professor_long(prof_id):
    conn = get_conn()
    c = conn.cursor()
    # Get professor data
    c.execute('SELECT * FROM staff WHERE id = %s', (prof_id,))
    prof_row = c.fetchone()
    prof_keys = [desc[0] for desc in c.description]
    if not prof_row:
        c.close()
        conn.close()
        return json.dumps({})
    professor = dict(zip(prof_keys, prof_row))
    # Get reviews
    c.execute('SELECT * FROM reviews WHERE staff_id = %s', (prof_id,))
    review_rows = c.fetchall()
    review_keys = [desc[0] for desc in c.description]
    reviews = [dict(zip(review_keys, row)) for row in review_rows]
    c.close()
    conn.close()
    professor['reviews'] = reviews
    return json.dumps(professor)

def create_review(staff_id, content, workload, fairness, difficulty, attendance, engagement, course_taken, grade):
    # Calculate average rating
    ratings = [workload, fairness, difficulty, attendance, engagement]
    avg_rating = sum(ratings) / len(ratings)
    conn = get_conn()
    c = conn.cursor()
    c.execute('''
        INSERT INTO reviews (
            staff_id, content, workload, fairness, difficulty, attendance, engagement, rating, course_taken, grade
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
        staff_id, content, workload, fairness, difficulty, attendance, engagement, avg_rating, course_taken, grade
    ))
    conn.commit()
    review_id = c.lastrowid
    c.close()
    conn.close()
    update_professor_rating(staff_id)
    return json.dumps({"success": True, "review_id": review_id})

def add_mock_data():
    conn = get_conn()
    c = conn.cursor()
    # Insert two sample professors (rating is nullable)
    professors = [
        (
            "public/placeholder-user.jpg", "Dr. Alice Smith", "Female", "USA", "Engineering",
            "Computer Science", "Artificial Intelligence", "PhD", "Professor", "Full", "alice.smith@university.edu", None
        ),
        (
            "public/placeholder-user.jpg", "Dr. Bob Johnson", "Male", "Canada", "Science",
            "Mathematics", "Statistics", "PhD", "Associate Professor", "Associate", "bob.johnson@university.edu", None
        )
    ]
    c.executemany('''
        INSERT INTO staff (
            photo_path, name, gender, nationality, college, department, specialization,
            qualification, position, academic_rank, email, rating
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', professors)
    conn.commit()
    # Get the inserted professor IDs
    c.execute('SELECT id FROM staff WHERE name = %s', ("Dr. Alice Smith",))
    alice_id = c.fetchone()[0]
    c.execute('SELECT id FROM staff WHERE name = %s', ("Dr. Bob Johnson",))
    bob_id = c.fetchone()[0]
    # Insert mock reviews
    reviews = [
        (alice_id, "Great lecturer, explains concepts clearly.", 5, "CS101", "A"),
        (alice_id, "Helpful during office hours.", 4, "CS201", "B+"),
        (bob_id, "Challenging exams but fair grading.", 4, "MATH200", "B"),
        (bob_id, "Makes statistics interesting!", 5, "STAT101", "A-")
    ]
    c.executemany('''
        INSERT INTO reviews (staff_id, content, rating, course_taken, grade)
        VALUES (%s, %s, %s, %s, %s)
    ''', reviews)
    conn.commit()
    c.close()
    conn.close()
    # Update ratings for mock professors
    update_professor_rating(alice_id)
    update_professor_rating(bob_id)

def import_staff_from_json(json_path="staffs1.json"):
    import json
    conn = get_conn()
    c = conn.cursor()
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    # If the file is a list of lists (pages), flatten it
    if isinstance(data, list) and isinstance(data[0], list):
        entries = [item for page in data for item in page]
    else:
        entries = data
    for entry in entries:
        # Only process if entry is a dict and has required fields
        if not isinstance(entry, dict):
            continue
        if not entry.get("FullName") or not entry.get("Department"):
            continue
        c.execute('''
            INSERT INTO staff (
                photo_path, name, gender, nationality, college, department, specialization,
                qualification, position, academic_rank, email, rating
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            entry.get("PhotoPath"),
            entry.get("FullName"),
            entry.get("Gender"),
            entry.get("Nationality"),
            entry.get("CollegeName"),
            entry.get("Department"),
            entry.get("Specialization"),
            entry.get("Qualification"),
            entry.get("Position"),
            entry.get("AcademicRank"),
            entry.get("Email"),
            None  # rating
        ))
    conn.commit()
    c.close()
    conn.close()
    print("Staff import complete.")

# if __name__ == "__main__":
#     init_db()
#     import_staff_from_json("staffs1.json")