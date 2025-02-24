import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  settingsData = {
    colorTexto: '#ffffff',
    colorFondo: '#d333b1',
    colorPrimario: '#6f00ff',
    colorSecundario: '#8f2299',
    tamaFuenteParrafos: '16',
    tamaFuenteTitulos: '32',
    tamaFuenteSubtitulos: '24',
    tipoPrincipal: '',
    tipoSecundaria: '',

    primaryFontFile: null as File | null,
    secondaryFontFile: null as File | null,
    primaryFontName: '',
    secondaryFontName: '',
    fontName: '',
  };

  constructor(private SettingsService: SettingsService) {}

  primaryFontFile!: File;
  primaryFontName!: string;
  secondaryFontFile!: File;
  secondaryFontName!: string;
  fontName: any;

  ngOnInit(): void {
    this.SettingsService.getSettings().subscribe((response: any) => {
      console.log('Datos obtenidos correctamente:', response);
      this.settingsData = response;
    });
  }

  onSubmit() {
    console.log('Formulario enviado:', this.settingsData);
    this.SettingsService.saveSettings(this.settingsData).subscribe(
      (response: any) => {
        console.log('Datos guardados correctamente:', response);
        alert('Perfil guardado correctamente');
      },
      (error: any) => {
        console.error('Error al guardar los datos:', error);
        alert('Hubo un error al guardar los datos');
      }
    );
  }

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
