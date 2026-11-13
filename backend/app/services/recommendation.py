
import difflib
import pandas as pd

from backend.app.core.tmdb_client import get_tmdb_movie


class MovieRecommendationService:

    def __init__(self, model):

        self.movies = model["movies_data"]
        self.similarity = model["similarity"]

        self.titles = (
            self.movies["title"]
            .fillna("")
            .astype(str)
            .tolist()
        )

        self.title_lookup = {
            title.strip().casefold(): index
            for index, title in enumerate(self.titles)
            if title.strip()
        }

        # Cache TMDB results to avoid repeated API requests
        self.tmdb_cache = {}

    # ==========================================
    # FIND MOVIE
    # ==========================================

    def find_movie(self, query):

        if not query or not query.strip():
            return None

        query = query.strip().casefold()

        if query in self.title_lookup:
            return self.title_lookup[query]

        partial_matches = [
            title for title in self.title_lookup
            if query in title
        ]

        if len(partial_matches) == 1:
            return self.title_lookup[partial_matches[0]]

        matches = difflib.get_close_matches(
            query,
            list(self.title_lookup.keys()),
            n=1,
            cutoff=0.45
        )

        if not matches:
            return None

        return self.title_lookup[matches[0]]

    # ==========================================
    # TMDB MOVIE ENRICHMENT
    # ==========================================

    def get_movie_details(self, title):

        if title in self.tmdb_cache:
            return self.tmdb_cache[title]

        try:

            details = get_tmdb_movie(title)

            if details:
                self.tmdb_cache[title] = details
                return details

        except Exception as error:

            print(f"TMDB enrichment failed for {title}: {error}")

        self.tmdb_cache[title] = None

        return None

    # ==========================================
    # ENRICH MOVIE DATA
    # ==========================================

    def enrich_movie(self, movie_data):

        title = str(movie_data.get("title", ""))

        tmdb_data = self.get_movie_details(title)

        # Default values if TMDB data is unavailable
        movie_data.update({
            "tmdb_id": None,
            "poster_path": None,
            "poster_url": None,
            "backdrop_path": None,
            "backdrop_url": None,
            "tmdb_rating": None,
            "vote_count": None,
            "original_language": None
        })

        if tmdb_data:

            movie_data.update({
                "tmdb_id": tmdb_data.get("tmdb_id"),
                "poster_path": tmdb_data.get("poster_path"),
                "poster_url": tmdb_data.get("poster_url"),
                "backdrop_path": tmdb_data.get("backdrop_path"),
                "backdrop_url": tmdb_data.get("backdrop_url"),
                "tmdb_rating": tmdb_data.get("rating"),
                "vote_count": tmdb_data.get("vote_count"),
                "original_language": tmdb_data.get(
                    "original_language"
                )
            })

            # Use TMDB overview only if ML dataset overview is missing
            if not movie_data.get("overview"):
                movie_data["overview"] = (
                    tmdb_data.get("overview") or ""
                )

        return movie_data

    # ==========================================
    # RECOMMEND MOVIES
    # ==========================================

    def recommend(self, movie_name, limit=10):

        movie_index = self.find_movie(movie_name)

        if movie_index is None:
            return None, []

        scores = sorted(
            enumerate(self.similarity[movie_index]),
            key=lambda item: item[1],
            reverse=True
        )

        recommendations = []

        for index, score in scores:

            if index == movie_index:
                continue

            movie = self.movies.iloc[index]

            rating = pd.to_numeric(
                movie.get("vote_average", 0),
                errors="coerce"
            )

            rating = (
                float(rating)
                if pd.notna(rating)
                else 0.0
            )

            movie_data = {
                "id": int(movie["id"]),
                "title": str(movie["title"]),
                "overview": (
                    str(movie["overview"])
                    if pd.notna(movie["overview"])
                    else ""
                ),
                "genres": str(movie["genres"]),
                "rating": rating,
                "release_date": str(movie["release_date"]),
                "director": str(movie["director"]),
                "similarity": round(float(score), 4)
            }

            # Add TMDB poster and backdrop information
            movie_data = self.enrich_movie(movie_data)

            recommendations.append(movie_data)

            if len(recommendations) >= limit:
                break

        return self.titles[movie_index], recommendations

    # ==========================================
    # POPULAR MOVIES
    # ==========================================

    def popular_movies(self, limit=10):

        data = self.movies.copy()

        data["popularity"] = pd.to_numeric(
            data["popularity"],
            errors="coerce"
        ).fillna(0)

        data = data.sort_values(
            "popularity",
            ascending=False
        ).head(limit)

        movies = data.to_dict(orient="records")

        return [
            self.enrich_movie(movie)
            for movie in movies
        ]

    # ==========================================
    # TOP RATED MOVIES
    # ==========================================

    def top_rated_movies(self, limit=10):

        data = self.movies.copy()

        data["vote_average"] = pd.to_numeric(
            data["vote_average"],
            errors="coerce"
        ).fillna(0)

        data["vote_count"] = pd.to_numeric(
            data["vote_count"],
            errors="coerce"
        ).fillna(0)

        data = data[data["vote_count"] >= 100]

        data = data.sort_values(
            "vote_average",
            ascending=False
        ).head(limit)

        movies = data.to_dict(orient="records")

        return [
            self.enrich_movie(movie)
            for movie in movies
        ]
