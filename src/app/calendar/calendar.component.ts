import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Router } from '@angular/router';

import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { BookingService } from '../services/booking.service';
import { th } from 'date-fns/locale';
import { UserInfoService } from '../services/user-info.service';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();
  events: CalendarEvent[] = [];
  userId: string;
  role: any;
  activeDayIsOpen: boolean = true;

  bookings: any;
  rdy: boolean = false;
  constructor(
    private bookingService: BookingService,
    private router: Router,
    private user: UserInfoService
  ) {
    this.user
      .loadRole(JSON.parse(localStorage.getItem('user')).uid)
      .then((val) => {
        this.role = val;
      });
    this.bookingService.loadData().subscribe((booking) => {
      this.bookings = booking;
      this.events = [];
      this.bookings.forEach((booking, index) => {
        console.log(booking);
        const date = booking.data.date;
        const hour = booking.data.time;
        const hour2 = booking.data.time2;
        const formattedDateTime = `${date}T${hour}`;
        const formattedDateTime2 = `${date}T${hour2}`;
        console.log(formattedDateTime); // Output: "2023-05-24T11:48 addHours(new Date(), 2)"

        this.events.push({
          start: addHours(new Date(formattedDateTime), 0),
          end: addHours(new Date(formattedDateTime2), 0),
          title: 'Booking for a leason - ' + booking.data.appointmentfor,
          id: booking.id,
          color: { ...colors['red'] },
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: false,
        });
      });
      this.refresh.next;
      this.rdy = true;
    });
  }
  old(event) {
    let old = false;
    if (event.end < addHours(new Date(), 0) == false) {
      old = true;
    }
    return old;
  }
  eventCheck(event) {
    let passed = false;
    passed = this.checkPass(event);
    if (passed) {
      return this.old(event);
    }
    return false;
  }
  checkPass(event) {
    let passed = false;
    this.bookings.forEach((booking, index) => {
      if (booking.id == event.id) {
        passed = booking.data.accepted;
      }
    });
    return passed;
  }
  acceptbooking(event) {
    this.bookingService.updateData(event);
  }
  delbooking(event) {
    this.bookingService.del(event.id);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  joinMeeting(event) {
    this.router.navigate(['meeting'], { queryParams: { id: event.id } });
  }
}
