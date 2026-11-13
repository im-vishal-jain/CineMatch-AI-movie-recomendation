import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "movie_recommendation_model.pkl"
)

def load_movie_model():

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found: {MODEL_PATH}"
        )

    model = joblib.load(MODEL_PATH)

    print("Movie recommendation model loaded!")

    return model