import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/users/login/login.component';
import { CreateUserComponent } from './pages/users/create-user/create-user.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { StudentComponent } from './pages/users/register/student/student.component';
import { TeacherComponent } from './pages/users/register/teacher/teacher.component';
import { HomeComponent } from './pages/students/home/home.component';
// import { CoursesComponent } from './pages/students/courses/courses.component';
import { NavbarStudentComponent } from './pages/students/navbar-student/navbar-student.component';
import { CalendarStudentComponent } from './pages/students/calendar-student/calendar-student.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { InicioComponent } from './pages/inicio/inicio.component';
import { PrecioComponent } from './pages/precio/precio.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ClassroomComponent } from './pages/meetings/classroom/classroom.component';
import { MessagesComponent } from './pages/students/messages/messages.component';
import { TeacherProfileComponent } from './pages/students/teacher-profile/teacher-profile.component';
import { ConversationComponent } from './pages/students/conversation/conversation.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './pages/users/register/calendar/calendar.component';
import { ConfirmationComponent } from './pages/students/confirmation/confirmation.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { ConversationsComponent } from './pages/teachers/conversations/conversations.component';
import { MessageComponent } from './pages/teachers/message/message.component';
import { ProfileComponent } from './pages/teachers/profile/profile.component';
import { StudentProfileComponent } from './pages/students/student-profile/student-profile.component';
import { CalendarTeacherComponent } from './pages/teachers/calendar-teacher/calendar-teacher.component';
import { TopbarComponent } from './pages/topbar/topbar.component';
import { IonicModule } from '@ionic/angular';

import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { MastersComponent } from './pages/admin/masters/masters.component';
import { ScholarsComponent } from './pages/admin/scholars/scholars.component';
import { MessengerComponent } from './pages/admin/messenger/messenger.component';
import { InscriptionsComponent } from './pages/admin/inscriptions/inscriptions.component';
import { SchedulesComponent } from './pages/admin/schedules/schedules.component';
import { SuscripcionComponent } from './pages/users/register/suscripcion/suscripcion.component';
import { ProfesorPaypalAccountComponent } from './pages/teachers/profesor-paypal-account/profesor-paypal-account.component';
import { RecomendacionesComponent } from './pages/recomendaciones/recomendaciones.component';
import { ReportsComponent } from './pages/teachers/reports/reports.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { CreditCardDirective } from './services/credit-card.directive';
import { ExpiryDateDirective } from './services/expiry-date.directive';
import './sweetalert2-config';
import { SeleccionRolComponent } from './pages/users/register/seleccion-rol/seleccion-rol.component'; // Importa la configuración global


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateUserComponent,
    NavbarComponent,
    StudentComponent,
    TeacherComponent,
    HomeComponent,
    NavbarStudentComponent,
    CalendarStudentComponent,
    CalendarStudentComponent,
    InicioComponent,
    PrecioComponent,
    BlogComponent,
    ClassroomComponent,
    MessagesComponent,
    TeacherProfileComponent,
    ConversationComponent,
    CalendarComponent,
    ConfirmationComponent,
    ConversationsComponent,
    MessageComponent,
    ProfileComponent,
    StudentProfileComponent,
    CalendarTeacherComponent,
    TopbarComponent,
    DashboardComponent,
    MastersComponent,
    ScholarsComponent,
    MessengerComponent,
    InscriptionsComponent,
    SchedulesComponent,
    SuscripcionComponent,
    ProfesorPaypalAccountComponent,
    RecomendacionesComponent,
    ReportsComponent,
    NotificacionesComponent,
    CreditCardDirective,
    ExpiryDateDirective,
    SeleccionRolComponent,
  ],
  imports: [
    BrowserModule,
    
    IonicModule,

    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPayPalModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    FormsModule ,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ],
  exports: [
    CreditCardDirective,
    ExpiryDateDirective,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
