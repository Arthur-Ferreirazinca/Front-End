// Mobile Navigation
const hamburger = document.querySelector('.nav__hamburger');
const navMenu = document.querySelector('.nav__menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on links
document.querySelectorAll('.nav__menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(220, 38, 38, 0.1)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
});

// ==================== CARROSSEL ====================
class Carousel {
    constructor() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.showSlide(0);
        this.startAutoPlay();
        
        const carouselContainer = document.querySelector('.hero-carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
            carouselContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));
        
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        let next = this.currentSlide + 1;
        if (next >= this.slides.length) next = 0;
        this.showSlide(next);
    }
    
    prevSlide() {
        let prev = this.currentSlide - 1;
        if (prev < 0) prev = this.slides.length - 1;
        this.showSlide(prev);
    }
    
    goToSlide(index) {
        this.showSlide(index);
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ==================== NOTÍCIAS SOBRE ARMAS E CAC ====================

async function loadNews() {
    const newsGrid = document.querySelector('.news__grid');
    
    if (!newsGrid) {
        console.error('❌ Elemento .news__grid não encontrado no HTML');
        return;
    }
    
    // Mostrar loading
    newsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
            <p style="color: var(--text-secondary); font-size: 1.2rem;">
                <i class="fas fa-spinner fa-spin"></i> Carregando notícias sobre armas...
            </p>
        </div>
    `;
    
    console.log('📰 Iniciando busca de notícias sobre armas e CAC...');
    
    try {
        let allArticles = [];
        
        // Buscar de múltiplas fontes
        const sources = [
            { url: 'https://g1.globo.com/rss/g1/', name: 'G1' },
            { url: 'https://rss.uol.com.br/feed/noticias.xml', name: 'UOL' },
            { url: 'https://noticias.r7.com/feed.xml', name: 'R7' }
        ];
        
        for (const source of sources) {
            const articles = await fetchRSSNews(source.url, source.name);
            if (articles) {
                allArticles = allArticles.concat(articles);
            }
        }
        
        console.log(`📊 Total de notícias coletadas: ${allArticles.length}`);
        
        // FILTRAR apenas notícias sobre armas, CAC, tiro, segurança
        const filteredArticles = filterWeaponNews(allArticles);
        
        console.log(`🎯 Notícias filtradas sobre armas: ${filteredArticles.length}`);
        
        // Mostrar notícias filtradas ou fallback
        if (filteredArticles && filteredArticles.length > 0) {
            displayNews(filteredArticles.slice(0, 3));
        } else {
            console.log('⚠️ Nenhuma notícia sobre armas encontrada, usando notícias padrão');
            showDefaultNews();
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar notícias:', error);
        showDefaultNews();
    }
}

// Filtrar notícias relacionadas a armas, CAC, tiro esportivo, etc
function filterWeaponNews(articles) {
    // Palavras-chave para buscar
    const keywords = [
        'pistola', 'revólver', 'rifle', 'espingarda', 'fuzil',
        'cac', 'caçador', 'atirador', 'colecionador',
        'tiro esportivo', 'tiro ao alvo',
        'munição', 'calibre',
        'exército',,
        'defesa pessoal', 'porte de arma',
        'desarmamento', 'estatuto do desarmamento',
        'glock', 'taurus', 'imbel',
        'disparo',
    ];
    
    return articles.filter(article => {
        const title = article.title.toLowerCase();
        const description = article.description.toLowerCase();
        const content = title + ' ' + description;
        
        // Verificar se contém alguma palavra-chave
        const hasKeyword = keywords.some(keyword => content.includes(keyword));
        
        if (hasKeyword) {
            console.log(`✅ Notícia relevante encontrada: ${article.title}`);
        }
        
        return hasKeyword;
    });
}

// Buscar notícias via RSS2JSON (serviço gratuito, sem API key!)
async function fetchRSSNews(rssUrl, sourceName) {
    try {
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        
        console.log(`🔄 Buscando de ${sourceName}...`);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            console.error(`❌ Erro HTTP ${response.status} ao buscar ${sourceName}`);
            return null;
        }
        
        const data = await response.json();
        
        console.log(`📊 Resposta de ${sourceName}:`, data);
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
            console.log(`✅ ${data.items.length} itens encontrados em ${sourceName}`);
            
            return data.items.map(item => {
                // Limpar HTML da descrição
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = item.description || '';
                const cleanDescription = tempDiv.textContent || tempDiv.innerText || '';
                
                return {
                    title: item.title,
                    description: cleanDescription.substring(0, 150) + '...',
                    url: item.link,
                    urlToImage: item.thumbnail || item.enclosure?.link || null,
                    publishedAt: item.pubDate,
                    source: { name: sourceName }
                };
            });
        } else {
            console.error(`❌ ${sourceName} não retornou itens válidos`);
            return null;
        }
        
    } catch (error) {
        console.error(`❌ Erro ao buscar ${sourceName}:`, error);
        return null;
    }
}

function displayNews(articles) {
    const newsGrid = document.querySelector('.news__grid');
    
    console.log('🎨 Renderizando notícias na tela...');
    
    newsGrid.innerHTML = articles.map((article, index) => {
        // Formatar data
        const date = new Date(article.publishedAt);
        const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        
        // Imagem com fallback
        const imageUrl = article.urlToImage || `https://via.placeholder.com/400x250/1F1F1F/DC2626?text=Notícia+${index + 1}`;
        
        return `
            <div class="news__card">
                <div class="news__image">
                    <img src="${imageUrl}" 
                         alt="${article.title}"
                         onerror="this.src='https://via.placeholder.com/400x250/1F1F1F/DC2626?text=Sport+Gun+Imports'"
                         loading="lazy">
                </div>
                <div class="news__content">
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <div class="news__meta">
                        <span class="author">Por ${article.source.name}</span>
                        <span class="date">${formattedDate}</span>
                    </div>
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more">
                        Ler mais <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('✅ Notícias renderizadas com sucesso!');
}

function showDefaultNews() {
    const newsGrid = document.querySelector('.news__grid');
    
    console.log('📄 Mostrando notícias padrão...');
    
    newsGrid.innerHTML = `
        <div class="news__card">
            <div class="news__image">
                <img src="https://via.placeholder.com/400x250/1F1F1F/DC2626?text=Sport+Gun" 
                     alt="Mercado de Armas">
            </div>
            <div class="news__content">
                <h3>Crescimento do Mercado de Armas no Brasil</h3>
                <p>O mercado brasileiro de armas de fogo registrou crescimento significativo nos últimos anos, com aumento na procura por equipamentos de defesa pessoal e tiro esportivo...</p>
                <div class="news__meta">
                    <span class="author">Por Sport Gun Imports</span>
                    <span class="date">1 Novembro, 2025</span>
                </div>
                <a href="#" class="read-more">Ler mais</a>
            </div>
        </div>

        <div class="news__card">
            <div class="news__image">
                <img src="https://via.placeholder.com/400x250/1F1F1F/DC2626?text=Tiro+Esportivo" 
                     alt="Tiro Esportivo">
            </div>
            <div class="news__content">
                <h3>Tiro Esportivo: Modalidade Cresce no País</h3>
                <p>Competições de tiro esportivo ganham destaque no Brasil, com aumento significativo no número de praticantes e clubes especializados em todo o território nacional...</p>
                <div class="news__meta">
                    <span class="author">Por Sport Gun Imports</span>
                    <span class="date">30 Outubro, 2025</span>
                </div>
                <a href="#" class="read-more">Ler mais</a>
            </div>
        </div>

        <div class="news__card">
            <div class="news__image">
                <img src="https://via.placeholder.com/400x250/1F1F1F/DC2626?text=Legislação+CAC" 
                     alt="Legislação">
            </div>
            <div class="news__content">
                <h3>Novas Regulamentações para CAC</h3>
                <p>Entenda as principais mudanças na legislação para Caçadores, Atiradores e Colecionadores, incluindo novos requisitos e procedimentos para registro...</p>
                <div class="news__meta">
                    <span class="author">Por Sport Gun Imports</span>
                    <span class="date">28 Outubro, 2025</span>
                </div>
                <a href="#" class="read-more">Ler mais</a>
            </div>
        </div>
    `;
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Página carregada! Inicializando componentes...');
    console.log('📍 URL atual:', window.location.href);
    
    // Verificar se está em servidor local
    if (window.location.protocol === 'file:') {
        console.warn('⚠️ ATENÇÃO: Você está abrindo o arquivo direto (file://). Use um servidor local!');
    } else {
        console.log('✅ Servidor local detectado');
    }
    
    // Inicializar carrossel
    const carousel = new Carousel();
    console.log('✅ Carrossel inicializado');
    
    // Carregar notícias
    loadNews();
    
    // Atualizar notícias a cada 10 minutos
    setInterval(() => {
        console.log('🔄 Atualizando notícias...');
        loadNews();
    }, 600000);
    
    console.log('✅ Todos os componentes inicializados!');
});