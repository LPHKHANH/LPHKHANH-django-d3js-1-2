from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('debug/', views.debug, name='debug'),
    
    # Các trang phân tích
    path('overview/', views.overview, name='overview'),
    path('by-time/', views.by_time, name='by_time'),
    path('by-region/', views.by_region, name='by_region'),
    path('by-category/', views.by_category, name='by_category'),
    path('shipping-time/', views.shipping_time, name='shipping_time'),
    path('shipping-method/', views.shipping_method, name='shipping_method'),
    
    # API endpoints
    path('api/chart1/', views.chart1_data, name='chart1_data'),
    path('api/chart2/', views.chart2_data, name='chart2_data'),
    path('api/chart3/', views.chart3_data, name='chart3_data'),
    path('api/chart4/', views.chart4_data, name='chart4_data'),
    path('api/chart5/', views.chart5_data, name='chart5_data'),
    path('api/chart6/', views.chart6_data, name='chart6_data'),
    path('api/chart7/', views.chart7_data, name='chart7_data'),
    path('api/chart8/', views.chart8_data, name='chart8_data'),
    path('api/chart9/', views.chart9_data, name='chart9_data'),
    path('api/chart10/', views.chart10_data, name='chart10_data'),
    path('api/chart11/', views.chart11_data, name='chart11_data'),
    path('api/chart12/', views.chart12_data, name='chart12_data'),
    path('api/chart13/', views.chart13_data, name='chart13_data'),
]