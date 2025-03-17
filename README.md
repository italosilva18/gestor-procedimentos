# Sistema de Registro de Procedimentos Obstétricos da Maternidade Albert Sabin

Este sistema foi desenvolvido com o intuito de auxiliar a equipe médica do Centro Obstétrico da Maternidade Albert Sabin a registrar os procedimentos realizados, proporcionando uma maneira eficiente e organizada de gerenciar as informações.

---

## Funcionalidades

- **Registro de procedimentos**:  
  Permite registrar os detalhes de cada procedimento, incluindo:
  - Nome do paciente
  - Registro
  - Tipo de procedimento
  - Anestesia
  - Data
  - Hora de início e fim
  - Profissional responsável
  - Duração

- **Gerenciamento de cadastros**:
  - **Tipos de Anestesia**: Cadastro e gerenciamento dos diferentes tipos de anestesia disponíveis.
  - **Tipos de Procedimento**: Cadastro e gerenciamento dos tipos de procedimentos realizados no centro obstétrico, incluindo seus respectivos CIDs.
  - **Profissionais**: Cadastro e gerenciamento dos profissionais que atuam no centro obstétrico, com seus respectivos CRMs.

- **Filtro por data**:  
  Permite filtrar os procedimentos registrados por um período específico, facilitando a consulta e análise dos dados.

- **Edição e exclusão de procedimentos**:  
  Permite editar ou excluir registros de procedimentos, garantindo a atualização e correção das informações.

- **Exportação para PDF**:  
  Gera relatórios em formato PDF para compartilhamento e análise.

- **Autenticação de usuários**:  
  Sistema de login para acesso restrito a usuários autorizados.

---

## Benefícios

- **Organização e centralização dos dados**:  
  Armazena informações de forma estruturada, facilitando o acesso.
- **Eficiência na gestão de procedimentos**:  
  Agiliza registros e reduz burocracias.
- **Redução de erros**:  
  Minimiza falhas em registros manuais.
- **Análise e acompanhamento**:  
  Identifica tendências e gera relatórios detalhados.
- **Segurança das informações**:  
  Protege dados com autenticação e controle de acesso.

---

## Tecnologias utilizadas

- **Django**: Framework web para desenvolvimento rápido e escalável.
- **Django REST Framework**: Criação de APIs RESTful.
- **HTML, CSS e JavaScript**: Desenvolvimento da interface web.

---

## Observações

- O sistema foi projetado para o Centro Obstétrico da Maternidade Albert Sabin, mas é adaptável para outras instituições.
- Segurança é priorizada, com possibilidade de implementação de medidas adicionais.
- Novas funcionalidades podem ser incorporadas em atualizações futuras.

---

## Instalação e Configuração

Para configurar e executar o sistema localmente, siga os passos abaixo:

### 1. Pré-requisitos

Certifique-se de que as seguintes ferramentas estão instaladas:

- Python 3.8 ou superior: [Download Python](https://www.python.org/downloads/)
- Git: [Download Git](https://git-scm.com/downloads)

### 2. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 3. Criar e ativar o ambiente virtual

Crie o ambiente virtual:

```bash
python -m venv venv
```

Ative o ambiente virtual:

- **No Windows**:
```bash
venv\Scripts\activate
```
- **No macOS/Linux**:
```bash
source venv/bin/activate
```

### 4. Instalar as dependências

Com o ambiente virtual ativo, instale as dependências:

```bash
pip install -r requirements.txt
```

### 5. Configurar variáveis de ambiente

- Verifique se existe um arquivo `.env.example`.
- Caso exista, renomeie para `.env` e configure as variáveis necessárias (como `SECRET_KEY`, `DEBUG`, informações do banco de dados, etc).

### 6. Aplicar migrações

Crie as tabelas do banco de dados:

```bash
python manage.py migrate
```

### 7. Criar superusuário (opcional)

Para acessar o painel administrativo:

```bash
python manage.py createsuperuser
```
Siga as instruções no terminal.

### 8. Rodar o servidor de desenvolvimento

Inicie o servidor:

```bash
python manage.py runserver
```

Acesse via navegador:  
[http://127.0.0.1:8000](http://127.0.0.1:8000)

### 9. Executar testes (opcional)

```bash
python manage.py test
```

---

## Fontes e conteúdo relacionado

- [Documentação Django](https://docs.djangoproject.com/)
- [Documentação Django REST Framework](https://www.django-rest-framework.org/)

