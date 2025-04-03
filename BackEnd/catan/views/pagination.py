from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 10  # 1ページに10件表示
    page_size_query_param = 'page_size'
