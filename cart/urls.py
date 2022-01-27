from django.urls import path, include

from .views import CartView, CartAPIView


urlpatterns = [
   path('', CartView.as_view(), name='cart'),
   path('api/v1/', CartAPIView.as_view({
        'post': 'create',
    })),
]