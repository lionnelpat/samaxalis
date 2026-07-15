from django.shortcuts import get_object_or_404, render, redirect

from category.forms import CategoryForm
from category.models import Category
from django.http import JsonResponse

from django.db.models import Count, Avg, Sum, Min, Max

def list_categories(request):

    response = Category.objects.all() 

    context = {
        "categories": response
    }

    return render(request, "category/index.html", context)

def show_category(request, id_category):
    category = Category.objects.get(id=id_category)
    context =  {
        "category": category
    }

    return render(request, "category/show.html", context)

def create_category(request):
    
    if request.method == "GET":
        form = CategoryForm()
        context = {
            "form": form
        }
        return render(request, "category/create.html", context)
    else:
        form = CategoryForm(request.POST)        
        if form.is_valid():
            form.save()
            return redirect("list-category")
        else:
            context = {
                "form": form
            }
            return render(request, "category/create.html", context)

def update_category(request, id):
    cat = get_object_or_404(Category, id=id)
    if request.method == "POST": 
        form = CategoryForm(request.POST, instance=cat)
        if form.is_valid():
            form.save()
            return redirect("list-category")
        else: 
            context = {
                "cat": cat,
                "form": form
            }
        return render(request, "category/update.html", context)

    else: 
        form = CategoryForm(instance=cat)
        context = {
            "cat": cat,
            "form": form
        }
        return render(request, "category/update.html", context)
    

def delete_category(request, id):
    cat = get_object_or_404(Category, id=id)
    cat.delete()
    return redirect("list-category")