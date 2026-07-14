from django.db import models

from category.models import Category


class Transaction(models.Model):

    TRANSACTION_TYPES = (
        ("IN","ENTREE"),
        ("EX","SORTIE")
    )

    label = models.CharField(max_length=30)
    description= models.TextField()
    amount = models.PositiveIntegerField()
    trx_type = models.CharField(max_length=2,choices=TRANSACTION_TYPES )
    trx_date = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(to=Category, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.label
    

    class Meta:

        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"
        ordering = ['-trx_date']