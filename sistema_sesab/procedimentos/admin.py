from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import TipoAnestesia, TipoProcedimento, Profissional, Procedimento, User
admin.site.unregister(User)


# ✅ Configuração do Admin para Tipos de Anestesia
@admin.register(TipoAnestesia)
class TipoAnestesiaAdmin(admin.ModelAdmin):
    list_display = ("nome",)
    search_fields = ("nome",)
    ordering = ("nome",)

# ✅ Configuração do Admin para Tipos de Procedimento
@admin.register(TipoProcedimento)
class TipoProcedimentoAdmin(admin.ModelAdmin):
    list_display = ("nome", "cid")
    search_fields = ("nome", "cid")
    ordering = ("nome",)

# ✅ Configuração do Admin para Profissionais (Médicos, Enfermeiros, etc.)
@admin.register(Profissional)
class ProfissionalAdmin(admin.ModelAdmin):
    list_display = ("nome", "crm")
    search_fields = ("nome", "crm")
    ordering = ("nome",)

# ✅ Configuração do Admin para Procedimentos
@admin.register(Procedimento)
class ProcedimentoAdmin(admin.ModelAdmin):
    list_display = ("nome_paciente", "registro_paciente", "procedimento", "tipo_anestesia", "data", "inicio", "final", "duracao", "profissional")
    search_fields = ("nome_paciente", "registro_paciente", "procedimento__nome", "profissional__nome")
    list_filter = ("data", "procedimento", "profissional", "tipo_anestesia")
    ordering = ("-data",)

# ✅ Agora, registre o User novamente com personalizações
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "is_staff", "is_superuser", "date_joined")
    search_fields = ("username", "email")
    list_filter = ("is_staff", "is_superuser")
    ordering = ("username",)

    # Personalizando os campos visíveis no Django Admin
    fieldsets = (
        ("Informações do Usuário", {"fields": ("username", "password", "email")}),
        ("Permissões", {"fields": ("is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Datas Importantes", {"fields": ("last_login", "date_joined")}),
    )

    # Definir os campos que aparecem ao adicionar um novo usuário
    add_fieldsets = (
        ("Criar Novo Usuário", {
            "classes": ("wide",),
            "fields": ("username", "email", "password1", "password2"),
        }),
    )