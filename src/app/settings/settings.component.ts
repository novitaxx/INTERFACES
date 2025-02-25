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
  filesContent: any[] = [];

  settingsData = {
    nombre: '',
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
    this.SettingsService.getSettings().subscribe(
      (response: any) => {
        console.log('Datos obtenidos correctamente:', response);
        this.filesContent = response.files;
      },
      (error) => {
        console.error('Error al obtener los archivos', error);
      }
    );
  }

  onSubmit() {
    console.log('Formulario enviado:', this.settingsData);
    this.SettingsService.saveSettings(this.settingsData).subscribe(
      (response: any) => {
        console.log('Datos guardados correctamente:', response);
        alert('Configuración guardada correctamente');
        this.ngOnInit(); // Recargar los datos sin recargar la página
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

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  establecer(nombre: string) {
    for (let i = 0; i < this.filesContent.length; i++) {
      if (this.filesContent[i].nombre === nombre) {
        this.settingsData = this.filesContent[i];
        this.tipoPrincipal = this.settingsData.primaryFontName;
        this.tipoSecundaria = this.settingsData.secondaryFontName;
        break;
      }
    }
  }

  eliminar(nombre: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
      this.SettingsService.deleteFileByName(nombre).subscribe(
        (response: any) => {
          console.log('Archivo eliminado correctamente:', response);
          alert('Archivo eliminado correctamente');
          this.ngOnInit(); // Recargar los datos sin recargar la página
        },
        (error: any) => {
          console.error('Error al eliminar el archivo:', error);
          alert('Hubo un error al eliminar el archivo');
        }
      );
    }
  }
}
