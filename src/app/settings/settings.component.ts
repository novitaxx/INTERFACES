import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  colorTexto = '';
  colorFondo = '';
  colorPrimario = '';
  colorSecundario = '';
  tamaFuenteParrafos = '';
  tamaFuenteTitulos = '';
  tamaFuenteSubtitulos = '';
  tipoPrincipal = '';
  tipoSecundaria = '';
}
