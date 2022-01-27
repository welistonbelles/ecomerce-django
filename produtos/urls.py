from django.urls import path
from .views import ProductView, ProductViewSet

urlpatterns = [
    path('', ProductView.as_view(), name='products'),
    path('api/v1/', ProductViewSet.as_view({
        'get': 'list',
    })),
    path('api/v1/<str:pk>', ProductViewSet.as_view({
        'get': 'retrieve',
    }))
]