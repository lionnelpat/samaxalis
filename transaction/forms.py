from django import forms

from transaction.models import Transaction
from category.models import Category


class TransactionForm(forms.ModelForm):

    class Meta: 

        model = Transaction
        fields = ["label","description", "amount", "trx_type", "category"]

        widgets = {
            "label": forms.TextInput(attrs={
                "placeholder": "Ex : Paiement scolarité 1er tranche",
                "class": "form-control"
            }),
            "description": forms.Textarea(attrs={
                "class": "form-control"
            }),

            "date": forms.DateInput(attrs={"type": "date"}),
            "amount": forms.NumberInput(attrs={"min": 0, "step": 1,  "class": "form-control"}),
        }
