import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { UploadService } from '../../../shared/services/upload.service';
import { CarreraService } from '../../../shared/services/carrera.service';
import { CalidadService } from '../../../shared/services/calidad.service';
import { FacultadService } from '../../../shared/services/facultad.service';

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
    TableModule,
    TabsModule,
    ToggleSwitch,
  ],
  templateUrl: './cargar-indicadores.component.html',
  styleUrl: './cargar-indicadores.component.css',
})
export class CargarIndicadoresComponent implements OnInit {
  private uploadService = inject(UploadService);
  private carreraService = inject(CarreraService);
  private calidadService = inject(CalidadService);
  private facultadService = inject(FacultadService);

  // Upload state
  tipoCarga = signal<'academicos' | 'calidad'>('academicos');
  selectedFile = signal<File | null>(null);
  isUploading = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  isDragOver = signal<boolean>(false);

  // Management state
  careersList = signal<any[]>([]);
  selectedCareer = signal<any>(null);
  academicPeriods = signal<any[]>([]);
  qualityIndicators = signal<any[]>([]);
  isLoadingManagement = signal<boolean>(false);
  managementMessage = signal<{ type: 'success' | 'error', text: string } | null>(null);

  ngOnInit(): void {
    this.loadCareers();
  }

  async loadCareers(): Promise<void> {
    try {
      const res = await this.facultadService.getAll();
      if (res && res.data) {
        const flatCareers = res.data.flatMap((fac: any) => 
          fac.items.map((item: any) => ({
            name: item.carrera,
            code: item.codigoCarrera
          }))
        );
        this.careersList.set(flatCareers);
        if (flatCareers.length > 0) {
          this.selectedCareer.set(flatCareers[0]);
          this.loadCareerData(flatCareers[0].code);
        }
      }
    } catch (err) {
      console.error('Error loading careers:', err);
    }
  }

  async loadCareerData(careerCode: string): Promise<void> {
    if (!careerCode) return;
    this.isLoadingManagement.set(true);
    this.managementMessage.set(null);
    try {
      // Load Academic
      const resAcad = await this.carreraService.getById(careerCode);
      if (resAcad && resAcad.data && resAcad.data[0]) {
        // Mapping each period row
        this.academicPeriods.set(resAcad.data[0].tabla.map((row: any) => ({
          ...row,
          estadoBool: row.estado === 1
        })));
      }

      // Load Quality
      const resQual = await this.calidadService.getAll(careerCode);
      if (resQual && resQual.data) {
        this.qualityIndicators.set(resQual.data.map((ind: any) => ({
          ...ind,
          estadoBool: ind.estado === 1,
          periodos: ind.periodos.map((p: any) => ({
            ...p,
            editingVal: p.valor
          }))
        })));
      }
    } catch (err) {
      console.error('Error loading career data:', err);
      this.managementMessage.set({ type: 'error', text: 'Error al cargar los datos de la carrera.' });
    } finally {
      this.isLoadingManagement.set(false);
    }
  }

  onCareerChange(event: any): void {
    if (event.value) {
      this.loadCareerData(event.value.code);
    }
  }

  async saveAcademicRow(row: any): Promise<void> {
    try {
      this.managementMessage.set(null);
      const estadoNum = row.estadoBool ? 1 : 0;
      await this.carreraService.updateAcademico(
        row.codigoCarrera,
        row.codigoPeriodo,
        Number(row.valorRetencion),
        Number(row.valorDesercion),
        Number(row.ValorTitulacion),
        estadoNum
      );
      this.managementMessage.set({ type: 'success', text: `Periodo ${row.codigoPeriodo} actualizado con éxito.` });
      // Reload career data to ensure sync
      this.loadCareerData(this.selectedCareer().code);
    } catch (err: any) {
      console.error(err);
      this.managementMessage.set({ type: 'error', text: err.message || 'Error al guardar cambios del periodo académico.' });
    }
  }

  async toggleQualityState(indicator: any): Promise<void> {
    try {
      this.managementMessage.set(null);
      const newStatus = indicator.estadoBool ? 1 : 0;
      await this.calidadService.updateEstado(indicator.idIndicador, this.selectedCareer().code, newStatus);
      this.managementMessage.set({ 
        type: 'success', 
        text: `Estado del indicador "${indicator.titulo}" actualizado para esta carrera.` 
      });
    } catch (err: any) {
      console.error(err);
      this.managementMessage.set({ type: 'error', text: err.message || 'Error al actualizar el estado del indicador.' });
      // Revert status on failure
      indicator.estadoBool = !indicator.estadoBool;
    }
  }

  async saveQualityValue(indicator: any, period: any): Promise<void> {
    try {
      this.managementMessage.set(null);
      const parsedVal = period.editingVal === null || period.editingVal === undefined || String(period.editingVal).trim() === '' ? null : Number(period.editingVal);
      await this.calidadService.updateValor(period.idValor, parsedVal);
      period.valor = parsedVal;
      this.managementMessage.set({ type: 'success', text: `Valor para el periodo ${period.nombrePeriodo} guardado con éxito.` });
    } catch (err: any) {
      console.error(err);
      this.managementMessage.set({ type: 'error', text: err.message || 'Error al actualizar el valor del periodo.' });
    }
  }

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
        this.successMessage.set(result.message || 'Indicadores académicos cargados exitosamente.');
      } else {
        const result = await this.uploadService.uploadIndicadoresCalidad(file);
        this.successMessage.set(result.message || 'Indicadores de calidad cargados exitosamente.');
      }

      this.selectedFile.set(null);
      // Reload career data if any career was active
      if (this.selectedCareer()) {
        this.loadCareerData(this.selectedCareer().code);
      }
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
