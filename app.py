
import streamlit as st
import joblib
import pandas as pd
import difflib
import ast
import html
import random
from pathlib import Path

# =========================================================
# 1. PAGE CONFIG
# =========================================================

st.set_page_config(
    page_title="CineMatch AI",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# =========================================================
# 2. PREMIUM OTT CSS
# =========================================================

st.markdown("""
<style>

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

:root {
    --bg: #101116;
    --panel: #20232c;
    --panel2: #181a21;
    --text: #f5f5f7;
    --muted: #a1a1aa;
    --accent: #08c6bb;
    --border: #30333d;
}

html, body, [class*="css"] {
    font-family: 'Inter', sans-serif;
}

.stApp {
    background: var(--bg);
    color: var(--text);
}

header[data-testid="stHeader"] {
    background: transparent;
}

#MainMenu, footer {
    visibility: hidden;
}

.block-container {
    padding-top: 1.2rem;
    padding-bottom: 2rem;
    max-width: 100%;
}

[data-testid="stSidebar"] {
    background: #20232c;
    border-right: 1px solid #343640;
}

[data-testid="stSidebar"] .block-container {
    padding-top: 2rem;
}

.brand {
    font-size: 29px;
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -1.5px;
    color: white;
    margin-bottom: 35px;
}

.brand span {
    display: block;
    color: var(--accent);
    font-size: 14px;
    letter-spacing: 3px;
}

.side-label {
    color: #9296a1;
    font-size: 13px;
    font-weight: 700;
    margin: 23px 0 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.side-info {
    color: #d4d4dc;
    font-size: 13px;
    padding: 8px 4px;
}

div[data-testid="stRadio"] label {
    color: #e6e6ec !important;
    font-size: 14px;
}

div[data-testid="stRadio"] > div {
    gap: 8px;
}

.top-nav {
    display: flex;
    align-items: center;
    gap: 26px;
    padding: 4px 0 25px;
    color: #eeeeef;
    font-size: 15px;
    font-weight: 600;
}

.top-nav .active {
    color: var(--accent);
    border-bottom: 3px solid var(--accent);
    padding-bottom: 10px;
}

.section-title {
    font-size: 23px;
    font-weight: 800;
    color: #f5f5f7;
    margin: 25px 0 15px;
}

.section-subtitle {
    color: var(--muted);
    font-size: 13px;
    margin-top: -10px;
    margin-bottom: 18px;
}

.hero {
    position: relative;
    overflow: hidden;
    min-height: 335px;
    border-radius: 22px;
    padding: 38px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background:
        radial-gradient(ellipse at 75% 25%, #087d78 0%, transparent 38%),
        linear-gradient(120deg, #071d1c 0%, #173a37 45%, #161a26 100%);
    border: 1px solid #28534f;
    animation: fadeIn 0.8s ease;
    box-shadow: 0 20px 55px rgba(0,0,0,.25);
}

.hero::after {
    content: "🎬";
    position: absolute;
    right: 55px;
    top: 20px;
    font-size: 150px;
    opacity: .10;
    transform: rotate(-12deg);
}

.hero h1 {
    font-size: clamp(30px, 4vw, 48px);
    font-weight: 900;
    color: white;
    position: relative;
    z-index: 1;
    margin: 0;
}

.hero p {
    max-width: 520px;
    color: #d1e5e2;
    font-size: 14px;
    line-height: 1.7;
    position: relative;
    z-index: 1;
}

.hero-meta {
    color: #a8d8d3;
    font-size: 13px;
    margin-top: 10px;
}

.movie-card {
    background: #20232c;
    border: 1px solid #343640;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 12px;
    transition: all .3s ease;
    animation: fadeIn .65s ease both;
}

.movie-card:hover {
    transform: translateY(-7px);
    border-color: var(--accent);
    box-shadow: 0 15px 30px rgba(0,198,187,.12);
}

.poster {
    height: 165px;
    display: flex;
    align-items: flex-end;
    padding: 14px;
    background:
        radial-gradient(circle at 75% 20%, rgba(255,255,255,.15), transparent 35%),
        linear-gradient(145deg, #163b47, #29204a 55%, #111722);
}

.poster.p1 {
    background: linear-gradient(145deg,#4b2854,#171b39,#0e1827);
}

.poster.p2 {
    background: linear-gradient(145deg,#8b492c,#34203c,#111722);
}

.poster.p3 {
    background: linear-gradient(145deg,#135e59,#20284c,#111722);
}

.poster.p4 {
    background: linear-gradient(145deg,#5c426f,#202c3d,#111722);
}

.poster.p5 {
    background: linear-gradient(145deg,#68532a,#2c2447,#111722);
}

.poster.p6 {
    background: linear-gradient(145deg,#31577a,#171b39,#111722);
}

.poster-title {
    color: white;
    font-size: 19px;
    font-weight: 900;
    text-shadow: 0 2px 8px black;
}

.movie-content {
    padding: 13px;
}

.movie-content h4 {
    color: white;
    font-size: 15px;
    font-weight: 750;
    margin: 0 0 7px;
}

.movie-meta {
    color: #a1a1aa;
    font-size: 11px;
    line-height: 1.7;
}

.rating {
    color: #08c6bb;
    font-weight: 800;
    font-size: 13px;
}

.right-card {
    background: #20232c;
    border: 1px solid #343640;
    border-radius: 13px;
    padding: 13px;
    margin-bottom: 12px;
    transition: .3s ease;
}

.right-card:hover {
    border-color: var(--accent);
}

.right-title {
    font-weight: 800;
    font-size: 17px;
    color: white;
    margin-bottom: 14px;
}

.right-item {
    padding: 10px 0;
    border-bottom: 1px solid #343640;
    color: #eeeeef;
    font-size: 12px;
}

.right-item:last-child {
    border-bottom: none;
}

.genre-pill {
    display: inline-block;
    padding: 9px 13px;
    background: #303541;
    border-radius: 8px;
    color: #e5e7eb;
    font-size: 11px;
    margin: 3px;
}

.search-heading {
    font-size: 22px;
    font-weight: 800;
    margin: 25px 0 8px;
}

.footer {
    text-align: center;
    color: #858995;
    font-size: 12px;
    padding: 25px 0;
}

div[data-testid="stTextInput"] input {
    background: #20232c;
    color: white;
    border: 1px solid #454955;
    border-radius: 10px;
    min-height: 44px;
}

.stButton button {
    border-radius: 9px;
    border: 1px solid #3e424e;
    background: #292d38;
    color: white;
    font-weight: 650;
    transition: all .25s ease;
}

.stButton button:hover {
    background: #08bcb3;
    color: #081817;
    border-color: #08c6bb;
    transform: translateY(-2px);
}

div[data-testid="stMetric"] {
    background: #20232c;
    border: 1px solid #343640;
    padding: 13px;
    border-radius: 12px;
}

div[data-testid="stMetricLabel"] {
    color: #a1a1aa;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media(max-width: 768px) {
    .hero {
        min-height: 270px;
        padding: 22px;
    }
    .hero::after {
        font-size: 90px;
        right: 15px;
    }
    .hero h1 {
        font-size: 30px;
    }
    .section-title {
        font-size: 19px;
    }
}

</style>
""", unsafe_allow_html=True)


# =========================================================
# 3. LOAD TRAINED MODEL
# =========================================================

@st.cache_resource
def load_model():

    path = (
        Path(__file__).parent
        / "models"
        / "movie_recommendation_model.pkl"
    )

    if not path.exists():
        raise FileNotFoundError(
            "Model file missing inside models folder."
        )

    data = joblib.load(path)

    return data["movies_data"], data["similarity"]


try:
    movies_data, similarity = load_model()

except Exception as e:
    st.error(f"Model loading error: {e}")
    st.stop()


# =========================================================
# 4. DATA HELPERS
# =========================================================

def safe_text(value, default="Not available"):

    if value is None:
        return default

    if isinstance(value, float) and pd.isna(value):
        return default

    if isinstance(value, (list, dict)):
        return str(value)

    value = str(value).strip()

    return value if value and value.lower() != "nan" else default


def get_genres(value):

    if isinstance(value, list):
        data = value

    else:
        try:
            data = ast.literal_eval(str(value))
        except (ValueError, SyntaxError):
            return "General"

    if isinstance(data, list):
        names = [
            item.get("name", "")
            for item in data
            if isinstance(item, dict)
        ]
        return ", ".join(names) if names else "General"

    return "General"


def get_year(value):

    text = safe_text(value, "")

    return text[:4] if len(text) >= 4 else "N/A"


def get_popular_movies():

    data = movies_data.copy()

    data["popularity"] = pd.to_numeric(
        data["popularity"], errors="coerce"
    ).fillna(0)

    return data.sort_values(
        "popularity", ascending=False
    )


def get_top_rated_movies():

    data = movies_data.copy()

    data["vote_average"] = pd.to_numeric(
        data["vote_average"], errors="coerce"
    ).fillna(0)

    data["vote_count"] = pd.to_numeric(
        data["vote_count"], errors="coerce"
    ).fillna(0)

    data = data[data["vote_count"] >= 100]

    return data.sort_values(
        "vote_average", ascending=False
    )


# =========================================================
# 5. RECOMMENDATION ENGINE
# =========================================================

def recommend_movies(movie_name, top_n=10):

    titles = movies_data["title"].fillna("").astype(str).tolist()

    lookup = {
        title.strip().casefold(): i
        for i, title in enumerate(titles)
        if title.strip()
    }

    query = movie_name.strip().casefold()

    if not query:
        return None, []

    if query in lookup:

        movie_index = lookup[query]

    else:

        partial = [
            title for title in lookup
            if query in title
        ]

        if len(partial) == 1:

            movie_index = lookup[partial[0]]

        else:

            matches = difflib.get_close_matches(
                query,
                list(lookup.keys()),
                n=1,
                cutoff=0.45
            )

            if not matches:
                return None, []

            movie_index = lookup[matches[0]]

    scores = sorted(
        enumerate(similarity[movie_index]),
        key=lambda x: x[1],
        reverse=True
    )

    results = []

    for idx, score in scores:

        if idx == movie_index:
            continue

        movie = movies_data.iloc[idx]

        results.append({
            "title": safe_text(movie["title"]),
            "genres": get_genres(movie["genres"]),
            "rating": safe_text(movie["vote_average"]),
            "year": get_year(movie["release_date"]),
            "director": safe_text(movie["director"]),
            "overview": safe_text(movie["overview"]),
            "similarity": float(score)
        })

        if len(results) >= top_n:
            break

    return titles[movie_index], results


# =========================================================
# 6. SESSION STATE
# =========================================================

if "watchlist" not in st.session_state:
    st.session_state.watchlist = []

if "search_results" not in st.session_state:
    st.session_state.search_results = []

if "active_movie" not in st.session_state:
    st.session_state.active_movie = None

if "search_query" not in st.session_state:
    st.session_state.search_query = ""


# =========================================================
# 7. MOVIE CARD COMPONENT
# =========================================================

def render_movie_card(movie, card_id):

    title = safe_text(movie.get("title"))
    genres = safe_text(movie.get("genres", "General"))
    rating = safe_text(movie.get("vote_average", "N/A"))
    year = get_year(movie.get("release_date", "N/A"))

    st.markdown(
        f"""
        <div class="movie-card">

            <div class="poster p{card_id % 6 + 1}">
                <div class="poster-title">
                    {html.escape(title)}
                </div>
            </div>

            <div class="movie-content">

                <h4>{html.escape(title)}</h4>

                <div class="rating">
                    ★ {html.escape(rating)}
                </div>

                <div class="movie-meta">
                    {html.escape(year)} ·
                    {html.escape(genres)}
                </div>

            </div>

        </div>
        """,
        unsafe_allow_html=True
    )

    is_saved = title in st.session_state.watchlist

    if st.button(
        "✓ Added" if is_saved else "+ Watchlist",
        key=f"watch_{card_id}_{title}"
    ):

        if is_saved:
            st.session_state.watchlist.remove(title)
        else:
            st.session_state.watchlist.append(title)

        st.rerun()


# =========================================================
# 8. SIDEBAR NAVIGATION
# =========================================================

with st.sidebar:

    st.markdown(
        '<div class="brand">CINEMATCH<span>AI MOVIES</span></div>',
        unsafe_allow_html=True
    )

    st.markdown(
        '<div class="side-label">Menu</div>',
        unsafe_allow_html=True
    )

    page = st.radio(
        "Navigation",
        [
            "🏠 Home",
            "🔎 Discover",
            "⭐ Top Rated",
            "🎭 Genres",
            "❤️ Watchlist"
        ],
        label_visibility="collapsed"
    )

    st.markdown(
        '<div class="side-label">Library</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        f'<div class="side-info">❤️ My Watchlist '
        f'({len(st.session_state.watchlist)})</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        '<div class="side-label">General</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        '<div class="side-info">🧠 ML Recommendation Engine</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        '<div class="side-info">⚙️ Powered by Streamlit</div>',
        unsafe_allow_html=True
    )


# =========================================================
# 9. TOP NAVIGATION + SEARCH
# =========================================================

main, right = st.columns([3.05, 1.0], gap="large")

with main:

    nav1, nav2 = st.columns([1.1, 1.5])

    with nav1:
        st.markdown(
            '<div class="top-nav">'
            '<span class="active">MOVIES</span>'
            '<span>DISCOVER</span>'
            '</div>',
            unsafe_allow_html=True
        )

    with nav2:
        search_input = st.text_input(
            "Search",
            placeholder="Search your favourite movie...",
            label_visibility="collapsed",
            key="global_movie_search"
        )

    if search_input.strip():

        st.session_state.search_query = search_input

        if st.button(
            "🔍 Search Movie",
            key="global_search_button"
        ):

            selected, results = recommend_movies(
                search_input, 10
            )

            st.session_state.active_movie = selected
            st.session_state.search_results = results

            st.rerun()


# =========================================================
# 10. HOME PAGE
# =========================================================

if page == "🏠 Home":

    popular = get_popular_movies()

    featured = popular.iloc[0]

    featured_title = html.escape(
        safe_text(featured["title"])
    )

    featured_overview = html.escape(
        safe_text(featured["overview"])
    )

    st.markdown(
        f"""
        <div class="hero">

            <div class="hero-meta">
                ✦ FEATURED MOVIE · CINE MATCH
            </div>

            <h1>{featured_title}</h1>

            <p>{featured_overview[:260]}</p>

            <div class="hero-meta">
                ⭐ {safe_text(featured["vote_average"])}
                &nbsp; · &nbsp;
                {get_year(featured["release_date"])}
                &nbsp; · &nbsp;
                {html.escape(get_genres(featured["genres"]))}
            </div>

        </div>
        """,
        unsafe_allow_html=True
    )

    st.markdown(
        '<div class="section-title">🔥 Popular on CineMatch</div>',
        unsafe_allow_html=True
    )

    popular_display = popular.head(6)

    cols = st.columns(3)

    for i, (_, movie) in enumerate(popular_display.iterrows()):

        with cols[i % 3]:

            render_movie_card(
                movie,
                i + 100
            )

    st.markdown(
        '<div class="section-title">⭐ Top Rated Movies</div>',
        unsafe_allow_html=True
    )

    top_movies = get_top_rated_movies().head(3)

    cols = st.columns(3)

    for i, (_, movie) in enumerate(top_movies.iterrows()):

        with cols[i]:

            render_movie_card(
                movie,
                i + 200
            )


# =========================================================
# 11. DISCOVER PAGE
# =========================================================

elif page == "🔎 Discover":

    st.markdown(
        '<div class="section-title">🔎 Discover Movies</div>',
        unsafe_allow_html=True
    )

    st.write(
        "Type any movie title. Our ML model finds similar movies."
    )

    with st.form("discover_form"):

        query = st.text_input(
            "Movie title",
            placeholder="Example: Iron Man, Avatar, Titanic..."
        )

        count = st.slider(
            "Recommendations",
            5, 20, 10
        )

        submitted = st.form_submit_button(
            "✨ Find Similar Movies",
            use_container_width=True
        )

    if submitted:

        if query.strip():

            with st.spinner("Analyzing movie similarity..."):

                selected, results = recommend_movies(
                    query, count
                )

            st.session_state.active_movie = selected
            st.session_state.search_results = results

        else:
            st.warning("Enter a movie name.")

    if st.session_state.search_results:

        st.success(
            f"Recommendations for: "
            f"{st.session_state.active_movie}"
        )

        for i in range(
            0,
            len(st.session_state.search_results),
            2
        ):

            cols = st.columns(2)

            for col, movie in zip(
                cols,
                st.session_state.search_results[i:i+2]
            ):

                with col:

                    st.markdown(
                        f"""
                        <div class="movie-card">

                            <h3>
                            🎬 {html.escape(movie['title'])}
                            </h3>

                            <p>⭐ Rating: {html.escape(str(movie['rating']))}</p>

                            <p>📅 Year: {html.escape(movie['year'])}</p>

                            <p>🎭 {html.escape(movie['genres'])}</p>

                            <p>🎥 Director: {html.escape(movie['director'])}</p>

                            <p style="color:#08c6bb;">
                            Similarity: {movie['similarity']*100:.2f}%
                            </p>

                            <p>
                            {html.escape(movie['overview'])[:350]}
                            </p>

                        </div>
                        """,
                        unsafe_allow_html=True
                    )

                    title = movie["title"]

                    saved = title in st.session_state.watchlist

                    if st.button(
                        "✓ Saved" if saved else "+ Watchlist",
                        key=f"discover_{i}_{title}"
                    ):

                        if saved:
                            st.session_state.watchlist.remove(title)
                        else:
                            st.session_state.watchlist.append(title)

                        st.rerun()


# =========================================================
# 12. TOP RATED PAGE
# =========================================================

elif page == "⭐ Top Rated":

    st.markdown(
        '<div class="section-title">⭐ Highest Rated Movies</div>',
        unsafe_allow_html=True
    )

    data = get_top_rated_movies().head(60)

    cols = st.columns(3)

    for i, (_, movie) in enumerate(data.iterrows()):

        with cols[i % 3]:

            render_movie_card(
                movie,
                i + 300
            )


# =========================================================
# 13. GENRES PAGE
# =========================================================

elif page == "🎭 Genres":

    st.markdown(
        '<div class="section-title">🎭 Explore Genres</div>',
        unsafe_allow_html=True
    )

    genre_map = {}

    for _, movie in movies_data.iterrows():

        genre_list = get_genres(
            movie["genres"]
        ).split(", ")

        for genre in genre_list:

            if genre and genre != "General":

                genre_map.setdefault(
                    genre, []
                ).append(movie)

    genre_names = sorted(genre_map.keys())

    selected_genre = st.selectbox(
        "Select your favourite genre",
        genre_names
    )

    if selected_genre:

        st.subheader(selected_genre + " Movies")

        selected_movies = genre_map[selected_genre][:30]

        cols = st.columns(3)

        for i, movie in enumerate(selected_movies):

            with cols[i % 3]:

                render_movie_card(
                    movie,
                    i + 500
                )


# =========================================================
# 14. WATCHLIST PAGE
# =========================================================

elif page == "❤️ Watchlist":

    st.markdown(
        '<div class="section-title">❤️ My Watchlist</div>',
        unsafe_allow_html=True
    )

    if not st.session_state.watchlist:

        st.info(
            "Your watchlist is empty. Add movies from the Home page."
        )

    else:

        for title in st.session_state.watchlist:

            match = movies_data[
                movies_data["title"] == title
            ]

            if not match.empty:

                movie = match.iloc[0]

                st.markdown(
                    f"""
                    <div class="right-card">
                        <b>🎬 {html.escape(title)}</b>
                        <br>
                        <span style="color:#08c6bb;">
                        ⭐ {safe_text(movie["vote_average"])}
                        </span>
                    </div>
                    """,
                    unsafe_allow_html=True
                )

                if st.button(
                    "Remove",
                    key=f"remove_{title}"
                ):

                    st.session_state.watchlist.remove(title)
                    st.rerun()


# =========================================================
# 15. RIGHT SIDEBAR
# =========================================================

with right:

    st.markdown(
        '<div class="section-title">🔔 Your Space</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        f"""
        <div class="right-card">
            <div class="right-title">Your Watchlist</div>
            <div style="color:#08c6bb;font-size:25px;font-weight:900;">
                {len(st.session_state.watchlist)}
            </div>
            <div style="color:#a1a1aa;font-size:12px;">
                Saved movies
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )

    st.markdown(
        '<div class="section-title">⭐ Top Rated</div>',
        unsafe_allow_html=True
    )

    top_right = get_top_rated_movies().head(5)

    for _, movie in top_right.iterrows():

        st.markdown(
            f"""
            <div class="right-card">

                <div style="font-weight:700;">
                    {html.escape(safe_text(movie["title"]))}
                </div>

                <div style="color:#08c6bb;font-size:12px;">
                    ★ {safe_text(movie["vote_average"])}
                </div>

            </div>
            """,
            unsafe_allow_html=True
        )

    st.markdown(
        '<div class="section-title">🎭 Genres</div>',
        unsafe_allow_html=True
    )

    all_genres = set()

    for value in movies_data["genres"].dropna():

        all_genres.update(
            get_genres(value).split(", ")
        )

    for genre in sorted(all_genres)[:12]:

        st.markdown(
            f'<span class="genre-pill">'
            f'{html.escape(genre)}</span>',
            unsafe_allow_html=True
        )


# =========================================================
# 16. FOOTER
# =========================================================

st.markdown(
    """
    <div class="footer">
        <h3 style="color:#08c6bb;">🎬 CineMatch AI</h3>
        Machine Learning Based Movie Recommendation Platform
        <br><br>
        Python · Pandas · Scikit-learn · Streamlit
        <br><br>
        © 2026 CineMatch AI
    </div>
    """,
    unsafe_allow_html=True
)
