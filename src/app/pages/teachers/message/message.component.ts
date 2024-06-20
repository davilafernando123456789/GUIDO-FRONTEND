import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { io } from 'socket.io-client';
import { Buffer } from 'buffer';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from '../../students/services/courses.service';

interface Archivo {
  nombre: string;
  archivo: Buffer;
}
interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit, OnDestroy {
  menuActive = false;
  menuSubscription: Subscription | undefined;

  socket: any;
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  alumnos: Alumno[] = [];
  mediaRecorder: MediaRecorder | undefined;
  audioChunks: Blob[] = [];
  grabando: boolean = false;
  audioParaEnviar: Blob | null = null;
  archivoParaEnviar: Archivo | null = null;
  remite_id: number | null = null;
  destinatario_id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private cdr: ChangeDetectorRef,
    private menuService: MenuService
  ) {}

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    // Obtener el ID del profesor logueado desde el almacenamiento de sesión
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.remite_id = usuario.id;
    } else {
      console.error('No se encontró información de usuario en la sesión.');
    }

    // Obtener el ID del alumno seleccionado desde la ruta
    this.route.params.subscribe((params) => {
      this.destinatario_id = params['alumnoId'];
      console.log('ID del destinatario:', this.destinatario_id);
      this.obtenerAlumno();
    });

    this.menuSubscription = this.menuService.menuActive$.subscribe((active) => {
      this.menuActive = active;
    });

    this.socket = io('http://localhost:4000');
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.cargarMensajesAnteriores();
    });

    this.socket.on('mensaje', (mensaje: any) => {
      // Verificar si el mensaje es para el destinatario actual
      if (
        mensaje.destinatario_id === this.destinatario_id ||
        mensaje.remite_id === this.destinatario_id
      ) {
        const mensajeMostrar: any = {
          contenido: mensaje.contenido,
          remite_id: mensaje.remite_id,
          destinatario_id: mensaje.destinatario_id,
        };

        if (mensaje.audio_url) {
          mensajeMostrar.audio_url = mensaje.audio_url;
          console.log('Audio URL recibido:', mensaje.audio_url);
        }

        if (mensaje.archivo_url) {
          mensajeMostrar.archivo_url = mensaje.archivo_url;
          console.log('Archivo URL recibido:', mensaje.archivo_url);
        }

        this.mensajes.push(mensajeMostrar);
        this.cdr.detectChanges(); // Asegura que Angular detecta los cambios

        // Llamar a cargarMensajesAnteriores cuando se recibe un mensaje nuevo
        this.cargarMensajesAnteriores();
      }
    });

    this.socket.on(
      'cargar-mensajes-anteriores-alumnos',
      (mensajesAnteriores: any[]) => {
        console.log('Mensajes anteriores recibidos:', mensajesAnteriores);
        this.mensajes = mensajesAnteriores;
        this.cdr.detectChanges(); // Asegura que Angular detecta los cambios
      }
    );

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
    });
  }

  iniciarGrabacion(): void {
    this.grabando = true;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
        this.mediaRecorder.start();
      })
      .catch((error) => {
        console.error('Error al acceder al micrófono:', error);
        this.grabando = false;
      });
  }

  detenerGrabacion(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioParaEnviar = audioBlob;
        this.audioChunks = [];
        this.grabando = false;
      };
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const buffer = Buffer.from(arrayBuffer);
      this.archivoParaEnviar = { nombre: file.name, archivo: buffer };
    };
    reader.readAsArrayBuffer(file);
  }

  enviarMensaje(): void {
    if (this.remite_id && this.destinatario_id) {
      const mensajeTexto = this.nuevoMensaje.trim();

      if (
        mensajeTexto !== '' ||
        this.audioParaEnviar ||
        this.archivoParaEnviar
      ) {
        const mensaje = {
          contenido: mensajeTexto,
          remite_id: this.remite_id,
          destinatario_id: this.destinatario_id,
          sent: true,
          audio_url: this.audioParaEnviar ? this.audioParaEnviar : null,
          archivo_url: this.archivoParaEnviar ? this.archivoParaEnviar : null,
        };

        this.socket.emit('mensaje', mensaje);

        this.nuevoMensaje = '';
        this.audioParaEnviar = null;
        this.archivoParaEnviar = null;

        // Limpiar el campo de archivo seleccionado
        const fileInput =
          document.querySelector<HTMLInputElement>('#fileInput');
        if (fileInput) {
          fileInput.value = ''; // Limpiar el valor del campo de archivo
        }

        // Agregar el mensaje al arreglo de mensajes localmente con el estilo correcto
        const mensajeMostrar = {
          ...mensaje,
          remite_id: this.remite_id,
          destinatario_id: this.destinatario_id,
          sent: true,
        };
        this.mensajes.push(mensajeMostrar);
        this.cdr.detectChanges(); // Asegura que Angular detecta los cambios

        // Llamar a cargarMensajesAnteriores después de enviar un mensaje
        this.cargarMensajesAnteriores();
      }
    } else {
      console.error('No se ha establecido el remitente o destinatario.');
    }
  }

  cargarMensajesAnteriores(): void {
    if (this.remite_id && this.socket) {
      console.log(
        'Solicitando mensajes anteriores para el remite_id:',
        this.remite_id
      );
      this.socket.emit('cargar-mensajes-anteriores-alumnos', this.remite_id);
    }
  }
  obtenerAlumno(): void {
    if (this.destinatario_id) {
      const destinatarioIdString = this.destinatario_id.toString();
      this.cursoService.obtenerAlumnoPorId(destinatarioIdString).subscribe(
        (data) => {
          this.alumnos = [data]; // Asignar el resultado al array alumnos
        },
        (error) => {
          console.error('Error al obtener alumno:', error);
        }
      );
    }
  }
}

