import { Check, Error } from '../components/icons/icons';

function toastConfig(params: { success?: string; pending?: string; error?: string }) {
  return {
    pending: {
      className: 'toast-info',
      render: params.pending,
    },
    success: {
      className: 'toast-success',
      render: params.success,
      icon: Check,
      progressClassName: 'Toastify__progress-bar-success',
    },

    error: {
      className: 'toast-error',
      render: params.error,
      icon: Error,
      progressClassName: 'Toastify__progress-bar-error',
    },
  };
}

export default toastConfig;
