import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  public host: string = 'http://localhost:8080/';

  constructor(
    private http: HttpClient
  ) {
  }

  public getVille(url) {
    return this.http.get(this.host + url);
  }

  public getCinemas(ville) {
    return this.http.get(ville._links.cinemas.href);
  }

  public getSalles(cinema: any) {
    return this.http.get(cinema._links.salles.href);
  }

  public getProjections(salle: any) {
    let url = salle._links.projectionFilms.href.replace('{?projection}', '');
    return this.http.get(url + '?projection=p1');
  }

  public getTicketsPlaces(seance: any) {
    let url = seance._links.tickets.href.replace('{?projection}', '');
    return this.http.get(url + '?projection=ticketProj');
  }

  payerTicket(f) {
    return this.http.post(this.host+"/payerTickets",f);
  }
}
