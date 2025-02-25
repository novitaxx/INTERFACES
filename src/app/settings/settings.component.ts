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
    primaryFontName: '',
    secondaryFontName: '',
  };

  tipoPrincipal = '';
  tipoSecundaria = '';
  primaryFontFile = null as File | null;
  secondaryFontFile = null as File | null;

  constructor(private SettingsService: SettingsService) {}

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
        alert('Configuración guardada correctamente');
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
        this.settingsData.primaryFontName = file.name.replace('.ttf', '');
      } else if (type === 'secondary') {
        this.secondaryFontFile = file;
        this.settingsData.secondaryFontName = file.name.replace('.ttf', '');
      }
    }
  }
}
