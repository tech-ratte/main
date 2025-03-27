from django.contrib import admin
from django.urls import path,re_path
from django.conf.urls import include
from catan.urls import router as catan_router
from django.conf import settings
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(catan_router.urls)),
]

# if not settings.DEBUG:
#     urlpatterns += [
#         re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
#     ]