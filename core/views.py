from django.shortcuts import render

from transaction.models import Transaction

# Create your views here.

def home_view(request):
    nb_transactions = Transaction.objects.count()
    context = {
        "nbTransactions": nb_transactions
    }


    return render(request, "core/index.html", context)
