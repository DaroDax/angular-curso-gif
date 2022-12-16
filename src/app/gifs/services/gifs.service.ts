import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGIFResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] = [];
  private apiKey: string = '8EvzGn4bnJBt0clELOmnieCjJuKkJzdO';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';

  //TODO: cambiar any
  public resultados: Gif[] = [];

  get historial(){
    return[...this._historial];
  }

  //El constructor solo se ejecuta una vez
  constructor( private http: HttpClient ) {
    
    this._historial = JSON.parse( localStorage.getItem('historial')! ) || [];
    this.resultados = JSON.parse( localStorage.getItem('resultados')! ) || [];

  }

  buscarGifs( query: string = "") {
    //Verifica q no tenga espacios en blanco y llegue siempre en minusculas
    query = query.trim().toLowerCase();

    //Si no lo incluye, insertalo
    if( !this._historial.includes(query) ){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify( this._historial ));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<SearchGIFResponse>(`${this.servicioUrl}/search`, {params} )
    .subscribe( ( resp ) => {
      console.log( resp.data );
      this.resultados = resp.data;

      localStorage.setItem('resultados', JSON.stringify( this.resultados ));
    });
  }
}
