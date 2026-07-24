import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabsModule } from 'primeng/tabs';
import { UploadService } from '../../../shared/services/upload.service';

@Component({
  selector: 'app-c-upload-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    MessageModule,
    ProgressSpinnerModule,
    TabsModule,
  ],
  templateUrl: './c-upload-modal.component.html',
  styleUrl: './c-upload-modal.component.css',
})
export class CUploadModalComponent {
  private uploadService = inject(UploadService);

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() uploadCompleted = new EventEmitter<void>();

  tipoCarga = signal<'academicos' | 'calidad'>('academicos');
  selectedFile = signal<File | null>(null);
  isUploading = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  isDragOver = signal<boolean>(false);

  tiposCargaOptions = [
    { label: 'Indicadores Académicos (Generales)', value: 'academicos' },
    { label: 'Indicadores de Calidad', value: 'calidad' },
  ];

  onClose(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  resetForm(): void {
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
      file.name.endsWith('.xlsx');

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
        this.successMessage.set(result.message || 'Indicadores académicos cargados exitosamente.');
      } else {
        const result = await this.uploadService.uploadIndicadoresCalidad(file);
        this.successMessage.set(result.message || 'Indicadores de calidad cargados exitosamente.');
      }

      this.selectedFile.set(null);
      this.uploadCompleted.emit();
    } catch (err: any) {
      console.error('Error al subir archivo:', err);
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
