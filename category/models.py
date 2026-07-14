from django.db import models
from datetime import datetime

class Category(models.Model):

    name        = models.CharField(max_length=30)
    description = models.TextField()
    logo        = models.ImageField(upload_to="category", blank=True, null=True)

    def __str__(self):
        return self.name

