from django.contrib import admin
from django.urls import path
from core.views import home_view
from category.views import list_categories, show_category, create_category, update_category, delete_category
from transaction.views import list_transactions, show_transaction, create_transaction, update_transaction, delete_transaction

from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path("", home_view, name="home"),
   
    path("category-list", list_categories, name="list-category"),
    path("category/<int:id_category>", show_category, name="show-category"),
    path("category/create", create_category, name="create-category"),
    path("category/update/<int:id>", update_category, name="update-category"),
    path("category/delete/<int:id>", delete_category, name="delete-category"),

    path("transaction-list", list_transactions, name="list-transactions"),
    path("transaction-detail/<int:id>", show_transaction, name="show-transaction"),
    path("transaction-create", create_transaction, name="create-transaction"),
    
    path("transaction-update/<int:id>",
             update_transaction,
             name="update-transaction"),

    path("transaction-delete/<int:id>", delete_transaction, name="delete-transaction")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
