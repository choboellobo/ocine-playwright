const { chromium } = require('playwright');

class OcineScraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.url = 'https://www.ocinerioshopping.es/';
  }

  async initialize() {
    console.log('🚀 Iniciando navegador...');
    this.browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Configurar viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });
    
    // Configurar headers para parecer más humano
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
  }

  async navigateToSite() {
    console.log('🌐 Navegando a Ocine Río Shopping...');
    await this.page.goto(this.url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await this.page.waitForSelector('#filmContainer', {
      timeout: 10000,
      state: 'visible'
    });
  }

  async getMoviesFromCartelera() {
    console.log('🎬 Extrayendo películas de la cartelera...');
    
    try {
      // Obtener todas las películas de la cartelera
      const movies = await this.page.evaluate(() => {
        const movieElements = document.querySelectorAll('#filmContainer > div');
        const moviesList = [];
        
        movieElements.forEach((element) => {
          debugger;
          try {
            // Buscar el título de la película
            const titleElement = element.querySelector('h4');
            if (!titleElement) return;
            
            const title = titleElement.textContent.trim();
            
            // Buscar imagen del póster
            const imgElement = element.querySelector('img');
            const posterUrl = imgElement ? imgElement.src : null;
            
            // Buscar horarios del día de hoy
            const scheduleTable = element.querySelector('table');
            console.log('scheduleTable', scheduleTable);
            let todaySchedule = [];
            scheduleTable.querySelectorAll('tr.plans .horasessio button')
            .forEach((button) => {
              const time = button.textContent.trim();
              if (time) {
                todaySchedule.push(time);
              }
            });
            
            
            // Buscar enlaces de trailer e info
            const trailerLink = element.querySelector('a[href*="youtube.com"]')?.href || null;
            const infoLink = element.querySelector('a[href*="film-"]')?.href || null;
            
            // Verificar si no hay sesiones hoy
            const noSessionsText = element.querySelector('p');
            const hasNoSessions = noSessionsText && noSessionsText.textContent.includes('No hay sesiones hoy');
            
            moviesList.push({
              title,
              posterUrl,
              schedule: hasNoSessions ? [] : todaySchedule,
              trailerUrl: trailerLink,
              infoUrl: infoLink ? infoLink : null,
              hasSessionsToday: !hasNoSessions,
              scrapedAt: new Date().toISOString()
            });
            
          } catch (error) {
            console.error('Error procesando película:', error);
          }
        });
        
        return moviesList;
      });
      
      return movies.filter(movie => movie.title); // Filtrar elementos vacíos
      
    } catch (error) {
      console.error('❌ Error al extraer películas:', error);
      throw error;
    }
  }

  async getMoviesWithSessionsToday() {
    const allMovies = await this.getMoviesFromCartelera();
    return allMovies.filter(movie => movie.hasSessionsToday && movie.schedule.length > 0);
  }

  formatMoviesOutput(movies) {
    console.log('🎭 CARTELERA DE HOY - OCINE RÍO SHOPPING');
    console.log('=' .repeat(50));
    console.log(`📅 Fecha: ${new Date().toLocaleDateString('es-ES')}`);
    console.log(`🎬 Películas disponibles: ${movies.length}`);
    console.log('=' .repeat(50));
    
    if (movies.length === 0) {
      console.log('😔 No se encontraron películas con sesiones para hoy');
      return;
    }

    movies.forEach((movie, index) => {
      console.log(`🎬 ${movie.title}`);
      
      if (movie.hasSessionsToday && movie.schedule.length > 0) {
        console.log(`   🕐 Horarios: ${movie.schedule.join(', ')}`);
      } else {
        console.log(`   ❌ Sin sesiones hoy`);
      }
      
      if (movie.trailerUrl) {
        console.log(`   🎥 Trailer: ${movie.trailerUrl}`);
      }
      
      if (movie.infoUrl) {
        console.log(`   ℹ️  Más info: ${movie.infoUrl}`);
      }
      
      console.log(`   📸 Póster: ${movie.posterUrl || 'No disponible'}`);
    });
    
    console.log('=' .repeat(50));
    console.log(`✅ Scraping completado a las ${new Date().toLocaleTimeString('es-ES')}`);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Navegador cerrado');
    }
  }

  async scrapeMovies() {
    try {
      await this.initialize();
      await this.navigateToSite();
      
      const movies = await this.getMoviesFromCartelera();
      this.formatMoviesOutput(movies);
      
      // También devolver solo las que tienen sesiones hoy
      const moviesWithSessions = movies.filter(m => m.hasSessionsToday);
      
      return {
        allMovies: movies,
        moviesWithSessionsToday: moviesWithSessions,
        totalMovies: movies.length,
        moviesWithSessions: moviesWithSessions.length
      };
      
    } catch (error) {
      console.error('❌ Error durante el scraping:', error);
      throw error;
    } finally {
      await this.close();
    }
  }
}

// Función principal
async function main() {

  return new Promise( async (resolve, reject) => {

     const scraper = new OcineScraper();

      try {
        const result = await scraper.scrapeMovies();
        console.log( result )
        resolve(result);
        
      } catch (error) {
        console.error('💥 Error en la aplicación:', error);
        process.exit(1);
      }

  })
 
}


module.exports = {main};
