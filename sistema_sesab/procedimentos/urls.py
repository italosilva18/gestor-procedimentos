from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from procedimentos.views import (
    TipoAnestesiaViewSet, TipoProcedimentoViewSet, ProfissionalViewSet, ProcedimentoViewSet,
    RegistrarUsuarioView, login_page, login_view,  # Importe a view login_view
    cadastro_procedimento, crud_procedimentos, index, logout_view, profissionais, tipos_anestesia, tipos_procedimentos
)

# Criando um roteador para as rotas da API
router = DefaultRouter()
router.register(r'tipos_anestesia', TipoAnestesiaViewSet)
router.register(r'tipos_procedimento', TipoProcedimentoViewSet)
router.register(r'profissionais', ProfissionalViewSet)
router.register(r'procedimentos', ProcedimentoViewSet, basename='procedimento')  # 👈 Add basename



urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # API
    path("api/", include(router.urls)),
    path("api/registrar/", RegistrarUsuarioView.as_view(), name="registrar_usuario"),

    # Páginas do Frontend
    # Páginas do Frontend
    path("", index, name="index"),  # Página inicial
    path("cadastro/", cadastro_procedimento, name="cadastro_procedimento"),
    path('login/', login_view, name='login'),  # URL para a view login_view
    path('logout/', logout_view, name='logout'),  # URL para a view logout_view
    path('crud/', crud_procedimentos, name='crud_procedimentos'),

    # 🔥 Páginas de gerenciamento
    path("cadastro/tipos_anestesia/", tipos_anestesia, name="tipos_anestesia"),
    path("cadastro/tipos_procedimentos/", tipos_procedimentos, name="tipos_procedimentos"),
    path("cadastro/profissionais/", profissionais, name="profissionais"),
    path("cadastro/procedimentos/", cadastro_procedimento, name="cadastro_procedimento"),
]