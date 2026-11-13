<p align="center">
  <img src="docs/banner.svg" alt="CineMatch AI banner" width="100%">
</p>

# 🎬 CineMatch AI

A full-stack movie recommendation system that suggests similar movies based on a title you choose, powered by a content-based ML model and live TMDB data.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?logo=scikitlearn&logoColor=white)
![TMDB](https://img.shields.io/badge/TMDB-API-01B4E4?logo=themoviedatabase&logoColor=white)

---

## Overview

CineMatch AI combines:

- A content-based recommendation engine built in Python with scikit-learn
- A FastAPI backend that exposes movie search and recommendation endpoints
- A React + Vite frontend for browsing and exploring movies
- Live metadata enrichment from The Movie Database (TMDB)

The app lets users search movies, explore popular and top-rated titles, view details, and get recommendations based on similarity to a selected movie.

---

## ✨ Features

- 🎯 Personalized movie recommendations from a selected title
- 🔍 Movie search across the dataset
- 🔥 Popular and top-rated movie lists
- 🎭 Genre-based discovery
- 🎬 Movie details including poster, overview, release date, and rating
- ❤️ Watchlist support for saved titles
- ⚡ FastAPI backend with automatic API docs
- 🌐 Real-time enrichment from TMDB

---

## 🧠 How it works

CineMatch AI uses a content-based filtering approach:

1. Load the cleaned movie dataset
2. Extract relevant features such as title, overview, genres, cast, and metadata
3. Convert those features into a vector representation
4. Compute similarity between movies using a distance-based similarity metric
5. Rank movies by similarity to the selected movie
6. Return the top matches through the API

The model is trained offline and then loaded at backend startup to serve recommendations quickly.

<p align="center">
  <img src="docs/architecture.svg" alt="CineMatch AI architecture diagram" width="90%">
</p>

---

## 📸 Screenshots

> Replace the placeholder images below with real app screenshots when available.

| Home | Recommendations | Movie Details |
|---|---|---|
| ![Home](docs/home.png) | ![Recommendations](docs/recommendations.png) | ![Details](docs/details.png) |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Python, FastAPI, Uvicorn |
| Machine Learning | Pandas, NumPy, scikit-learn, Joblib |
| Recommendation Method | Content-based filtering |
| External Data | TMDB API |
| Model Storage | Pickle / Joblib model file |
| Training | Jupyter Notebook |

---

## 📊 Dataset and Model

| Item | Details |
|---|---|
| Dataset | TMDB movie metadata (movie features + metadata) |
| Movie count | 4,803 |
| Columns | 24 |
| Model file | `models/movie_recommendation_model.pkl` |
| Storage | Git LFS |

> ⚠️ Security note: pickle/joblib model files can execute code when loaded. Only load models that you trained yourself or trust completely.

---

## ⚙️ Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git LFS
- A valid TMDB API bearer token

### 1. Clone the repository

Install Git LFS before cloning so the model file is downloaded correctly.

```bash
git lfs install
git clone https://github.com/im-vishal-jain/CineMatch-AI-movie-recomendation.git
cd CineMatch-AI-movie-recomendation
```

### 2. Set up the backend

Create and activate a virtual environment:

```bash
python -m venv venv
```

```bash
# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r backend/requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the project root and add your TMDB token:

```bash
# macOS / Linux
cat > .env <<EOF
TMDB_BEARER_TOKEN=your_tmdb_bearer_token_here
EOF
```

```powershell
# Windows (PowerShell)
@"
TMDB_BEARER_TOKEN=your_tmdb_bearer_token_here
"@ | Set-Content .env
```

> Do not commit your real `.env` file. It is already included in `.gitignore`.

### 4. Run the backend

From the project root:

```bash
python -m uvicorn backend.main:app --reload --port 8000
```

Open the API docs here:

- API: http://127.0.0.1:8000
- Swagger UI: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

### 5. Run the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:8000`.

---

## 🔌 API Endpoints

The backend currently exposes these endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/movies/recommend?title={movie_title}&limit={n}` | Get top similar movies for a selected title |
| GET | `/api/movies/popular?limit={n}` | Fetch popular movies |
| GET | `/api/movies/top-rated?limit={n}` | Fetch top-rated movies |
| GET | `/api/movies/search?q={query}&limit={n}` | Search by movie title |

Full, interactive docs are available via FastAPI at `/docs` when the server is running.

---

## 🏗️ Project Structure

```text
CineMatch-AI-movie-recomendation/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── model_loader.py
│   │   │   └── tmdb_client.py
│   │   ├── routes/
│   │   │   └── movies.py
│   │   └── services/
│   │       └── recommendation.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── docs/
│   ├── architecture.svg
│   ├── banner.svg
│   ├── home.png
│   ├── recommendations.png
│   └── details.png
├── models/
│   └── movie_recommendation_model.pkl
├── app.py
├── README.md
├── requirements.txt
├── LICENSE
├── .gitignore
├── .gitattributes
├── Movie_Recommendation_System_using_Machine_Learning_with_Python 2.ipynb
└── .env
```

---

## 🩺 Troubleshooting

| Issue | Fix |
|---|---|
| Model file is missing or the backend crashes at startup | Run `git lfs install` and `git lfs pull` to fetch the model file correctly |
| TMDB requests fail with 401 | Confirm the `TMDB_BEARER_TOKEN` in `.env` is the actual bearer token and has no extra quotes or spaces |
| Frontend shows no data | Make sure the backend is running on port 8000 and the frontend is calling the correct API URL |
| `ModuleNotFoundError` | Activate the virtual environment and reinstall project dependencies |
| `No module named backend` | Run commands from the project root and keep the package structure intact |

---

## 🚀 Roadmap

- [ ] Improve recommendation quality with evaluation metrics
- [ ] Explore embedding-based recommendations
- [ ] Add hybrid recommendations using collaborative filtering
- [ ] Add user authentication and profiles
- [ ] Add advanced filtering and ranking options
- [ ] Add natural-language movie search
- [ ] Add Docker deployment support
- [ ] Add automated tests and CI/CD checks

---

## 🤝 Contributing

Contributions are welcome. If you want to improve the project, feel free to:

- Open an issue
- Submit a pull request
- Share feedback on model quality or UX improvements

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie metadata and images
- The open-source Python and JavaScript ecosystems that power this project

---

## 👨‍💻 Author

**Vishal Kumar**

- GitHub: [@im-vishal-jain](https://github.com/im-vishal-jain)
- Repository: [CineMatch AI](https://github.com/im-vishal-jain/CineMatch-AI-movie-recomendation)

---

⭐ If you like this project, consider giving it a star on GitHub.
