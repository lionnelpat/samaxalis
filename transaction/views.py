from django.shortcuts import render, get_object_or_404, redirect
from transaction.models import Transaction
from transaction.forms import TransactionForm

from django.contrib import messages

def list_transactions(request):
    # 1- Recuperer la liste depuis la BDD 
    list_of_transactions =  Transaction.objects.all()
    # 2- mettre dans un dictionnaire qui s'appelle contexte 
    context = {
        "transactions": list_of_transactions
    }
    # retourner avec RENDER le HTML et le contexte 
    return render(request, "transaction/index.html", context)


def show_transaction(request, id):
    trx = get_object_or_404(Transaction,pk=id)
    context = {
        "trx": trx
    }
    return render(request, "transaction/show.html", context)


def create_transaction(request): 

    if request.method == "POST": 
        form = TransactionForm(request.POST)

        if form.is_valid():
            form.save()
            messages.success(request, "Transaction bien enregistrée!!!")
            return redirect("list-transactions")
        else:
            messages.error(request, "Erreur lors de la création!!!! ")
            context = {
                "form": form
            }
            return render(request, "transaction/create.html", context)
    else: 
        trx_form = TransactionForm()
        context = {
            "form": trx_form
        }
        return render(request, "transaction/create.html", context)
    

def update_transaction(request, id):

    # je recupère la trx a modifier 
    trx = get_object_or_404(Transaction, id=id)

    if request.method == "POST": 
        form = TransactionForm(request.POST,instance=trx)
        if form.is_valid():
            form.save()
            messages.success(request, "Transaction mise à jour avec success!!!")
            return redirect("list-transactions")
        else: 
            context = {
                "trx": trx,
                "form": form
            }

            return render(request, "transaction/update.html", context)
    else:

        form = TransactionForm(instance=trx)

        context = {
            "trx": trx,
            "form": form
        }

        return render(request, "transaction/update.html", context)
    

def delete_transaction(request, id):

    trx = get_object_or_404(Transaction, id=id)
    trx.delete()
    messages.success(request, "Transaction supprimée avec success!!")
    return redirect("list-transactions")
