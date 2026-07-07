from django.contrib import admin
from django.urls import path

from core.views import home_view
from category.views import index_view, show_category, create_category_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", home_view, name="home"),
    path("categories", index_view, name="categories"),
    path("categories/<int:id>", show_category, name="show-category"),
    path("categories/create", create_category_view, name="create-category" )
]
