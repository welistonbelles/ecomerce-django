from tkinter.tix import Tree
from django.views.generic import TemplateView
from django.urls import reverse_lazy
from django.shortcuts import redirect


from produtos.models import Product
from .cart import Cart

# DRF
from rest_framework import viewsets, status
from rest_framework.response import Response




class CartView(TemplateView):
    template_name = 'cart/cart.html'
    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        context['cart'] = []
        if request.session.get('cart'):
            for produto in request.session['cart']:
                context['cart'].append(request.session['cart'][produto])
        print(context['cart'])
        return self.render_to_response(context)


class CartAPIView(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    
    

    def create(self, request, *args, **kwargs):

        # Só retorna resultado para usuários autenticados
        if not request.user.is_authenticated:
            return Response({'msg': 'Você precisa estar logado para fazer isso.'}, status=status.HTTP_401_UNAUTHORIZED)

        cart = Cart(request)

        if request.data.get('msg') and request.data['msg'] == 'clean':
            cart.clean()
            return Response({"msg": "Carrinho esvaziado."}, status=status.HTTP_201_CREATED)

        if request.data.get('id'):
            if request.data.get('msg') and request.data['msg'] == 'remove':
                cart.remove(request.data['id'])
                
            elif request.data.get('msg') and request.data['msg'] == 'add':
                if Product.objects.filter(id=request.data['id']).exists():
                    product = Product.objects.get(id=request.data['id'])
                    if request.data.get('amount'):
                        cart.add(product, request.data['amount'])
                    else:
                        cart.add(product)

            elif request.data.get('msg') and request.data['msg'] == 'update':
                if Product.objects.filter(id=request.data['id']).exists():
                    product = Product.objects.get(id=request.data['id'])
                    if request.data.get('amount'):
                        cart.add(product, request.data['amount'], override=True)
                    else:
                        cart.add(product, override=True)
                
                    if request.session.get('cart'):
                        for produto in request.session['cart']:
                            print(request.session['cart'][produto])

        return Response({"msg": "Produto adicionado ao carrinho."}, status=status.HTTP_201_CREATED)