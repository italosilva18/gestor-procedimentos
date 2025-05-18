from django.db import models
from datetime import timedelta
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model

User = get_user_model()  # Obtém o modelo de usuário correto


# ✅ Modelo de Tipo de Anestesia
class TipoAnestesia(models.Model):
    nome = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.nome

# ✅ Modelo de Tipo de Procedimento
class TipoProcedimento(models.Model):
    nome = models.CharField(max_length=255)
    cid = models.CharField(max_length=10, unique=True, default="000.000")

    def __str__(self):
        return self.nome

# ✅ Modelo de Profissional
class Profissional(models.Model):
    nome = models.CharField(max_length=255)
    crm = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.nome} ({self.crm})"

# ✅ Modelo de Procedimento
class Procedimento(models.Model):
    nome_paciente = models.CharField(max_length=255)
    registro_paciente = models.CharField(max_length=50)
    data = models.DateField()
    procedimento = models.ForeignKey(TipoProcedimento, on_delete=models.CASCADE)
    tipo_anestesia = models.ForeignKey(TipoAnestesia, on_delete=models.SET_NULL, null=True)
    inicio = models.TimeField()
    final = models.TimeField()
    profissional = models.ForeignKey(Profissional, on_delete=models.CASCADE)
    duracao = models.DurationField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.inicio and self.final:
            hora_inicio = timedelta(hours=self.inicio.hour, minutes=self.inicio.minute)
            hora_final = timedelta(hours=self.final.hour, minutes=self.final.minute)
            self.duracao = hora_final - hora_inicio
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nome_paciente} - {self.procedimento.nome} ({self.data})"

# ✅ Modelo de Usuário Personalizado
class Usuario(AbstractUser):
    is_admin = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="usuario_set",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="usuario_permissions_set",
        blank=True
    )

    def __str__(self):
        return self.username
