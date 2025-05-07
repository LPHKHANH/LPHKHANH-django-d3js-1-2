from django.shortcuts import render
from django.http import JsonResponse
import pandas as pd
import logging
import traceback
from django.views.decorators.cache import cache_page

# Thiết lập logging
logger = logging.getLogger(__name__)

def load_data():
    """
    Tải và xử lý dữ liệu từ Google Sheets
    """
    try:
        logger.info("Bắt đầu tải dữ liệu từ Google Sheets")
        url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTxS5SEzq5_0TwcJJhtpvQhJJ5F6JVx4kViSy0ApDk2ZSYAon2owZfEel9nl3Mngjl-Iz_5IQbfU93Q/pub?gid=1587069319&single=true&output=csv'
        df = pd.read_csv(url)
        
        # Log thông tin cơ bản về dữ liệu
        logger.info(f"Đã tải dữ liệu với {len(df)} dòng và {len(df.columns)} cột")
        logger.info(f"Các cột: {df.columns.tolist()}")
        
        # Chuyển đổi dữ liệu
        df['Order Date'] = pd.to_datetime(df['Order Date'], dayfirst=True, errors='coerce')
        df['Ship Date'] = pd.to_datetime(df['Ship Date'], dayfirst=True, errors='coerce')
        
        # Kiểm tra dữ liệu null
        null_dates = df['Order Date'].isnull().sum()
        if null_dates > 0:
            logger.warning(f"Tìm thấy {null_dates} giá trị Order Date null")
            
        df = df.dropna(subset=['Order Date', 'Ship Date'])
        
        df['Order Month'] = df['Order Date'].dt.to_period('M').astype(str)
        df['Order Quarter'] = df['Order Date'].dt.to_period('Q').astype(str)
        df['Order Year'] = df['Order Date'].dt.year.astype(str)
        df['Shipping Days'] = (df['Ship Date'] - df['Order Date']).dt.days
        
        # Chuyển đổi Sales thành số
        df['Sales'] = pd.to_numeric(df['Sales'], errors='coerce')
        null_sales = df['Sales'].isnull().sum()
        if null_sales > 0:
            logger.warning(f"Tìm thấy {null_sales} giá trị Sales null")
            
        df = df.dropna(subset=['Sales'])
        
        logger.info("Đã xử lý dữ liệu thành công")
        return df
    except Exception as e:
        logger.error(f"Lỗi khi tải dữ liệu: {str(e)}")
        logger.error(traceback.format_exc())
        # Trả về DataFrame trống với các cột cần thiết
        return pd.DataFrame(columns=['Order Date', 'Ship Date', 'Order Month', 'Order Quarter', 
                                    'Order Year', 'Shipping Days', 'Sales', 'Region', 'City', 
                                    'State', 'Category', 'Sub-Category', 'Ship Mode'])

# Trang chính - dashboard
def dashboard(request):
    """
    Hiển thị trang dashboard chính với các nút điều hướng
    """
    logger.info("Truy cập trang dashboard")
    return render(request, 'myapp/dashboard.html')

# Trang debug
def debug(request):
    """
    Hiển thị trang debug để kiểm tra từng biểu đồ riêng lẻ
    """
    logger.info("Truy cập trang debug")
    return render(request, 'myapp/debug.html')

# Các trang phân tích
def overview(request):
    """
    Trang 1.1: Tổng quan
    """
    logger.info("Truy cập trang tổng quan")
    return render(request, 'myapp/overview.html')

def by_time(request):
    """
    Trang 1.2: Theo thời gian
    """
    logger.info("Truy cập trang theo thời gian")
    return render(request, 'myapp/by_time.html')

def by_region(request):
    """
    Trang 1.3: Theo vùng
    """
    logger.info("Truy cập trang theo vùng")
    return render(request, 'myapp/by_region.html')

def by_category(request):
    """
    Trang 1.4: Theo danh mục sản phẩm
    """
    logger.info("Truy cập trang theo danh mục sản phẩm")
    return render(request, 'myapp/by_category.html')

def shipping_time(request):
    """
    Trang 2.1: Thời gian vận chuyển
    """
    logger.info("Truy cập trang thời gian vận chuyển")
    return render(request, 'myapp/shipping_time.html')

