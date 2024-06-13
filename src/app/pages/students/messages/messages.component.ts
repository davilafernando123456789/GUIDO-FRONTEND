import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { io } from 'socket.io-client';
import { Buffer } from 'buffer';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../services/courses.service';
import Swal from 'sweetalert2';

interface Archivo {
  nombre: string;
  archivo: Buffer;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  profesorId: string | null = null;
  profesor: any;
  socket: any;
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  mediaRecorder: MediaRecorder | undefined;
  audioChunks: Blob[] = [];
  grabando: boolean = false;
  audioParaEnviar: Blob | null = null;
  archivoParaEnviar: Archivo | null = null;
  remite_id: number | null = null;
  destinatario_id: number | null = null;
  usuarioId: number | null = null;
  rol: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private cdr: ChangeDetectorRef // Importa ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.remite_id = usuario.id;
      this.usuarioId = usuario.id;
      this.rol = usuario.rol; // Asumiendo que el rol está disponible en el objeto usuario
    } else {
      console.error('No se encontró información de usuario en la sesión.');
    }

    // Obtener el ID del profesor seleccionado desde la ruta
    this.route.params.subscribe((params) => {
      this.destinatario_id = params['profesorId'];
      this.profesorId = params['profesorId'];
      if (this.profesorId) {
        console.error('ID de profesor encontrado');
        this.obtenerProfesor();
      } else {
        console.error('ID de profesor no encontrado en la URL');
      }
      console.log('ID del destinatario:', this.destinatario_id);
    });

    this.socket = io('http://localhost:4000');
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.verificarSuscripcion(() => this.cargarMensajesAnteriores());
    });

    this.socket.on('mensaje', (mensaje: any) => {
      if (
        mensaje.destinatario_id === this.destinatario_id ||
        mensaje.remite_id === this.destinatario_id
      ) {
        const mensajeMostrar: any = {
          contenido: mensaje.contenido,
          remite_id: mensaje.remite_id,
        };

        if (mensaje.audio_url !== null && mensaje.audio_url !== undefined) {
          mensajeMostrar.audio_url = mensaje.audio_url;
          console.log('Audio URL recibido:', mensaje.audio_url);
        }

        if (mensaje.archivo_url !== null && mensaje.archivo_url !== undefined) {
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
      'cargar-mensajes-anteriores',
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
    this.verificarSuscripcion(() => {
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
            sent: false,
            audio_url: this.audioParaEnviar ? this.audioParaEnviar : null,
            archivo_url: this.archivoParaEnviar ? this.archivoParaEnviar : null,
          };

          this.socket.emit('mensaje', mensaje);
          this.nuevoMensaje = '';
          this.audioParaEnviar = null;
          this.archivoParaEnviar = null;

          const fileInput =
            document.querySelector<HTMLInputElement>('#fileInput');
          if (fileInput) {
            fileInput.value = '';
          }

          // Agregar el mensaje al arreglo de mensajes localmente con el estilo correcto
          const mensajeMostrar = {
            ...mensaje,
            remite_id: this.remite_id,
            destinatario_id: this.destinatario_id,
            sent: false,
          };
          this.mensajes.push(mensajeMostrar);
          this.cdr.detectChanges(); 

          // Llamar a cargarMensajesAnteriores después de enviar un mensaje
          this.cargarMensajesAnteriores();
        }
      } else {
        console.error('No se ha establecido el remitente o destinatario.');
      }
    });
  }

  cargarMensajesAnteriores(): void {
    this.verificarSuscripcion(() => {
      if (this.destinatario_id && this.socket) {
        console.log(
          'Solicitando mensajes anteriores para el destinatario:',
          this.destinatario_id
        );
        this.socket.emit('cargar-mensajes-anteriores', this.destinatario_id);
      }
    });
  }

  obtenerProfesor(): void {
    this.cursoService.obtenerProfesorPorId(this.profesorId!).subscribe(
      (data) => {
        this.profesor = data;
        console.log('Profesor obtenido:', this.profesor);
      },
      (error) => {
        console.error('Error al obtener el profesor:', error);
      }
    );
  }

  verificarSuscripcion(callback: () => void): void {
    if (this.usuarioId && this.rol) {
      this.cursoService
        .verificarSuscripcion(this.usuarioId.toString(), this.rol)
        .subscribe(
          (suscripcionActiva) => {
            if (suscripcionActiva) {
              callback();
            } else {
              this.router.navigate(['/suscripcion']);
            }
          },
          (error) => {
            console.error('Error al verificar suscripción:', error);
            Swal.fire(
              'Error',
              'No se pudo verificar la suscripción. Inténtalo más tarde.',
              'error'
            );
          }
        );
    } else {
      console.error(
        'No se ha encontrado información de usuario para verificar la suscripción.'
      );
      this.router.navigate(['/suscripcion']);
    }
  }
}


// import { Component, OnInit } from '@angular/core';
// import { io } from 'socket.io-client';
// import { Buffer } from 'buffer';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CursoService } from '../services/courses.service';
// import Swal from 'sweetalert2';

// interface Archivo {
//   nombre: string;
//   archivo: Buffer;
// }

