from django.db import models
from django.db.models import Sum

class Category(models.Model):

    name        = models.CharField(max_length=30)
    description = models.TextField()
    logo        = models.ImageField(upload_to="category", blank=True, null=True)

    def __str__(self):
        return self.name
    

    @property
    def total_transactions(self):
        total = self.transaction_set.aggregate(total=Sum("amount"))["total"]
        return total or 0


