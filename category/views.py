from django.shortcuts import render, redirect

from category.models import Category
from django.http import JsonResponse

def index_view(request):

    categories = list(Category.objects.filter(name="Lo").values())  # SELECT * FROM categories; 

    context =  {
        "categories": categories
    }

    return JsonResponse(context) 

def show_category(request, id):
    category = Category.objects.last()
    context =  {
        "id": category.id,
        "name": category.name,
        "description": category.description
    }

    return JsonResponse(context) 

def create_category_view(request):

    newCategory = Category.objects.create(
        name = "Loyer",
        description = "Vraiment si tu payes pas, tu vas lu l'heure!!!"
    )

    newCategory.save()

    return redirect("categories")