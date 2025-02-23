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
  colorTexto = '#ffffff';
  colorFondo = '#d333b1';
  colorPrimario = '#6f00ff';
  colorSecundario = '#8f2299';
  tamaFuenteParrafos = '16';
  tamaFuenteTitulos = '32';
  tamaFuenteSubtitulos = '24';
  tipoPrincipal = '';
  tipoSecundaria = '';
}
