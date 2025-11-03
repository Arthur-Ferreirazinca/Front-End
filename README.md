# Front-End
🔫 Sport Gun Imports - Loja de Armas Online
https://img.shields.io/badge/status-em%2520desenvolvimento-yellow
https://img.shields.io/badge/HTML-5-orange
https://img.shields.io/badge/CSS-3-blue
https://img.shields.io/badge/JavaScript-ES6-yellow

📖 Sobre o Projeto
Site e-commerce especializado em venda de armas, equipamentos e acessórios para Caçadores, Atiradores e Colecionadores (CAC). A plataforma oferece uma experiência moderna e segura para compra de armamentos nacionais e importados.

🎯 Características Principais
Design Moderno: Interface dark theme com cores vermelhas

Carrossel Interativo: Apresentação dinâmica de produtos

Notícias em Tempo Real: Integração com feeds RSS especializados

Layout Responsivo: Adaptável para todos os dispositivos

Navegação Suave: Scroll animado e experiência fluída

🛠 Tecnologias Utilizadas
Frontend: HTML5, CSS3, JavaScript (ES6+)

Design System: CSS Variables para consistência visual

Ícones: Font Awesome 6.0

Fontes: Inter (sistema)

API Externa: RSS2JSON para notícias

🚀 Funcionalidades
✨ Principais Módulos
🎠 Hero Carousel

Slideshow automático com controles manuais

Animações suaves de transição

Indicadores visuais de progresso

🛍️ Catálogo de Produtos

Grid responsivo de armas

Filtros por categoria e especificações

Sistema de avaliações e badges

📰 Seção de Notícias

Integração com InfoArmas e Portal 27

Atualização automática a cada 10 minutos

Fallback para conteúdo padrão

📱 Navegação Mobile

Menu hamburger responsivo

Gestos touch para carrossel

Layout otimizado para mobile

📁 Estrutura do Projeto
text
sport-gun-imports/
├── index.html              # Página principal
├── css/
│   ├── variables.css       # Variáveis CSS e tema
│   ├── style.css           # Estilos principais
│   └── responsive.css      # Media queries
├── js/
│   └── script.js           # JavaScript principal
├── Imagens/                # Assets visuais
│   ├── Logo.png
│   ├── f-9 brigade.jpg
│   └── ...
└── README.md
🎨 Design System
🎯 Cores
css
--primary-color: #DC2626;    /* Vermelho principal */
--secondary-color: #000000;  /* Preto */
--background: #0A0A0A;       /* Fundo escuro */
--text-primary: #FFFFFF;     /* Texto branco */
📐 Tipografia
Fonte Principal: Inter

Hierarquia: xs, sm, base, lg, xl, 2xl, 3xl, 4xl

🎪 Componentes
Botones com hover effects

Cards com sombras e bordas

Sistema de badges e indicadores

⚙️ Instalação e Configuração
Pré-requisitos
Navegador moderno (Chrome, Firefox, Safari)

Servidor local (recomendado)

🚀 Como Executar
Clone o repositório

bash
git clone https://github.com/seu-usuario/sport-gun-imports.git
cd sport-gun-imports
Servidor Local (Recomendado)

bash
# Com Python
python -m http.server 8000

# Com Node.js
npx http-server

# Com PHP
php -S localhost:8000
Acesse no navegador

text
http://localhost:8000
📱 Responsividade
O site é totalmente responsivo com breakpoints para:

📱 Mobile: < 768px

💻 Tablet: 768px - 1024px

🖥️ Desktop: > 1024px

🔌 APIs e Integrações
📰 Sistema de Notícias
Fontes: InfoArmas, Portal 27

Tecnologia: RSS2JSON (gratuito)

Fallback: Conteúdo estático

Atualização: 10 minutos

javascript
// Exemplo de configuração
const newsSources = [
    { url: 'https://infoarmas.com.br/feed/', name: 'InfoArmas' },
    { url: 'https://www.portal27.com.br/feed/', name: 'Portal 27' }
];
🎯 Próximas Implementações
Sistema de carrinho de compras

Integração com gateway de pagamento

Área do cliente

Sistema de busca avançada

Filtros por marca e calibre

Modo offline para notícias

PWA (Progressive Web App)

🤝 Contribuição
Contribuições são bem-vindas! Para contribuir:

Fork o projeto

Crie uma branch: git checkout -b feature/nova-feature

Commit suas mudanças: git commit -m 'Adiciona nova feature'

Push para a branch: git push origin feature/nova-feature

Abra um Pull Request

⚠️ Considerações Legais
Este projeto é desenvolvido para:

✅ Caçadores, Atiradores e Colecionadores registrados

✅ Lojas autorizadas pelo Exército Brasileiro

✅ Finalidade educacional e demonstrativa

É necessário possuir CR (Certificado de Registro) válido para aquisição de armas.

📄 Licença
Este projeto está sob licença MIT. Veja o arquivo LICENSE para detalhes.

👥 Desenvolvedor Onwer

GitHub: @Tyminsk

Email: vtyminskiwii2@gmail.com

🔗 Links Úteis
Exército Brasileiro - Portal CAC

InfoArmas

Portal 27

