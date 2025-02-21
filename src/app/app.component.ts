import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SettingsComponent } from './settings/settings.component';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    CommonModule,
    SidebarComponent,
    SettingsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  showHeader = true;
  showSidebar = true;

  // Rutas donde no se mostrará el header
  private hideHeaderRoutes = ['/profile'];

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
