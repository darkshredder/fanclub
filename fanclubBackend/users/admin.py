# encoding: utf-8
from __future__ import unicode_literals
from django.contrib import admin
from .models import Profile, Hobby
import csv
from django.http import HttpResponse

class ExportCsvMixin:
    def export_as_csv(self, request, queryset):

        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        return response

    export_as_csv.short_description = "Export Selected"


# Register your models here.

admin.site.register(Hobby)

class HobbyInlines(admin.TabularInline):
    model = Profile.hobbies.through
    verbose_name_plural = "Hobbies"
    extra = 1

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ["full_name", "email"]
    search_fields = ["email"]
    actions = ["export_as_csv"]
    inlines = [HobbyInlines]
    exclude = ['hobbies']


