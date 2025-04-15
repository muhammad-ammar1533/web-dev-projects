from django.shortcuts import render, redirect
from django import forms
import markdown2
import random

from . import util

class NewEntryForm(forms.Form):
    title = forms.CharField(label="Title")
    content = forms.CharField(widget=forms.Textarea, label="Content")

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, title):
    content = util.get_entry(title)
    if content is None:
        return render(request, "encyclopedia/error.html", {"message": "Entry not found."})
    return render(request, "encyclopedia/entry.html", {
        "title": title,
        "content": markdown2.markdown(content)
    })

def search(request):
    query = request.GET.get("q", "").strip()
    if not query:
        return redirect("index")
    entries = util.list_entries()
    if query in entries:
        return redirect("entry", title=query)
    results = [entry for entry in entries if query.lower() in entry.lower()]
    return render(request, "encyclopedia/search.html", {"query": query, "results": results})

def new_page(request):
    if request.method == "POST":
        form = NewEntryForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            content = form.cleaned_data["content"]
            if util.get_entry(title):
                return render(request, "encyclopedia/error.html", {"message": "Entry already exists."})
            util.save_entry(title, content)
            return redirect("entry", title=title)
    else:
        form = NewEntryForm()
    return render(request, "encyclopedia/new_page.html", {"form": form})

def edit_page(request, title):
    content = util.get_entry(title)
    if content is None:
        return render(request, "encyclopedia/error.html", {"message": "Entry not found."})
    if request.method == "POST":
        form = NewEntryForm(request.POST)
        if form.is_valid():
            util.save_entry(title, form.cleaned_data["content"])
            return redirect("entry", title=title)
    else:
        form = NewEntryForm(initial={"title": title, "content": content})
    return render(request, "encyclopedia/edit_page.html", {"title": title, "form": form})

def random_page(request):
    entries = util.list_entries()
    if not entries:
        return render(request, "encyclopedia/error.html", {"message": "No entries available."})
    return redirect("entry", title=random.choice(entries))
