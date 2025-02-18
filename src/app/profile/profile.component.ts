import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../profile.service';
import * as L from 'leaflet'; // Importar Leaflet
import { OpenStreetMapProvider } from 'leaflet-geosearch'; // Importar Leaflet-Geosearch
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileData = {
    nombre: '',
    apellido: '',
    oficio: '',
    miPerfil: '',
    telefono: '',
    correo: '',
    paginaWeb: '',
    direccion: '',
    ciudad: '',
    estado: '',
    pais: '',
    experienciaLaboral: [
      { empresa: '', descripcion: '', anioInicio: '', anioCierre: '' },
    ],
    idiomas: '',
    competencias: '',
    nro_competencias: 0,
    formacionAcademica: [
      { universidad: '', carrera: '', anioInicio: '', anioCierre: '' },
    ],
    habilidades: '',
    fotoUrl: '',
    lat: 0,
    lng: 0,
  };

  map!: L.Map;
  marker!: L.Marker;
  provider = new OpenStreetMapProvider(); // Proveedor de búsqueda
  static profileData: any;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.initMap();
    this.imageEdit();
  }

  private initMap(): void {
    this.map = L.map('map').setView([10.237, -67.962], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    window.addEventListener('resize', () => {
      this.map.invalidateSize();
    });

    this.marker = L.marker([10.237, -67.962], {
      draggable: true,
    })
      .addTo(this.map)
      .bindPopup('Arrastra para seleccionar tu ubicación')
      .openPopup();

    this.marker.on('moveend', (event: any) => {
      const lat = event.target.getLatLng().lat;
      const lng = event.target.getLatLng().lng;
      this.profileData.lat = lat;
      this.profileData.lng = lng;
      this.reverseGeocode(lat, lng); // Obtener ciudad, estado y país
    });

    this.addSearchControl();
  }

  private imageEdit() {
    // (B) IMAGE + TEXT + CANVAS
    var img = new Image(),
      txt = 'PIZZA!',
      canvas: any = document.getElementById('demo'),
      ctx = canvas.getContext('2d');

    // (C) WRITE TEXT ON IMAGE
    img.onload = () => {
      // (C1) SOURCE IMAGE
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

      // (C2) ADD TEXT
      ctx.font = 'bold 50px Arial';
      ctx.fillStyle = 'rgb(0, 0, 0)';

      ctx.fillText(txt, 270, 370);
    };

    // (D) GO!
    img.src = '/perfil.png';
  }

  private async addSearchControl() {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Buscar ubicación...';
    input.style.position = 'absolute';
    input.style.top = '10px';
    input.style.left = '10px';
    input.style.zIndex = '1000';
    input.style.padding = '5px';
    input.style.border = '1px solid #ccc';

    document.getElementById('map')?.appendChild(input);

    input.addEventListener('change', async () => {
      const results = await this.provider.search({ query: input.value });
      if (results.length > 0) {
        const { x, y, label } = results[0];
        this.map.setView([y, x], 13);
        this.marker.setLatLng([y, x]);
        this.profileData.lat = y;
        this.profileData.lng = x;
        this.profileData.direccion = label; // Actualizar dirección con el nombre del lugar
        this.reverseGeocode(y, x); // Obtener ciudad, estado y país
      }
    });
  }

  // Función para obtener Ciudad, Estado y País desde las coordenadas
  private async reverseGeocode(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Imprimir la respuesta para ver qué propiedades se devuelven
      console.log('Respuesta de Nominatim:', data);

      this.profileData.direccion = data.display_name || ''; // Dirección completa

      this.profileData.ciudad =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.municipality ||
        data.address.county ||
        data.address.locality ||
        data.address.city_district ||
        '';

      this.profileData.estado =
        data.address.state ||
        data.address.state_district ||
        data.address.region ||
        data.address.province ||
        '';

      this.profileData.pais = data.address.country || '';

      console.log('Ubicación obtenida:', this.profileData);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  }

  // Métodos del formulario

  slider() {
    var slider: any = document.getElementById('myRange');
    var output: any = document.getElementById('demo');

    output.innerHTML = slider.value;
    this.profileData.nro_competencias = slider.value;
  }

  onSubmit() {
    console.log('Formulario enviado:', this.profileData);
    this.profileService.saveProfile(this.profileData).subscribe(
      (response) => {
        console.log('Datos guardados correctamente:', response);
        alert('Perfil guardado correctamente');
      },
      (error) => {
        console.error('Error al guardar los datos:', error);
        alert('Hubo un error al guardar los datos');
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileData.fotoUrl = e.target.result; // Guarda la URL de la imagen en base64
      };
      reader.readAsDataURL(file);
    }
  }

  async generarPdf() {
    // VALIDACIÓN: Verificar que los campos obligatorios estén completos
    if (
      !this.profileData.nombre ||
      !this.profileData.apellido ||
      !this.profileData.correo ||
      !this.profileData.telefono
    ) {
      alert(
        'Por favor, complete todos los campos obligatorios (nombre, apellido, correo y teléfono) antes de generar el PDF.'
      );
      return; // No continúa con la generación del PDF
    }

    console.log('Generando PDF...');

    const url = '/perfil.pdf';
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    const pngUrl = this.profileData.fotoUrl;
    const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(pngImageBytes);
    const pngDims = pngImage.scale(0.2);

    firstPage.drawImage(pngImage, {
      x: 110,
      y: height / 2 + 510,
      width: pngDims.width,
      height: pngDims.height,
    });

    // Nombre
    firstPage.drawText(
      this.profileData.nombre + ' ' + this.profileData.apellido,
      {
        x: 550,
        y: height / 2 + 600,
        size: 80,
        font: helveticaFont,
        color: rgb(1, 1, 1),
      }
    );

    // Oficio
    firstPage.drawText(this.profileData.oficio, {
      x: 550,
      y: height / 2 + 530,
      size: 30,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1),
    });

    // Perfil
    firstPage.drawText(this.profileData.miPerfil, {
      x: 60,
      y: height / 2 + 350,
      size: 20,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });

    // Teléfono
    firstPage.drawText(this.profileData.telefono.toString(), {
      x: 850,
      y: height / 2 + 400,
      size: 20,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });

    // Correo
    firstPage.drawText(this.profileData.correo, {
      x: 850,
      y: height / 2 + 360,
      size: 20,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });

    // Página web
    firstPage.drawText(this.profileData.paginaWeb, {
      x: 850,
      y: height / 2 + 310,
      size: 20,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });

    // Dirección
    firstPage.drawText(this.profileData.direccion, {
      x: 850,
      y: height / 2 + 260,
      size: 20,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });

    var h = 90;
    // Experiencia laboral
    this.profileData.experienciaLaboral.forEach((element) => {
      // Empresa
      firstPage.drawText(element.empresa, {
        x: 150,
        y: height / 2 + h,
        size: 20,
        maxWidth: 100,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(element.descripcion, {
        x: 150,
        y: height / 2 + h - 40,
        size: 20,
        maxWidth: 100,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(element.anioInicio.toString() + '-', {
        x: 600,
        y: height / 2 + h,
        size: 20,
        maxWidth: 100,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(element.anioCierre.toString(), {
        x: 680,
        y: height / 2 + h,
        size: 20,
        maxWidth: 100,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      h = h - 100;
    });

    var h = 0;
    this.profileData.formacionAcademica.forEach((element) => {
      // Universidad
      firstPage.drawText(element.universidad, {
        x: 150,
        y: height / 5 + h,
        size: 20,
        maxWidth: 100,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(element.carrera, {
        x: 150,
        y: height / 5 + h - 30,
        size: 20,
        maxWidth: 100,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(element.anioInicio.toString() + '-', {
        x: 600,
        y: height / 5 + h,
        size: 20,
        maxWidth: 100,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(element.anioCierre.toString(), {
        x: 680,
        y: height / 5 + h,
        size: 20,
        maxWidth: 100,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      h = h - 100;
    });

    // Idiomas
    firstPage.drawText(this.profileData.idiomas, {
      x: 850,
      y: height / 2 + 90,
      size: 20,
      maxWidth: 100,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    // Competencias
    firstPage.drawText(this.profileData.competencias, {
      x: 850,
      y: height / 2 - 60,
      size: 20,
      maxWidth: 100,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    // Habilidades
    firstPage.drawText(this.profileData.habilidades, {
      x: 850,
      y: height / 5,
      size: 20,
      maxWidth: 100,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    // Create a Blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modified_perfil.pdf'; // Set the desired file name

    // Append to the body (required for Firefox)
    document.body.appendChild(link);

    // Trigger the download by simulating a click
    link.click();

    // Clean up and remove the link
    document.body.removeChild(link);
  }

  addExperience() {
    this.profileData.experienciaLaboral.push({
      empresa: '',
      descripcion: '',
      anioInicio: '',
      anioCierre: '',
    });
  }

  removeExperience(index: number) {
    this.profileData.experienciaLaboral.splice(index, 1);
  }

  addEducation() {
    this.profileData.formacionAcademica.push({
      universidad: '',
      carrera: '',
      anioInicio: '',
      anioCierre: '',
    });
  }

  removeEducation(index: number) {
    this.profileData.formacionAcademica.splice(index, 1);
  }

  // Método onlyText para prevenir la entrada de números
  onlyText(event: KeyboardEvent) {
    const char = String.fromCharCode(event.which);
    if (/\d/.test(char)) {
      event.preventDefault();
    }
  }
}