// import { Component, OnInit } from '@angular/core';
// import { io } from 'socket.io-client';
// import { Buffer } from 'buffer';
// import { ActivatedRoute } from '@angular/router';

// interface Archivo {
//   nombre: string;
//   archivo: Buffer;
// }

// @Component({
//   selector: 'app-message',
//   templateUrl: './message.component.html',
//   styleUrls: ['./message.component.css'],
// })
// export class MessageComponent implements OnInit {
//   socket: any;
//   mensajes: any[] = [];
//   nuevoMensaje: string = '';
//   mediaRecorder: MediaRecorder | undefined;
//   audioChunks: Blob[] = [];
//   grabando: boolean = false;
//   audioParaEnviar: Blob | null = null;
//   archivoParaEnviar: Archivo | null = null;
//   remite_id: number | null = null;
//   destinatario_id: number | null = null;

//   constructor(private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     // Obtener el ID del alumno logueado desde el almacenamiento de sesión
//     const usuarioString = sessionStorage.getItem('usuario');
//     if (usuarioString) {
//       const usuario = JSON.parse(usuarioString);
//       this.destinatario_id = usuario.id;
//     } else {
//       console.error('No se encontró información de usuario en la sesión.');
//     }

//     // Obtener el ID del alumno seleccionado desde la ruta
//     this.route.params.subscribe((params) => {
//       this.remite_id = params['alumnoId'];
//       console.log('ID del remite_id:', this.remite_id);
//     });

//     this.socket = io('http://localhost:4000');
//     this.socket.on('connect', () => {
//       console.log('Conectado al servidor');
//       this.cargarMensajesAnteriores();
//     });

//     this.socket.on('mensaje', (mensaje: any) => {
//       // Verificar si el mensaje es para el destinatario actual
//       if (mensaje.remite_id === this.remite_id) {
//         // Filtrar solo los datos relevantes para mostrar en el mensaje
//         const mensajeMostrar: any = {
//           contenido: mensaje.contenido,
//           destinatario_id: mensaje.destinatario_id,
//         };

