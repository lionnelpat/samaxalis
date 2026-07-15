from django import forms

from .models import Category


class CategoryForm(forms.ModelForm):
    class Meta: 
        model = Category
        fields = ["name", "description"]

        widgets = {
             "name": forms.TextInput(attrs={
                "placeholder": "Ex : Loyer, Facture",
                "class": "form-control"
            }),
            "description": forms.Textarea(attrs={
                "class": "form-control"
            })
        }