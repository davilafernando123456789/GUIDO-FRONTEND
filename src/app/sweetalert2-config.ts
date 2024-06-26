// src/app/sweetalert2-config.ts
import Swal, { SweetAlertOptions } from 'sweetalert2';

export const defaultSwalOptions: SweetAlertOptions = {
  confirmButtonColor: '#1C1678', // Color específico para el botón de confirmación
  cancelButtonColor: '#181368', // Color para el botón de cancelación
  buttonsStyling: true,
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger',
  },
};

console.log('Aplicando configuraciones de SweetAlert2:', defaultSwalOptions);
export const swalWithCustomOptions = Swal.mixin(defaultSwalOptions);
