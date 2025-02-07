from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import TipoAnestesia, TipoProcedimento, Profissional, Procedimento
from .serializers import TipoAnestesiaSerializer, TipoProcedimentoSerializer, ProfissionalSerializer, ProcedimentoSerializer

class TipoAnestesiaViewSet(viewsets.ModelViewSet):
    queryset = TipoAnestesia.objects.all()
    serializer_class = TipoAnestesiaSerializer

class TipoProcedimentoViewSet(viewsets.ModelViewSet):
    queryset = TipoProcedimento.objects.all()
    serializer_class = TipoProcedimentoSerializer
    #permission_classes = [IsAuthenticated]  # 🔐 Apenas usuários autenticados podem visualizar

class ProfissionalViewSet(viewsets.ModelViewSet):
    queryset = Profissional.objects.all()
    serializer_class = ProfissionalSerializer

class ProcedimentoViewSet(viewsets.ModelViewSet):
    queryset = Procedimento.objects.all()
    serializer_class = ProcedimentoSerializer
    permission_classes = [IsAuthenticated]  # ✅ Exige autenticação para edição 
    
    def create(self, request, *args, **kwargs):
        print("Recebendo dados:", request.data)  # 🔥 Debug do que está chegando na API
        return super().create(request, *args, **kwargs)

# ✅ Endpoint de Registro de Usuário
class RegistrarUsuarioView(APIView):
    permission_classes = [AllowAny]  # Permite criar usuários sem autenticação

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Usuário e senha são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Usuário já existe'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password, is_staff=True)
        return Response({'message': 'Usuário criado com sucesso'}, status=status.HTTP_201_CREATED)
    

# ✅ Endpoint de Login (Gera Token JWT)
@method_decorator(csrf_exempt, name='dispatch')
class LoginUsuarioView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({'refresh': str(refresh), 'access': str(refresh.access_token)})
        
        return Response({'error': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
# index view    
def cadastro_procedimento(request):
    return render(request, "procedimentos/cadastro_procedimento.html")

@login_required(login_url='/login/')
def crud_procedimentos(request):
    return render(request, 'procedimentos/crud.html')

def login_page(request):
    return render(request, "procedimentos/login.html")

def index(request):
    return render(request, "index.html")

