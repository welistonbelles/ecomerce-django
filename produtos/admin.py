from django.contrib import admin

from .models import Product, Category, SubCategory

# Register your models here.
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'slug', 'created', 'modified', 'active')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category', 'created', 'modified', 'active')

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('category', 'subcategory', 'created', 'modified', 'active')