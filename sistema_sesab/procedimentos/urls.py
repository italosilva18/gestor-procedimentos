from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from procedimentos.views import (
    TipoAnestesiaViewSet, TipoProcedimentoViewSet, ProfissionalViewSet, ProcedimentoViewSet,
    RegistrarUsuarioView, LoginUsuarioView,
    cadastro_procedimento, crud_procedimentos, login_page, index, profissionais, tipos_anestesia, tipos_procedimentos
)

# Criando um roteador para as rotas da API
router = DefaultRouter()
router.register(r'tipos_anestesia', TipoAnestesiaViewSet)
router.register(r'tipos_procedimento', TipoProcedimentoViewSet)
router.register(r'profissionais', ProfissionalViewSet)
router.register(r'procedimentos', ProcedimentoViewSet)

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # API
    path("api/", include(router.urls)),
    path("api/registrar/", RegistrarUsuarioView.as_view(), name="registrar_usuario"),
    path("api/login/", LoginUsuarioView.as_view(), name="login_usuario"),

    # Páginas do Frontend
    path("", index, name="index"),  # Página inicial
    path("cadastro/", cadastro_procedimento, name="cadastro_procedimento"),
    path("login/", login_page, name="login_page"),
    path('crud/', crud_procedimentos, name='crud_procedimentos'),

      # 🔥 Páginas de gerenciamento
    path("cadastro/tipos_anestesia/", tipos_anestesia, name="tipos_anestesia"),
    path("cadastro/tipos_procedimentos/", tipos_procedimentos, name="tipos_procedimentos"),
    path("cadastro/profissionais/", profissionais, name="profissionais"),
    path("cadastro/procedimentos/", cadastro_procedimento, name="cadastro_procedimento"),
]
