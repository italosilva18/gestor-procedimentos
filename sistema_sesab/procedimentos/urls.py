from django.urls import path, include
from rest_framework.routers import DefaultRouter
from procedimentos.views import (
    TipoAnestesiaViewSet,
    TipoProcedimentoViewSet,
    ProfissionalViewSet,
    ProcedimentoViewSet,
    login_view,
    logout_view,
    index,
    cadastro_procedimento,
    crud_procedimentos,
    tipos_anestesia,
    tipos_procedimentos,
    profissionais,
    RegistrarUsuarioView
)

router = DefaultRouter()
router.register(r'tipos_anestesia', TipoAnestesiaViewSet)
router.register(r'tipos_procedimentos', TipoProcedimentoViewSet)
router.register(r'profissionais', ProfissionalViewSet)
router.register(r'procedimentos', ProcedimentoViewSet, basename='procedimentos')  # 👈 Aqui o basename adicionado

urlpatterns = [
    path('api/', include(router.urls)),

    # Páginas do sistema
    path('', index, name='index'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('cadastro/', cadastro_procedimento, name='cadastro_procedimento'),
    path('crud/', crud_procedimentos, name='crud_procedimentos'),
    path('cadastro/tipos_anestesia/', tipos_anestesia, name='tipos_anestesia'),
    path('cadastro/tipos_procedimentos/', tipos_procedimentos, name='tipos_procedimentos'),
    path('cadastro/profissionais/', profissionais, name='profissionais'),

    # API para registro de usuário
    path('api/registrar/', RegistrarUsuarioView.as_view(), name='registrar_usuario'),
]
