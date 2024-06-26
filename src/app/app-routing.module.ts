import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUserComponent } from './pages/users/create-user/create-user.component';
import { LoginComponent } from './pages/users/login/login.component';
import { StudentComponent } from './pages/users/register/student/student.component';
import { TeacherComponent } from './pages/users/register/teacher/teacher.component';
import { NavbarStudentComponent } from './pages/students/navbar-student/navbar-student.component';
import { HomeComponent } from './pages/students/home/home.component';
import { CalendarStudentComponent } from './pages/students/calendar-student/calendar-student.component';
import { CalendarTeacherComponent } from './pages/teachers/calendar-teacher/calendar-teacher.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { PrecioComponent } from './pages/precio/precio.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ClassroomComponent } from './pages/meetings/classroom/classroom.component';
import { MessagesComponent } from './pages/students/messages/messages.component';
import { MessageComponent } from './pages/teachers/message/message.component';
import { TeacherProfileComponent } from './pages/students/teacher-profile/teacher-profile.component';
import { StudentProfileComponent } from './pages/students/student-profile/student-profile.component';
import { ProfileComponent } from './pages/teachers/profile/profile.component';
import { ConversationComponent } from './pages/students/conversation/conversation.component';
import { ConversationsComponent } from './pages/teachers/conversations/conversations.component';
import { ReportsComponent } from './pages/teachers/reports/reports.component';
import { CalendarComponent } from './pages/users/register/calendar/calendar.component';
import { ConfirmationComponent } from './pages/students/confirmation/confirmation.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { MastersComponent } from './pages/admin/masters/masters.component';
import { ScholarsComponent } from './pages/admin/scholars/scholars.component';
import { MessengerComponent } from './pages/admin/messenger/messenger.component';
import { InscriptionsComponent } from './pages/admin/inscriptions/inscriptions.component';
import { SchedulesComponent } from './pages/admin/schedules/schedules.component';
import { SuscripcionComponent } from './pages/users/register/suscripcion/suscripcion.component';
import { ProfesorPaypalAccountComponent } from './pages/teachers/profesor-paypal-account/profesor-paypal-account.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { RecomendacionesComponent } from './pages/recomendaciones/recomendaciones.component'; 
import { SeleccionRolComponent } from './pages/users/register/seleccion-rol/seleccion-rol.component';

const routesInicio: Routes = [
  { path: '', component: InicioComponent },
  { path: 'crear-usuario', component: CreateUserComponent, data: { message: 'Create User route' } },
  { path: 'registerStudent', component: StudentComponent, data: { message: 'Register Student route' } },
  { path: 'registerTeacher', component: TeacherComponent, data: { message: 'Register Teacher route' } },
  { path: 'recomendaciones', component: RecomendacionesComponent },
  { path: 'schedules', component: SchedulesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'masters', component: MastersComponent },
  { path: 'scholars', component: ScholarsComponent },
  { path: 'messenger', component: MessengerComponent },
  { path: 'inscriptions', component: InscriptionsComponent },
  { path: 'precio', component: PrecioComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'login', component: LoginComponent },
  { path: 'crear-usuario', component: CreateUserComponent },
  { path: 'registerStudent', component: StudentComponent },
  { path: 'registerTeacher', component: TeacherComponent },
  { path: 'studentProfile', component: StudentProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'navbar', component: NavbarStudentComponent },
  { path: 'home', component: HomeComponent },
  { path: 'meetings', component: ClassroomComponent, data: { message: 'meetings route' } },
  { path: 'conversation', component: ConversationComponent, data: { message: 'ConversationComponent route' } },
  { path: 'conversations', component: ConversationsComponent, data: { message: 'ConversationComponent route' } },
  { path: 'messages/:profesorId', component: MessagesComponent, data: { message: 'Messages route' } },
  { path: 'message/:alumnoId', component: MessageComponent, data: { message: 'Messages route' } },
  { path: 'calendarStudent', component: CalendarStudentComponent, data: { message: 'Calendar Student route' } },
  { path: 'calendarTeacher', component: CalendarTeacherComponent, data: { message: 'Calendar Student route' } },
  { path: 'teacherProfile/:id', component: TeacherProfileComponent, data: { message: 'Edit Product route' } },
  { path: 'suscripcion', component: SuscripcionComponent, data: { message: 'Suscripcion alumno route' } },
  { path: 'reportes', component: ReportsComponent, data: { message: 'ReportsComponent alumno route' } },
  { path: 'notificaciones', component: NotificacionesComponent, data: { message: 'NotificacionesComponent alumno route' } },
  { path: 'paymentAccount', component: ProfesorPaypalAccountComponent, data: { message: 'ProfesorPaypalAccountComponent alumno route' } },
  { path: 'confirmation/:horarioId/:profesorId', component: ConfirmationComponent, data: { message: 'Edit Product route' } },
  { path: 'calendarRegister', component: CalendarComponent, data: { message: 'Edit Product route' } },
  { path: 'seleccion-rol', component: SeleccionRolComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' }


];

@NgModule({
  imports: [RouterModule.forRoot(routesInicio)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() {
    routesInicio.forEach(route => {
      console.log(route.data?.['message']);

    });
  }
}