from django.contrib import admin
from django.urls import path,re_path
from django.conf.urls import include
from catan.urls import router as catan_router
from django.conf import settings
from django.views.static import serve
from django.http import JsonResponse

# ヘルスチェック用
def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(catan_router.urls)),
    path('health/', health_check),
]