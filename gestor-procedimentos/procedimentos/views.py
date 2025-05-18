from urllib import request
from django.shortcuts import render, redirect
from rest_framework import viewsets, status
from django.contrib import messages
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import TipoAnestesia, TipoProcedimento, Profissional, Procedimento
from .serializers import (
    TipoAnestesiaSerializer, TipoProcedimentoSerializer,
    ProfissionalSerializer, ProcedimentoSerializer
)

class TipoAnestesiaViewSet(viewsets.ModelViewSet):
    queryset = TipoAnestesia.objects.all()
    serializer_class = TipoAnestesiaSerializer

class TipoProcedimentoViewSet(viewsets.ModelViewSet):
    queryset = TipoProcedimento.objects.all()
    serializer_class = TipoProcedimentoSerializer

class ProfissionalViewSet(viewsets.ModelViewSet):
    queryset = Profissional.objects.all()
    serializer_class = ProfissionalSerializer

class ProcedimentoViewSet(viewsets.ModelViewSet):
    serializer_class = ProcedimentoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Procedimento.objects.all()
        data_inicio = self.request.query_params.get('data_inicio')
        data_fim = self.request.query_params.get('data_fim')
        if data_inicio and data_fim:
            queryset = queryset.filter(data__range=[data_inicio, data_fim])
        return queryset

    def create(self, request, *args, **kwargs):
        print("Recebendo dados:", request.data)
        return super().create(request, *args, **kwargs)

class RegistrarUsuarioView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Usuário e senha são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Usuário já existe'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password, is_staff=True)
        return Response({'message': 'Usuário criado com sucesso'}, status=status.HTTP_201_CREATED)

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        print(f"Tentativa de login: username={username}, password={password}")
        user = authenticate(request, username=username, password=password)
        print(f"Usuário autenticado: {user}")
        if user is not None:
            login(request, user)
            return redirect('/')
        else:
            print("Autenticação falhou")
            return render(request, 'login.html', {'error': 'Credenciais inválidas'})
    else:
        return render(request, 'login.html')

def logout_view(request):
    logout(request)
    messages.info(request, "Você saiu com sucesso.")
    return redirect('login')

@login_required(login_url='/login/')
def index(request):
    return render(request, "index.html")

def cadastro_procedimento(request):
    return render(request, "cadastro_procedimento.html")

@login_required(login_url='/login/')
def crud_procedimentos(request):
    print(f"Usuário na view crud_procedimentos: {request.user}")
    context = {'user': request.user}
    return render(request, 'crud.html', context)

@login_required
def tipos_anestesia(request):
    return render(request, "tipos_anestesia.html")

@login_required
def tipos_procedimentos(request):
    return render(request, "tipos_procedimentos.html")

@login_required
def profissionais(request):
    return render(request, "profissionais.html")
