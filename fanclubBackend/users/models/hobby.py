from django.db import models

class Hobby(models.Model):

    name = models.CharField(max_length=50, verbose_name="Hobby name")
    
    def __str__(self):
        return self.name

    class Meta:
        """
        Meta class for Hobbies
        """
        verbose_name_plural = 'Hobby'