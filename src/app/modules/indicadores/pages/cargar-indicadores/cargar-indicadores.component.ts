import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UploadService } from '../../../shared/services/upload.service';

@Component({
  selector: 'app-cargar-indicadores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    SelectModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './cargar-indicadores.component.html',
  styleUrl: './cargar-indicadores.component.css',
})
export class CargarIndicadoresComponent {
  private uploadService = inject(UploadService);

  tipoCarga = signal<'academicos' | 'calidad'>('academicos');
  selectedFile = signal<File | null>(null);
  isUploading = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  isDragOver = signal<boolean>(false);

  setTipoCarga(tipo: 'academicos' | 'calidad'): void {
    this.tipoCarga.set(tipo);
    this.resetState();
  }

  resetState(): void {
    this.selectedFile.set(null);
    this.isUploading.set(false);
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.isDragOver.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.validateAndSetFile(event.dataTransfer.files[0]);
    }
  }

  validateAndSetFile(file: File): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const isExcel =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.name.toLowerCase().endsWith('.xlsx');

    if (!isExcel) {
      this.errorMessage.set('Solo se permiten archivos en formato Excel (.xlsx)');
      this.selectedFile.set(null);
      return;
    }

    this.selectedFile.set(file);
  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  async processUpload(): Promise<void> {
    const file = this.selectedFile();
    if (!file) {
      this.errorMessage.set('Por favor seleccione un archivo Excel (.xlsx)');
      return;
    }

    this.isUploading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    try {
      if (this.tipoCarga() === 'academicos') {
        const result = await this.uploadService.uploadIndicadoresGenerales(file);
        this.successMessage.set(result.message || 'Indicadores académicos cargados exitosamente en la base de datos.');
      } else {
        const result = await this.uploadService.uploadIndicadoresCalidad(file);
        this.successMessage.set(result.message || 'Indicadores de calidad cargados exitosamente en la base de datos.');
      }

      this.selectedFile.set(null);
    } catch (err: any) {
      console.error('Error en la carga masiva:', err);
      this.errorMessage.set(err.message || 'Ocurrió un error al procesar el archivo Excel.');
    } finally {
      this.isUploading.set(false);
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
