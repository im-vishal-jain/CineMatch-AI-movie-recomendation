from fastapi import APIRouter, HTTPException, Query, Request

router = APIRouter(
    prefix="/api/movies",
    tags=["Movies"]
)


@router.get("/recommend")
def recommend_movies(
    request: Request,
    title: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=20)
):

    service = request.app.state.movie_service

    selected, recommendations = service.recommend(
        title,
        limit
    )

    if selected is None:
        raise HTTPException(
            status_code=404,
            detail="Movie not found. Try another title."
        )

    return {
        "success": True,
        "searched_movie": selected,
        "total_recommendations": len(recommendations),
        "recommendations": recommendations
    }


@router.get("/popular")
def popular_movies(request: Request, limit: int = 10):

    service = request.app.state.movie_service

    return {
        "success": True,
        "movies": service.popular_movies(limit)
    }


@router.get("/top-rated")
def top_rated_movies(request: Request, limit: int = 10):

    service = request.app.state.movie_service

    return {
        "success": True,
        "movies": service.top_rated_movies(limit)
    }


@router.get("/search")
def search_movies(
    request: Request,
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=30)
):

    service = request.app.state.movie_service

    query = q.strip().casefold()

    matches = service.movies[
        service.movies["title"]
        .fillna("")
        .astype(str)
        .str.casefold()
        .str.contains(query, regex=False)
    ].head(limit)

    return {
        "success": True,
        "movies": matches[
            ["id", "title", "overview", "vote_average", "release_date"]
        ].fillna("").to_dict(orient="records")
    }