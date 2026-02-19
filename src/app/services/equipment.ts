import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Equipment, CreateEquipmentDto } from './equipment.interface';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private apiUrl = `${environment.apiUrl}/equipments`;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      this.toastService.show(`Error ${operation}.`, 'error');
      console.error(`Error during ${operation}:`, error.error);
      return throwError(() => error);
    };
  }

  getAll(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.apiUrl).pipe(
      catchError(this.handleError('fetching equipment list'))
    );
  }

  getById(id: string): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError(`fetching equipment with id=${id}`))
    );
  }

  update(
    id: string,
    equipmentData: CreateEquipmentDto,
    imageFile?: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('code', equipmentData.code);
    formData.append('name', equipmentData.name);
    formData.append('categoryId', equipmentData.categoryId.toString());
    formData.append('stock', equipmentData.stock.toString());
    if (imageFile) {
      formData.append('imageFile', imageFile, imageFile.name);
    }
    return this.http.put(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(this.handleError('updating equipment'))
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError('deleting equipment'))
    );
  }

  create(
    equipmentData: CreateEquipmentDto,
    imageFile?: File
  ): Observable<Equipment> {
    const formData = new FormData();
    formData.append('code', equipmentData.code);
    formData.append('name', equipmentData.name);
    formData.append('categoryId', equipmentData.categoryId.toString());
    formData.append('stock', equipmentData.stock.toString());
    if (imageFile) {
      formData.append('imageFile', imageFile, imageFile.name);
    }
    return this.http.post<Equipment>(this.apiUrl, formData).pipe(
      catchError(this.handleError('creating equipment'))
    );
  }
}
