from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import AuctionListing, Bid, Comment, Watchlist, Category
from .forms import AuctionListingForm, BidForm, CommentForm

def index(request):
    listings = AuctionListing.objects.filter(is_active=True)
    return render(request, "auctions/index.html", {"listings": listings})

@login_required
def create_listing(request):
    if request.method == "POST":
        form = AuctionListingForm(request.POST)
        if form.is_valid():
            listing = form.save(commit=False)
            listing.owner = request.user
            listing.save()
            messages.success(request, "Your listing has been created!")
            return redirect("index")
    else:
        form = AuctionListingForm()
    return render(request, "auctions/create_listing.html", {"form": form})

def listing(request, listing_id):
    listing = get_object_or_404(AuctionListing, pk=listing_id)
    bid_form = BidForm()
    comment_form = CommentForm()
    watchlisted = Watchlist.objects.filter(user=request.user, listing=listing).exists() if request.user.is_authenticated else False

    return render(request, "auctions/listing.html", {
        "listing": listing,
        "bid_form": bid_form,
        "comment_form": comment_form,
        "watchlisted": watchlisted,
    })

@login_required
def place_bid(request, listing_id):
    listing = get_object_or_404(AuctionListing, pk=listing_id)
    if request.method == "POST":
        form = BidForm(request.POST)
        if form.is_valid():
            bid = form.cleaned_data["bid_amount"]
            highest_bid = listing.bids.order_by('-bid_amount').first()
            
            if highest_bid is None or bid > highest_bid.bid_amount:
                new_bid = form.save(commit=False)
                new_bid.listing = listing
                new_bid.bidder = request.user
                new_bid.save()
                messages.success(request, "Your bid was placed successfully!")
            else:
                messages.error(request, "Your bid must be higher than the current highest bid.")
    
    return redirect("listing", listing_id=listing_id)

@login_required
def toggle_watchlist(request, listing_id):
    listing = get_object_or_404(AuctionListing, pk=listing_id)
    watchlist_entry, created = Watchlist.objects.get_or_create(user=request.user, listing=listing)

    if not created:
        watchlist_entry.delete()
        messages.info(request, "Removed from watchlist.")
    else:
        messages.success(request, "Added to watchlist.")
    
    return redirect("listing", listing_id=listing_id)

@login_required
def close_auction(request, listing_id):
    listing = get_object_or_404(AuctionListing, pk=listing_id)
    if request.user == listing.owner:
        listing.is_active = False
        listing.save()
        messages.success(request, "Auction closed successfully.")
    return redirect("listing", listing_id=listing_id)

@login_required
def watchlist(request):
    user_watchlist = Watchlist.objects.filter(user=request.user)
    return render(request, "auctions/watchlist.html", {"watchlist": user_watchlist})

def category_list(request):
    categories = Category.objects.all()
    return render(request, "auctions/categories.html", {"categories": categories})

def category_view(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    listings = AuctionListing.objects.filter(category=category, is_active=True)
    return render(request, "auctions/category.html", {"category": category, "listings": listings})
