import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core'; // useful for typechecking
import { HttpClient } from '@angular/common/http';
import { INITIAL_EVENTS, createEventId } from './event-utils';

type myCustomType = string | number;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public calendarOptions!: CalendarOptions;
  evento = [{
		'summary': 'Google I/O 2015',
		'location': '800 Howard St., San Francisco, CA 94103',
		'description': 'A chance to hear more about Google\'s developer products.',
		'start': {
			'dateTime': '2023-10-29T00:00:00-00:00',
			'timeZone': 'America/Los_Angeles',
		},
		'end': {
			'dateTime': '2023-10-29T00:00:00-00:00',
			'timeZone': 'America/Los_Angeles',
		}
	}];

	public eventosJ:any[] = [];

	 eventosP = [{
			title: this.evento[0].summary,
			start: this.evento[0].start.dateTime,
			end: this.evento[0].end.dateTime,
      description: this.evento[0].description
		} ]
	
  
  

  currentEvents: EventApi[] = [];

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(){
    this.calendarOptions = {
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      initialView: 'dayGridMonth',
      //dateClick: this.handleDateClick.bind(this), // MUST ensure `this` context is maintained
      events: this.eventosJ,
      locale: 'co',
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      themeSystem: 'bootstrap5'
    };
    setTimeout(() => {

      return this.httpClient
        .get("http://localhost:8080/v1/actividad_cultural/")
        .subscribe((res: any) => {
          let actividades = res["Data"];
          this.eventosJ = [];
          actividades.forEach((actividad:any) => {
            console.log(res["Data"]);
            
            let new_event = {
              title: actividad.Nombre,
              start: actividad.FechaInicio,
              end: actividad.FechaFin,
              description: actividad.description
            };
            this.eventosJ.push(new_event);
        });
          console.log(this.eventosJ)
          this.calendarOptions.events = this.eventosJ;
        });
    }, 100);
		  
    //console.log(this.calendarOptions);
    /*let a=this.httpClient.get("http://localhost:8080/v1/actividad_cultural/");
    a.subscribe((data:any) => {
        let actividad = data["Data"][0]
        console.log(data["Data"][0]);
        
        let new_event = {
          title: actividad.Nombre,
          start: actividad.FechaInicio,
          end: actividad.FechaFin,
          description: actividad.description
        };
        this.eventosJ.push(new_event);
    });*/
    //console.log(this.evento[0].start.dateTime);
  }
  
  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
	}

  handleEventClick(clickInfo: EventClickArg) {
		if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
			//let eventID = this.listEventsID[clickInfo.event.id];
			//this.borrarEvento(eventID);
			clickInfo.event.remove();
		}
	}

	handleEvents(events: EventApi[]) {
		this.currentEvents = events;
	}

  insertarEvento() {
			alert("Evento creado");
	}
  

  handleDateClick(arg:any) {
    alert('date click! ' + arg.dateStr)
  }

}
