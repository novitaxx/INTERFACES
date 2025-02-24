import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CommonModule,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  showHeader = true;
  showSidebar = true;

  // Rutas donde no se mostrará el header
  private hideHeaderRoutes = ['/profile', '/settings'];

  // Rutas donde no se mostrará el sidebar
  private hideSidebarRoutes = ['/home', '/login'];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Verifica si la ruta actual está en la lista de rutas ocultas para el header
        this.showHeader = !this.hideHeaderRoutes.includes(event.url);

        // Verifica si la ruta actual está en la lista de rutas ocultas para el sidebar
        this.showSidebar = !this.hideSidebarRoutes.includes(event.url);
      }
    });
  }
}
