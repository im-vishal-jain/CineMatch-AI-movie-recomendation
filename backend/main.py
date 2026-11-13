
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Correct imports
from backend.app.core.model_loader import load_movie_model
from backend.app.services.recommendation import MovieRecommendationService
from backend.app.routes.movies import router


@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Loading Movie Recommendation Model...")

    model = load_movie_model()

    app.state.movie_service = MovieRecommendationService(model)

    print("CineMatch AI model loaded successfully!")
    print("CineMatch AI backend started!")

    yield

    print("CineMatch AI backend stopped!")


app = FastAPI(
    title="CineMatch AI API",
    description="Machine Learning Movie Recommendation System",
    version="1.0.0",
    lifespan=lifespan
)


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Register API Routes
app.include_router(router)


@app.get("/")
def home():

    return {
        "message": "Welcome to CineMatch AI API",
        "status": "Running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy",
        "application": "CineMatch AI"
    }