//         // Verificar si hay un audio_url antes de agregarlo
//         if (mensaje.audio_url !== null && mensaje.audio_url !== undefined) {
//           mensajeMostrar.audio_url = mensaje.audio_url;
//           console.log('Audio URL recibido:', mensaje.audio_url);
//         }

//         // Verificar si hay un archivo_url antes de agregarlo
//         if (mensaje.archivo_url !== null && mensaje.archivo_url !== undefined) {
//           mensajeMostrar.archivo_url = mensaje.archivo_url;
//           console.log('Archivo URL recibido:', mensaje.archivo_url);
//         }

//         this.mensajes.push(mensajeMostrar);
//       }
//     });

//     this.socket.on(
//       'cargar-mensajes-anteriores-alumnos',
//       (mensajesAnteriores: any[]) => {
//         console.log('Mensajes anteriores recibidos:', mensajesAnteriores);
//         this.mensajes = mensajesAnteriores;
//       }
//     );

//     this.socket.on('disconnect', () => {
//       console.log('Desconectado del servidor');
//     });
//   }

//   iniciarGrabacion(): void {
//     this.grabando = true;
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         this.mediaRecorder = new MediaRecorder(stream);
//         this.mediaRecorder.ondataavailable = (event) => {
//           this.audioChunks.push(event.data);
//         };
//         this.mediaRecorder.start();
//       })
//       .catch((error) => {
//         console.error('Error al acceder al micrófono:', error);
//         this.grabando = false;
//       });
//   }

//   detenerGrabacion(): void {
//     if (this.mediaRecorder) {
//       this.mediaRecorder.stop();
//       this.mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
//         this.audioParaEnviar = audioBlob;
//         this.audioChunks = [];
//         this.grabando = false;
//       };
//     }
//   }

//   onFileSelected(event: any): void {
//     const file: File = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = () => {
//       const arrayBuffer = reader.result as ArrayBuffer;
//       const buffer = Buffer.from(arrayBuffer);
//       this.archivoParaEnviar = { nombre: file.name, archivo: buffer };
//     };
//     reader.readAsArrayBuffer(file);
//   }

//   enviarMensaje(): void {
//     if (this.remite_id && this.destinatario_id) {
//       const mensajeTexto = this.nuevoMensaje.trim();

//       if (
//         mensajeTexto !== '' ||
//         this.audioParaEnviar ||
//         this.archivoParaEnviar
//       ) {
//         const mensaje = {
//           contenido: mensajeTexto,
//           remite_id: this.remite_id,
//           destinatario_id: this.destinatario_id,
//           sent: true,
//           audio_url: this.audioParaEnviar ? this.audioParaEnviar : null,
//           archivo_url: this.archivoParaEnviar ? this.archivoParaEnviar : null,
//         };

//         this.socket.emit('mensaje', mensaje);

//         this.nuevoMensaje = '';
//         this.audioParaEnviar = null;
//         this.archivoParaEnviar = null;

//         // Limpiar el campo de archivo seleccionado
//         const fileInput =
//           document.querySelector<HTMLInputElement>('#fileInput');
//         if (fileInput) {
//           fileInput.value = ''; // Limpiar el valor del campo de archivo
//         }
//         // Cargar mensajes anteriores después de enviar el mensaje
//         this.cargarMensajesAnteriores();
//       }
//       //this.cargarMensajesAnteriores();
//       this.cargarMensajesAnteriores();
//     } else {
//       console.error('No se ha establecido el remitente o destinatario.');
//     }
//     this.cargarMensajesAnteriores();
//   }

//   cargarMensajesAnteriores(): void {
//     if (this.remite_id && this.socket) {
//       console.log(
//         'Solicitando mensajes anteriores para el remite_id:',
//         this.remite_id
//       );
//       this.socket.emit('cargar-mensajes-anteriores-alumnos', this.remite_id);
//     }
//   }
// }
