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

  primaryFontFile: File | null = null;
  secondaryFontFile: File | null = null;
  primaryFontName = '';
  secondaryFontName = '';
  fontName = '';

  onFileSelected(event: Event, type: 'primary' | 'secondary') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (type === 'primary') {
        this.primaryFontFile = file;
        this.primaryFontName = file.name.replace('.ttf', '');
      } else if (type === 'secondary') {
        this.secondaryFontFile = file;
        this.secondaryFontName = file.name.replace('.ttf', '');
      }
    }
    if (this.primaryFontFile) {
      this.fontName = this.primaryFontName;
    } else {
      this.fontName = this.secondaryFontName;
    }

  }
}
