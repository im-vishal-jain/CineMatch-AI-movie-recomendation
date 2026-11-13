<p align="center">
  <img src="docs/banner.svg" alt="CineMatch AI banner" width="100%">
</p>

# 🎬 CineMatch AI

**A full-stack movie recommendation app: pick a movie you like, get similar ones instantly.**

CineMatch AI pairs a content-based machine learning recommender with live data from the TMDB API. A React frontend talks to a FastAPI backend that serves recommendations from a trained model, while TMDB supplies posters, ratings, and details.

<!-- TODO: add a live demo link once deployed -->
<!-- [🚀 Live Demo](https://your-demo-link) · [📹 Demo Video](https://your-video-link) -->

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?logo=scikitlearn&logoColor=white)

---

## 📸 Screenshots

<!-- TODO: replace with real screenshots (put images in a /docs or /assets folder) -->
| Home | Recommendations | Movie Details |
|---|---|---|
| ![Home](docs/home.png) | ![Recommendations](docs/recommendations.png) | ![Details](docs/details.png) |

---

## ✨ Features

- 🎯 **Personalized recommendations** based on a selected movie
- 🔍 **Search** for any movie
- 🔥 **Popular** and ⭐ **top-rated** movie lists
- 🎭 **Genre discovery**
- 🎬 **Movie details** (poster, rating, overview, and more)
- ❤️ **Watchlist** to save movies you want to see
- ⚡ **FastAPI backend** with auto-generated interactive API docs
- 🌐 **TMDB integration** for live movie data

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, JavaScript, CSS |
| Backend | Python, FastAPI, Uvicorn |
| Machine Learning | Pandas, NumPy, Scikit-learn |
| Recommendation approach | Content-based filtering |
| External data | TMDB API |
| Model storage | Pickle (`.pkl`) via Git LFS |
| Training | Jupyter Notebook |

---

## 🧠 How the Recommender Works

CineMatch AI uses **content-based filtering**: it recommends movies whose content is most similar to the one you pick.

1. **Load and clean** the movie dataset.
2. **Select features** from each movie's metadata.
3. **Vectorize** the combined features into numerical form.
   <!-- TODO: name your method, e.g. "TF-IDF on genres, keywords, cast, crew, and overview" or "CountVectorizer with 5,000 features" -->
4. **Compute similarity** between movies.
   <!-- TODO: name your metric, e.g. "cosine similarity" -->
5. **Rank** all other movies by similarity to the selected one and return the top results.
6. **Serve** the results through the FastAPI backend.

The trained model is precomputed offline in a Jupyter notebook and loaded once when the backend starts, so recommendations are returned quickly.

<p align="center">
  <img src="docs/architecture.svg" alt="CineMatch AI architecture diagram" width="90%">
</p>

**Trade-offs:** content-based filtering needs no user data and works for brand-new movies, but it can only recommend things similar to what you already picked, so it rarely surprises you. A hybrid approach (see the roadmap) addresses this.

## 📊 Dataset & Model

| | |
|---|---|
| Dataset | <!-- TODO: name and link, e.g. TMDB 5000 Movies & Credits --> |
| Movies | 4,803 |
| Columns | 24 |
| Model file | `models/movie_recommendation_model.pkl` |
| Storage | Git LFS |

> ⚠️ **Security note:** Pickle files can execute code when loaded. Only load model files you trained yourself or fully trust.

---

## ⚙️ Installation & Setup

### Prerequisites

- Python 3.10+ <!-- TODO: confirm minimum version -->
- Node.js 18+ <!-- TODO: confirm minimum version -->
- [Git LFS](https://git-lfs.com/) (**required**, the model file is stored with it)
- A [TMDB API](https://www.themoviedb.org/settings/api) bearer token

### 1. Clone the repository

Install Git LFS **before** cloning, otherwise the model file will download as a tiny pointer file and the backend will fail to start.

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

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Copy the example file and add your token:

```bash
# Windows (PowerShell)
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Then edit `.env`:

```env
TMDB_BEARER_TOKEN=your_tmdb_bearer_token_here
```

> 🔒 Never commit your real `.env` file or API credentials. It is already listed in `.gitignore`.

| Variable | Description |
|---|---|
| `TMDB_BEARER_TOKEN` | TMDB API authentication token |

### 4. Run the backend

From the project root:

```bash
python -m uvicorn backend.main:app --reload --port 8000
```

- API: http://127.0.0.1:8000
- Interactive docs: http://127.0.0.1:8000/docs

### 5. Run the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in the terminal. <!-- TODO: mention how the frontend finds the backend, e.g. "The frontend expects the API at http://127.0.0.1:8000" or the env variable to change -->

---

## 🔌 API Endpoints

<!-- TODO: verify these against backend/app/routes/movies.py and fix the paths -->
| Method | Endpoint | Description |
|---|---|---|
| GET | `/movies/search?query=` | Search movies |
| GET | `/movies/popular` | Popular movies |
| GET | `/movies/top-rated` | Top-rated movies |
| GET | `/movies/genres` | List genres |
| GET | `/movies/{id}` | Movie details |
| GET | `/movies/recommend?title=` | Recommendations for a movie |

Full, always-current documentation is available at `/docs` when the backend is running.

---

## 🏗️ Project Structure

```text
CineMatch-AI/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── model_loader.py     # Loads the trained model at startup
│   │   │   └── tmdb_client.py      # TMDB API client
│   │   ├── routes/
│   │   │   └── movies.py           # API endpoints
│   │   └── services/
│   │       └── recommendation.py   # Recommendation logic
│   └── main.py                     # FastAPI entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # App pages
│   │   ├── services/               # API calls to the backend
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
├── docs/
│   ├── banner.svg
│   └── architecture.svg
│
├── models/
│   └── movie_recommendation_model.pkl
│
├── app.py                          # <!-- TODO: explain the purpose of this file -->
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

---

## 🩺 Troubleshooting

| Problem | Fix |
|---|---|
| Model file is only a few hundred bytes, or the backend crashes while loading it | Git LFS wasn't installed when you cloned. Run `git lfs install` then `git lfs pull`. |
| TMDB requests fail with 401 | Check that `TMDB_BEARER_TOKEN` in `.env` is the **bearer token** (not the API key) and has no extra spaces or quotes. |
| Frontend shows no data | Make sure the backend is running on port 8000 and that the frontend points to it. |
| `ModuleNotFoundError` | Activate your virtual environment and re-run `pip install -r requirements.txt`. |

---

## 🚀 Roadmap

- [ ] Evaluate recommendation quality (e.g. precision@k)
- [ ] Try sentence embeddings for movie overviews
- [ ] Hybrid recommendations (content + user behavior)
- [ ] User authentication, profiles, and recommendation history
- [ ] Advanced ranking and filtering
- [ ] AI-powered natural-language movie search
- [ ] Docker setup and cloud deployment
- [ ] Automated tests

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

## 📄 License

<!-- TODO: add a LICENSE file (MIT is a common choice) and update this line -->
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgements

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie data and images. *This product uses the TMDB API but is not endorsed or certified by TMDB.*

## 👨‍💻 Author

**Vishal Kumar**: AI Engineer | Data Analyst | Data Scientist

- GitHub: [@im-vishal-jain](https://github.com/im-vishal-jain)
- Repository: [CineMatch AI](https://github.com/im-vishal-jain/CineMatch-AI-movie-recomendation)

---

⭐ If you find this project useful, consider giving it a star on GitHub!
