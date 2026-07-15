from django.shortcuts import render

from django.db.models import Sum
from transaction.models import Transaction

# Create your views here.

def home_view(request):
    counter = Transaction.objects.count()
    revenus = Transaction.objects.filter(trx_type=Transaction.TRANSACTION_TYPES[0][0]).aggregate(
        value=Sum("amount")
    )
    depenses = Transaction.objects.filter(trx_type=Transaction.TRANSACTION_TYPES[1][0]).aggregate(
        value=Sum("amount")
    )
    context = {
        "summary": {
            "solde": (revenus["value"] or 0) - (depenses["value"] or 0),
            "revenus": revenus["value"] or 0,
            "depenses": depenses["value"] or 0,
            "count": counter,
        }
    }


    return render(request, "core/index.html", context)
