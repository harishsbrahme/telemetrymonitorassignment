import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<string>('light');

  constructor() {
    let saved = 'light';
    try {
      saved = localStorage.getItem('theme') || 'light';
    } catch (e) {}
    this.setTheme(saved);
  }

  setTheme(name: string) {
    this.theme.set(name);
    document.documentElement.setAttribute('data-theme', name);
    try {
      localStorage.setItem('theme', name);
    } catch (e) {}
  }

  toggle() {
    this.setTheme(this.theme() === 'light' ? 'dark' : 'light');
  }
}
