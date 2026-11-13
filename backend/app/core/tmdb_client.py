
import os
import requests

from pathlib import Path
from dotenv import load_dotenv
from requests.exceptions import (
    Timeout,
    ConnectionError,
    HTTPError,
    RequestException
)


# ==========================================
# ENVIRONMENT CONFIGURATION
# ==========================================

BASE_DIR = Path(__file__).resolve().parents[3]
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH, override=True)

TMDB_TOKEN = os.getenv("TMDB_BEARER_TOKEN", "").strip()

BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/"


# ==========================================
# TMDB SESSION
# ==========================================

session = requests.Session()

# Avoid problematic system proxy environment settings
session.trust_env = False

session.headers.update({
    "Authorization": f"Bearer {TMDB_TOKEN}",
    "accept": "application/json",
    "User-Agent": "CineMatchAI/1.0"
})


# ==========================================
# COMMON RESPONSE HANDLER
# ==========================================

def handle_tmdb_response(response):

    response.raise_for_status()

    return response.json()


# ==========================================
# FETCH MOVIE BY TMDB ID
# ==========================================

def get_tmdb_movie_by_id(movie_id: int):

    if not TMDB_TOKEN:
        raise ValueError(
            "TMDB_BEARER_TOKEN missing. Check root .env file."
        )

    if not movie_id:
        return None

    try:

        response = session.get(
            f"{BASE_URL}/movie/{int(movie_id)}",
            timeout=(10, 30)
        )

        movie = handle_tmdb_response(response)

        poster_path = movie.get("poster_path")
        backdrop_path = movie.get("backdrop_path")

        return {
            "tmdb_id": movie.get("id"),
            "title": movie.get("title"),
            "original_title": movie.get("original_title"),

            "poster_path": poster_path,
            "poster_url": (
                f"{IMAGE_BASE_URL}w500{poster_path}"
                if poster_path else None
            ),

            "backdrop_path": backdrop_path,
            "backdrop_url": (
                f"{IMAGE_BASE_URL}w1280{backdrop_path}"
                if backdrop_path else None
            ),

            "overview": movie.get("overview"),
            "release_date": movie.get("release_date"),

            "rating": movie.get("vote_average"),
            "vote_count": movie.get("vote_count"),
            "popularity": movie.get("popularity"),

            "original_language": movie.get("original_language"),

            "genres": [
                genre.get("name")
                for genre in movie.get("genres", [])
            ]
        }

    except Timeout:
        print(f"TMDB Timeout: Movie ID {movie_id}")
        return None

    except ConnectionError as error:
        print(f"TMDB Connection Error: {error}")
        return None

    except HTTPError as error:

        status = (
            error.response.status_code
            if error.response else "Unknown"
        )

        if status == 401:
            print(
                "TMDB Authentication Failed: "
                "Check API Read Access Token."
            )

        elif status == 403:
            print("TMDB Access Forbidden.")

        elif status == 404:
            print(f"TMDB Movie Not Found: ID {movie_id}")

        elif status == 429:
            print("TMDB API Rate Limit Exceeded.")

        else:
            print(f"TMDB HTTP Error: {status}")

        return None

    except RequestException as error:
        print(f"TMDB Request Error: {error}")
        return None

    except (ValueError, KeyError, TypeError) as error:
        print(f"TMDB Response Error: {error}")
        return None


# ==========================================
# FETCH MOVIE BY TITLE (FALLBACK)
# ==========================================

def get_tmdb_movie(title: str):

    if not title or not title.strip():
        return None

    if not TMDB_TOKEN:
        raise ValueError(
            "TMDB_BEARER_TOKEN missing. Check root .env file."
        )

    try:

        response = session.get(
            f"{BASE_URL}/search/movie",
            params={
                "query": title.strip(),
                "include_adult": False
            },
            timeout=(10, 30)
        )

        data = handle_tmdb_response(response)

        results = data.get("results", [])

        if not results:
            return None

        movie = results[0]

        poster_path = movie.get("poster_path")
        backdrop_path = movie.get("backdrop_path")

        return {
            "tmdb_id": movie.get("id"),
            "title": movie.get("title"),
            "original_title": movie.get("original_title"),

            "poster_path": poster_path,
            "poster_url": (
                f"{IMAGE_BASE_URL}w500{poster_path}"
                if poster_path else None
            ),

            "backdrop_path": backdrop_path,
            "backdrop_url": (
                f"{IMAGE_BASE_URL}w1280{backdrop_path}"
                if backdrop_path else None
            ),

            "overview": movie.get("overview"),
            "release_date": movie.get("release_date"),

            "rating": movie.get("vote_average"),
            "vote_count": movie.get("vote_count"),
            "popularity": movie.get("popularity"),

            "original_language": movie.get("original_language")
        }

    except Timeout:
        print(f"TMDB Timeout: {title}")
        return None

    except ConnectionError as error:
        print(f"TMDB Connection Error: {error}")
        return None

    except HTTPError as error:

        status = (
            error.response.status_code
            if error.response else "Unknown"
        )

        if status == 401:
            print("TMDB Authentication Failed.")

        elif status == 403:
            print("TMDB Access Forbidden.")

        elif status == 429:
            print("TMDB API Rate Limit Exceeded.")

        else:
            print(f"TMDB HTTP Error: {status}")

        return None

    except RequestException as error:
        print(f"TMDB Request Error: {error}")
        return None

    except (ValueError, KeyError, TypeError) as error:
        print(f"TMDB Response Error: {error}")
        return None


# ==========================================
# POSTER URL HELPER
# ==========================================

def get_poster_url(
    poster_path: str,
    size: str = "w500"
):

    if not poster_path:
        return None

    if poster_path.startswith("http"):
        return poster_path

    return f"{IMAGE_BASE_URL}{size}{poster_path}"


# ==========================================
# BACKDROP URL HELPER
# ==========================================

def get_backdrop_url(
    backdrop_path: str,
    size: str = "w1280"
):

    if not backdrop_path:
        return None

    if backdrop_path.startswith("http"):
        return backdrop_path

    return f"{IMAGE_BASE_URL}{size}{backdrop_path}"