// @Component({
//   selector: 'app-messages',
//   templateUrl: './messages.component.html',
//   styleUrls: ['./messages.component.css'],
// })
// export class MessagesComponent implements OnInit {
//   profesorId: string | null = null;
//   profesor: any;
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
//   usuarioId: number | null = null;
//   rol: string | null = null;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private cursoService: CursoService
//   ) {}

//   ngOnInit(): void {
//     const usuarioString = sessionStorage.getItem('usuario');
//     if (usuarioString) {
//       const usuario = JSON.parse(usuarioString);
//       this.remite_id = usuario.id;
//       this.usuarioId = usuario.id;
//       this.rol = usuario.rol; // Asumiendo que el rol está disponible en el objeto usuario
//     } else {
//       console.error('No se encontró información de usuario en la sesión.');
//     }

//     // Obtener el ID del profesor seleccionado desde la ruta
//     this.route.params.subscribe((params) => {
//       this.destinatario_id = params['profesorId'];
//       this.profesorId = params['profesorId'];
//       if (this.profesorId) {
//         console.error('ID de profesor encontrado');
//         this.obtenerProfesor();
//       } else {
//         console.error('ID de profesor no encontrado en la URL');
//       }
//       console.log('ID del destinatario:', this.destinatario_id);
//     });

//     this.socket = io('http://localhost:4000');
//     this.socket.on('connect', () => {
//       console.log('Conectado al servidor');
//       this.verificarSuscripcion(() => this.cargarMensajesAnteriores());
//     });

//     this.socket.on('mensaje', (mensaje: any) => {
//       if (mensaje.destinatario_id === this.destinatario_id) {
//         const mensajeMostrar: any = {
//           contenido: mensaje.contenido,
//           remite_id: mensaje.remite_id,
//         };

//         if (mensaje.audio_url !== null && mensaje.audio_url !== undefined) {
//           mensajeMostrar.audio_url = mensaje.audio_url;
//           console.log('Audio URL recibido:', mensaje.audio_url);
//         }

//         if (mensaje.archivo_url !== null && mensaje.archivo_url !== undefined) {
//           mensajeMostrar.archivo_url = mensaje.archivo_url;
//           console.log('Archivo URL recibido:', mensaje.archivo_url);
//         }

//         this.mensajes.push(mensajeMostrar);
//       }
//     });

//     this.socket.on('cargar-mensajes-anteriores', (mensajesAnteriores: any[]) => {
//       console.log('Mensajes anteriores recibidos:', mensajesAnteriores);
//       this.mensajes = mensajesAnteriores;
//     });

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
//     this.verificarSuscripcion(() => {
//       if (this.remite_id && this.destinatario_id) {
//         const mensajeTexto = this.nuevoMensaje.trim();

//         if (
//           mensajeTexto !== '' ||
//           this.audioParaEnviar ||
//           this.archivoParaEnviar
//         ) {
//           const mensaje = {
//             contenido: mensajeTexto,
//             remite_id: this.remite_id,
//             destinatario_id: this.destinatario_id,
//             sent: false,
//             audio_url: this.audioParaEnviar ? this.audioParaEnviar : null,
//             archivo_url: this.archivoParaEnviar ? this.archivoParaEnviar : null,
//           };

//           this.socket.emit('mensaje', mensaje);
//           this.nuevoMensaje = '';
//           this.audioParaEnviar = null;
//           this.archivoParaEnviar = null;

//           const fileInput = document.querySelector<HTMLInputElement>('#fileInput');
//           if (fileInput) {
//             fileInput.value = '';
//           }
//           this.cargarMensajesAnteriores();
//         }
//       } else {
//         console.error('No se ha establecido el remitente o destinatario.');
//       }
//     });
//   }

//   cargarMensajesAnteriores(): void {
//     this.verificarSuscripcion(() => {
//       if (this.destinatario_id && this.socket) {
//         console.log(
//           'Solicitando mensajes anteriores para el destinatario:',
//           this.destinatario_id
//         );
//         this.socket.emit('cargar-mensajes-anteriores', this.destinatario_id);
//       }
//     });
//   }

//   obtenerProfesor(): void {
//     this.cursoService.obtenerProfesorPorId(this.profesorId!).subscribe(
//       (data) => {
//         this.profesor = data;
//         console.log('Profesor obtenido:', this.profesor);
//       },
//       (error) => {
//         console.error('Error al obtener el profesor:', error);
//       }
//     );
//   }

//   verificarSuscripcion(callback: () => void): void {
//     if (this.usuarioId && this.rol) {
//       this.cursoService.verificarSuscripcion(this.usuarioId.toString(), this.rol).subscribe(
//         (suscripcionActiva) => {
//           if (suscripcionActiva) {
//             callback();
//           } else {
//             this.router.navigate(['/suscripcion']);
//           }
//         },
//         (error) => {
//           console.error('Error al verificar suscripción:', error);
//           Swal.fire(
//             'Error',
//             'No se pudo verificar la suscripción. Inténtalo más tarde.',
//             'error'
//           );
//         }
//       );
//     } else {
//       console.error('No se ha encontrado información de usuario para verificar la suscripción.');
//       this.router.navigate(['/suscripcion']);
//     }
//   }
// }
