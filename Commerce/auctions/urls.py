from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("listing/<int:listing_id>/", views.listing, name="listing"),
    path("create/", views.create_listing, name="create_listing"),
    path("bid/<int:listing_id>/", views.place_bid, name="place_bid"),
    path("watchlist/<int:listing_id>/", views.toggle_watchlist, name="toggle_watchlist"),
    path("close/<int:listing_id>/", views.close_auction, name="close_auction"),
    path("watchlist/", views.watchlist, name="watchlist"),
    path("categories/", views.category_list, name="category_list"),
    path("category/<int:category_id>/", views.category_view, name="category_view"),
]
