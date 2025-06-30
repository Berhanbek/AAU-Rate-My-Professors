# AAU Rate My Professors

A web application for students to search, view, and review professors at AAU.  
Built with Flask (Python) for the backend and Next.js (React) for the frontend.

---

## Features

- Search for professors by name or department
- View professor profiles with ratings and reviews
- Submit reviews with detailed feedback
- Responsive, modern frontend

---

## Tech Stack

- **Backend:** Python, Flask, MySQL, Flask-CORS
- **Frontend:** Next.js (React), Tailwind CSS
- **Database:** MySQL (hosted on Myfreesqldatabase)
- **Deployment:** Render.com (for backend), Vercel/Netlify/Render (for frontend)

---

## Getting Started (Local Development)

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/AAURateMyProfessors.git
cd AAURateMyProfessors
```

### 2. Set Up the Backend

#### a. Create and Fill the `.env` File

Create a `.env` file in the backend root (same folder as `app.py`):

```


#### b. Install Python Dependencies

```sh
pip install -r requirements.txt
```
If `requirements.txt` is missing, run:
```sh
pip install flask flask-cors mysql-connector-python python-dotenv
```

#### c. Initialize the Database

Open a Python shell in the backend folder:
```sh
python
```
Then run:
```python
import ratemyprofessordb
ratemyprofessordb.init_db()
ratemyprofessordb.import_staff_from_json("staffs1.json")
exit()
```

#### d. Start the Backend Server

```sh
python app.py
```
The backend will run on [http://localhost:10000](http://localhost:10000) (or the port specified in your environment).

---

### 3. Set Up the Frontend

```sh
cd frontend
npm install
npm run dev
```
The frontend will run on [http://localhost:3000](http://localhost:3000).

---

### 4. Open the App

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

### Deploy Backend to Render

1. Push your code to GitHub.
2. Create a new Web Service on [Render](https://render.com/).
3. Connect your GitHub repo.
4. Set the build/start commands:
   - **Build Command:** (leave blank or `pip install -r requirements.txt`)
   - **Start Command:** `python app.py`
5. Add environment variables (same as your `.env`).
6. Deploy and get your public backend URL.

### Deploy Frontend

- Deploy the `frontend` folder to [Vercel](https://vercel.com/), [Netlify](https://netlify.com/), or [Render](https://render.com/).
- Update the frontend API URLs to use your Render backend URL.

---

## Project Structure

```
AAURateMyProfessors/
│
├── app.py                  # Flask app entry point
├── ratemyprofessordb.py    # Database logic
├── staffs1.json            # Staff data
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
├── frontend/               # Next.js frontend
│   ├── ...                 # Frontend source code
```

---

## Environment Variables

Set these in your `.env` (locally) or as Render environment variables:

- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_PORT`

---

## Troubleshooting

- **Can't connect to MySQL:**  
  Make sure your `.env` is correct and the database is accessible from Render.
- **.env not loading:**  
  Ensure `.env` is in the backend root and named exactly `.env`.
- **Frontend can't reach backend:**  
  Update API URLs in the frontend to point to your deployed backend.

---

## License

MIT License

---

## Credits

- AAU Rate My Professors Team
- [Flask](https://flask.palletsprojects.com/)
- [Next.js](https://nextjs.org/)
- [Render](https://render.com/)