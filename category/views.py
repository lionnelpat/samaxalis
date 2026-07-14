from django.shortcuts import render, redirect

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
        return render(request, "category/create.html")
    else:
        my_name = request.POST['name']
        my_desc = request.POST['description']

        newCategory = Category(
            name=my_name,
            description = my_desc
        )

        savedCate = newCategory.save()
        if savedCate is not None:
            return redirect("list-category")
        else:
            return render(request, "category/create.html")

def update_category(request, id):
    pass

def delete_category(request, id):
    pass