from rest_framework import serializers
from .models import TipoAnestesia, TipoProcedimento, Profissional, Procedimento

class TipoAnestesiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoAnestesia
        fields = "__all__"

class TipoProcedimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoProcedimento
        fields = "__all__"

class ProfissionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profissional
        fields = "__all__"

class ProcedimentoSerializer(serializers.ModelSerializer):
    """
    Serializer que aceita nomes em vez de IDs, criando automaticamente 
    objetos caso eles não existam no banco.
    """
    procedimento_nome = serializers.CharField(write_only=True, required=False)
    tipo_anestesia_nome = serializers.CharField(write_only=True, required=False, allow_null=True)
    profissional_nome = serializers.CharField(write_only=True, required=False)

    # 🔽 Campos de leitura (somente para GET)
    procedimento = TipoProcedimentoSerializer(read_only=True)
    tipo_anestesia = TipoAnestesiaSerializer(read_only=True)
    profissional = ProfissionalSerializer(read_only=True)

    class Meta:
        model = Procedimento
        fields = [
            "id",
            "nome_paciente",
            "registro_paciente",
            "data",
            "procedimento",
            "tipo_anestesia",
            "inicio",
            "final",
            "profissional",
            "duracao",
            "procedimento_nome",
            "tipo_anestesia_nome",
            "profissional_nome"
        ]
    
    def create(self, validated_data):
        """
        Criação de Procedimento:

        1. procedimento_nome: gera ou usa TipoProcedimento (evita duplicar CID).
        2. tipo_anestesia_nome: gera ou usa TipoAnestesia.
        3. profissional_nome: gera ou usa Profissional (com CRM único).
        """

        # 🔽 Extrair nomes vindos do JSON
        procedimento_nome = validated_data.pop("procedimento_nome", None)
        tipo_anestesia_nome = validated_data.pop("tipo_anestesia_nome", None)
        profissional_nome = validated_data.pop("profissional_nome", None)

        # 🔽 Criar ou usar TipoProcedimento existente
        if procedimento_nome:
            procedimento_obj = TipoProcedimento.objects.filter(nome=procedimento_nome).first()
            if not procedimento_obj:
                # 🔽 Gerar um novo CID incremental
                ultimo_cadastrado = TipoProcedimento.objects.order_by("-cid").first()
                if ultimo_cadastrado:
                    cid_limpo = ultimo_cadastrado.cid.replace(".", "")  # ex: "000000"
                    novo_int = int(cid_limpo) + 1                       # ex: 1 -> 2
                    cid_formatado = str(novo_int).zfill(6)              # ex: "000002"
                    cid_final = f"{cid_formatado[:3]}.{cid_formatado[3:]}"  # ex: "000.002"
                else:
                    cid_final = "000.001"  # Se não houver registros, começa do 1

                procedimento_obj = TipoProcedimento.objects.create(
                    nome=procedimento_nome,
                    cid=cid_final
                )
            validated_data["procedimento"] = procedimento_obj

        # 🔽 Criar ou usar TipoAnestesia existente
        if tipo_anestesia_nome:
            tipo_anestesia_obj, _ = TipoAnestesia.objects.get_or_create(nome=tipo_anestesia_nome)
            validated_data["tipo_anestesia"] = tipo_anestesia_obj

        # 🔽 Criar ou usar Profissional existente (CRM único)
        if profissional_nome:
            profissional_obj = Profissional.objects.filter(nome=profissional_nome).first()
            if not profissional_obj:
                # 🔽 Gerar um novo CRM incremental
                ultimo_profissional = Profissional.objects.order_by("-crm").first()
                if ultimo_profissional and ultimo_profissional.crm.isdigit():
                    novo_crm = str(int(ultimo_profissional.crm) + 1).zfill(5)  # Incrementa
                else:
                    novo_crm = "00001"  # Se não houver registros, começa do 1

                profissional_obj = Profissional.objects.create(
                    nome=profissional_nome,
                    crm=novo_crm
                )
            validated_data["profissional"] = profissional_obj

        # 🔽 Cria o Procedimento final com os campos já resolvidos
        return super().create(validated_data)