def shipping_method(request):
    """
    Trang 2.2: Phân phối theo phương thức
    """
    logger.info("Truy cập trang phân phối theo phương thức")
    return render(request, 'myapp/shipping_method.html')

# API endpoints
@cache_page(60 * 15)  # Cache trong 15 phút
def chart1_data(request):
    """
    API cho biểu đồ 1: Tổng doanh số
    """
    try:
        logger.info("Đang xử lý dữ liệu cho biểu đồ 1")
        df = load_data()
        total_sales = float(df['Sales'].sum())
        logger.info(f"Tổng doanh số: {total_sales}")
        return JsonResponse({'total_sales': total_sales})
    except Exception as e:
        logger.error(f"Lỗi khi xử lý dữ liệu cho biểu đồ 1: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

@cache_page(60 * 15)
def chart2_data(request):
    """
    API cho biểu đồ 2: Doanh số trung bình
    """
    try:
        logger.info("Đang xử lý dữ liệu cho biểu đồ 2")
        df = load_data()
        avg_sales = float(df['Sales'].mean())
        logger.info(f"Doanh số trung bình: {avg_sales}")
        return JsonResponse({'avg_sales': avg_sales})
    except Exception as e:
        logger.error(f"Lỗi khi xử lý dữ liệu cho biểu đồ 2: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

@cache_page(60 * 15)
def chart3_data(request):
    """
    API cho biểu đồ 3: Phân bố doanh số
    """
    try:
        logger.info("Đang xử lý dữ liệu cho biểu đồ 3")
        df = load_data()
        sales = df['Sales'].tolist()
        logger.info(f"Số lượng dữ liệu doanh số: {len(sales)}")
        return JsonResponse({'sales': sales})
    except Exception as e:
        logger.error(f"Lỗi khi xử lý dữ liệu cho biểu đồ 3: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

@cache_page(60 * 15)
def chart4_data(request):
    """
    API cho biểu đồ 4: Doanh số theo tháng
    """
    try:
        logger.info("Đang xử lý dữ liệu cho biểu đồ 4")
        df = load_data()
        monthly_sales = df.groupby('Order Month')['Sales'].sum().reset_index()
        monthly_sales.columns = ['month', 'sales']
        data = monthly_sales.to_dict(orient='records')
        logger.info(f"Số lượng tháng: {len(data)}")
        return JsonResponse(data, safe=False)
    except Exception as e:
        logger.error(f"Lỗi khi xử lý dữ liệu cho biểu đồ 4: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

@cache_page(60 * 15)
def chart5_data(request):
    """
    API cho biểu đồ 5: Doanh số theo quý
    """
    try:
        logger.info("Đang xử lý dữ liệu cho biểu đồ 5")
        df = load_data()
        quarterly_sales = df.groupby('Order Quarter')['Sales'].sum().reset_index()
        quarterly_sales.columns = ['quarter', 'sales']
        data = quarterly_sales.to_dict(orient='records')
        logger.info(f"Số lượng quý: {len(data)}")
        return JsonResponse(data, safe=False)
    except Exception as e:
        logger.error(f"Lỗi khi xử lý dữ liệu cho biểu đồ 5: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

@cache_page(60 * 15)
def chart6_data(request):
    """
    API cho biểu đồ 6: Doanh số theo năm
    """
    try:
        logger.info("Đang xử lý dữ liệu cho biểu đồ 6")
        df = load_data()
        yearly_sales = df.groupby('Order Year')['Sales'].sum().reset_index()
        yearly_sales.columns = ['year', 'sales']
        data = yearly_sales.to_dict(orient='records')
        logger.info(f"Số lượng năm: {len(data)}")
        return JsonResponse(data, safe=False)
    except Exception as e:
        logger.error(f"Lỗi khi xử lý dữ liệu cho biểu đồ 6: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

@cache_page(60 * 15)
def chart7_data(request):
    """
    API cho biểu đồ 7: Doanh số theo khu vực
    """
    try:
        logger.info("Đang xử lý dữ liệu cho biểu đồ 7")
        df = load_data()
        region_sales = df.groupby('Region')['Sales'].sum().reset_index()
        region_sales.columns = ['region', 'sales']
        data = region_sales.to_dict(orient='records')
        logger.info(f"Số lượng khu vực: {len(data)}")
        return JsonResponse(data, safe=False)
    except Exception as e:
        logger.error(f"Lỗi khi xử lý dữ liệu cho biểu đồ 7: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

@cache_page(60 * 15)
def chart8_data(request):
    """
    API cho biểu đồ 8: Doanh số theo thành phố
    """
    try:
        logger.info("Đang xử lý dữ liệu cho biểu đồ 8")
        df = load_data()
        city_sales = df.groupby('City')['Sales'].sum().sort_values(ascending=False).head(10).reset_index()
        city_sales.columns = ['city', 'sales']
        data = city_sales.to_dict(orient='records')
        logger.info(f"Số lượng thành phố: {len(data)}")
        return JsonResponse(data, safe=False)
    except Exception as e:
        logger.error(f"Lỗi khi xử lý dữ liệu cho biểu đồ 8: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

@cache_page(60 * 15)
def chart9_data(request):
    """
    API cho biểu đồ 9: Doanh số theo bang
    """
    try:
        logger.info("Đang xử lý dữ liệu cho biểu đồ 9")
        df = load_data()
        state_sales = df.groupby('State')['Sales'].sum().sort_values(ascending=False).head(10).reset_index()
        state_sales.columns = ['state', 'sales']
        data = state_sales.to_dict(orient='records')
        logger.info(f"Số lượng bang: {len(data)}")
        return JsonResponse(data, safe=False)
    except Exception as e:
        logger.error(f"Lỗi khi xử lý dữ liệu cho biểu đồ 9: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

@cache_page(60 * 15)
def chart10_data(request):
    """
    API cho biểu đồ 10: Doanh số theo danh mục
    """
    try:
        logger.info("Đang xử lý dữ liệu cho biểu đồ 10")
        df = load_data()
        category_sales = df.groupby('Category')['Sales'].sum().reset_index()
        category_sales.columns = ['category', 'sales']
        data = category_sales.to_dict(orient='records')
        logger.info(f"Số lượng danh mục: {len(data)}")
        return JsonResponse(data, safe=False)
    except Exception as e:
        logger.error(f"Lỗi khi xử lý dữ liệu cho biểu đồ 10: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

@cache_page(60 * 15)
def chart11_data(request):
    """
    API cho biểu đồ 11: Doanh số theo phụ danh mục
    """
    try:
        logger.info("Đang xử lý dữ liệu cho biểu đồ 11")
        df = load_data()
        subcategory_sales = df.groupby('Sub-Category')['Sales'].sum().reset_index()
        subcategory_sales.columns = ['sub_category', 'sales']
        data = subcategory_sales.to_dict(orient='records')
        logger.info(f"Số lượng phụ danh mục: {len(data)}")
        return JsonResponse(data, safe=False)
    except Exception as e:
        logger.error(f"Lỗi khi xử lý dữ liệu cho biểu đồ 11: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

@cache_page(60 * 15)
def chart12_data(request):
    """
    API cho biểu đồ 12: Thời gian vận chuyển theo phương thức giao hàng
    """
    try:
        logger.info("Đang xử lý dữ liệu cho biểu đồ 12")
        df = load_data()
        shipping_days = df.groupby('Ship Mode')['Shipping Days'].mean().reset_index()
        shipping_days.columns = ['ship_mode', 'avg_days']
        data = shipping_days.to_dict(orient='records')
        logger.info(f"Số lượng phương thức giao hàng: {len(data)}")
        return JsonResponse(data, safe=False)
    except Exception as e:
        logger.error(f"Lỗi khi xử lý dữ liệu cho biểu đồ 12: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

@cache_page(60 * 15)
def chart13_data(request):
    """
    API cho biểu đồ 13: Phân phối theo phương thức giao hàng
    """
    try:
        logger.info("Đang xử lý dữ liệu cho biểu đồ 13")
        df = load_data()
        ship_mode_counts = df['Ship Mode'].value_counts().reset_index()
        ship_mode_counts.columns = ['ship_mode', 'count']
        data = ship_mode_counts.to_dict(orient='records')
        logger.info(f"Số lượng phương thức giao hàng: {len(data)}")
        return JsonResponse(data, safe=False)
    except Exception as e:
        logger.error(f"Lỗi khi xử lý dữ liệu cho biểu đồ 13: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)