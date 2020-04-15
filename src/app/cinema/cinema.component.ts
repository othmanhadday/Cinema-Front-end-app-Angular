import {Component, OnInit} from '@angular/core';
import {CinemaService} from '../services/cinema.service';
import {tick} from '@angular/core/testing';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  public villes;
  public cinemas;
  public currentVille;
  public currentCinema;
  public salles;
  public currentProjection;
  public listTicket;



  constructor(
    public cinemaService: CinemaService
  ) {
  }

  ngOnInit() {
    this.cinemaService.getVille('villes')
      .subscribe(data => {
        // @ts-ignore
        this.villes = data._embedded.villes;
      }, error => {
        console.log(error);
      });
    this.goMap()
  }

  onGetCinema(ville) {
    this.salles = undefined;
    this.cinemas = undefined;
    this.currentVille = ville;
    this.cinemaService.getCinemas(ville)
      .subscribe(data => {
        // @ts-ignore
        this.cinemas = data._embedded.cinemas;
      }, error => {
        console.log(error);
      });
  }

  onGetSalles(cinema: any) {
    this.currentCinema = cinema;
    this.cinemaService.getSalles(cinema)
      .subscribe(data => {
        // @ts-ignore
        this.salles = data._embedded.salles;
        //console.log(this.salles)
        this.salles.forEach(salle => {
          this.cinemaService.getProjections(salle)
            .subscribe(data => {
              salle.projections = data;
            }, err => {
              console.log(err);
            });
        });
      }, error => {
        console.log(error);
      });
  }

  public d = "";

  public showSeances(id) {
    if ( this.d=="") {
      this.d = id;
    } else {
      this.d = "";
    }
  }

  onGetTicketsPlaces(projection) {
    this.currentProjection=projection;
    this.cinemaService.getTicketsPlaces(projection)
      .subscribe(data=>{
        this.currentProjection.tickets=data;
        this.listTicket=[];
      },err=>{
        console.log(err);
      });
  }

  styleTicketSelection(ticket: any) {
    let style = "btn ticket "
    if(ticket.reservee==true){
      style+="btn-default";
    }else if(ticket.selected){
      style+="btn-warning";
    }else{
      style+="btn-success";
    }
    return style;
  }

  onSelectedTicket(ticket: any) {
    if(!ticket.selected){
      ticket.selected=true;
      this.listTicket.push(ticket);

    }
    else{
      ticket.selected=false;
      this.listTicket.splice(this.listTicket.indexOf(ticket),1);
    }
  }

  onSubmitPayment(f) {
    let tickets=[];
    this.listTicket.forEach((t)=>{
      tickets.push(t.id);
    });
    f.tickets=tickets;
    this.cinemaService.payerTicket(f).subscribe(data=>{
      console.log(data);
      alert("Ticket Rservés avec succes");
      this.onGetTicketsPlaces(this.currentProjection);
    },error=>{
      console.log(error);
    });
  }

  map(event: any) {
    this.lat=event.coords.lat;
    this.lng=event.coords.lng;
    console.log(event);
  }

  lat;
  lng;
  zoom
  goMap() {
    if('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition((position) => {
          this.lat=position.coords.latitude;
          this.lng=position.coords.longitude;
          this.zoom=15
      });
    }
  }
}
