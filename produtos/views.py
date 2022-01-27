from django.views.generic import TemplateView
from django.urls import reverse_lazy
from django.shortcuts import redirect
import re

from .models import Product, Category, SubCategory
from .serializers import ProductSerializer

# DRF
from rest_framework import viewsets, status
from rest_framework.response import Response


# Create your views here.
class ProductView(TemplateView):
    template_name = 'produtos/produtos.html'

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        context['produtos'] = Product.objects.all()
        context['categorias'] = Category.objects.all()
        context['subcategorias'] = SubCategory.objects.all()
        return self.render_to_response(context)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def list(self, request):
        print(request.query_params)

        products = Product.objects.all()

        if request.query_params.get('category'): # Aplica filtro de categoria
            try:
                products = products.filter(category=request.query_params['category'])
            except:
                pass

        if request.query_params.get('subCategory'): # Aplica filtro de subcategoria
            subCategories = request.query_params['subCategory'].split('-')
            try:
                products = products.filter(subcategory__in=subCategories)
            except:
                pass

        if request.query_params.get('price'):
            if request.query_params['price'].lower() == 'asc':
                products = products.order_by('price', 'name')
            elif request.query_params['price'].lower() == 'desc':
                products = products.order_by('-price', 'name')

        # PAGINATION
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = ProductSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):

        if Product.objects.filter(id=pk).exists():
            product = Product.objects.get(id=pk)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        return Response({'error': 'Produto inválido'})