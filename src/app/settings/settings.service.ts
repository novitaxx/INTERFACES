// profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  saveSettings(settingsData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/saveSettings`, settingsData);
  }

  getSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getSettings`);
  }
}
