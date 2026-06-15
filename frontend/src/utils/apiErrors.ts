export type FieldErrors = Record<string, string>;

const FIELD_LABELS: Record<string, string> = {
  fullName: 'Full name',
  email: 'Email address',
  password: 'Password',
  confirmPassword: 'Confirm password',
  phone: 'Phone number',
  role: 'Account type',
};

function humanizeMessage(field: string, message: string): string {
  const label = FIELD_LABELS[field] || field;

  if (message.includes('expected string, received undefined') || message.includes('Required')) {
    return `${label} is required`;
  }
  if (message.includes('Invalid email')) {
    return 'Please enter a valid email address';
  }
  if (message.includes('at least 8 characters')) {
    return 'Password must be at least 8 characters';
  }
  if (message.includes('at least 10 characters') && field === 'phone') {
    return 'Phone number must be at least 10 digits';
  }
  if (message.includes('at least 2 characters') && field === 'fullName') {
    return 'Full name must be at least 2 characters';
  }

  return message;
}

function mapServerField(field: string): string {
  if (field === 'body') return 'form';
  return field;
}

export function parseApiFieldErrors(error: unknown): {
  message: string;
  fieldErrors: FieldErrors;
} {
  const axiosError = error as {
    response?: {
      data?: {
        message?: string;
        errors?: Array<{ path?: (string | number)[]; message?: string }>;
      };
    };
    message?: string;
  };

  const data = axiosError.response?.data;
  const fieldErrors: FieldErrors = {};
  let message = data?.message || axiosError.message || 'Something went wrong. Please try again.';

  if (data?.errors && Array.isArray(data.errors)) {
    for (const issue of data.errors) {
      const path = issue.path ?? [];
      const rawField = String(path[path.length - 1] ?? 'form');
      const field = mapServerField(rawField);
      const msg = humanizeMessage(field, issue.message ?? 'Invalid value');
      fieldErrors[field] = msg;
    }

    if (Object.keys(fieldErrors).length > 0) {
      message = Object.values(fieldErrors).join('. ');
    }
  }

  // Map known server business errors to fields
  if (data?.message) {
    const serverMsg = data.message;
    if (serverMsg.toLowerCase().includes('email')) {
      fieldErrors.email = serverMsg;
      message = serverMsg;
    } else if (serverMsg.toLowerCase().includes('phone')) {
      fieldErrors.phone = serverMsg;
      message = serverMsg;
    } else if (serverMsg.toLowerCase().includes('password')) {
      fieldErrors.password = serverMsg;
      message = serverMsg;
    } else if (message === 'Validation Error' && Object.keys(fieldErrors).length > 0) {
      message = Object.values(fieldErrors).join('. ');
    }
  }

  return { message, fieldErrors };
}
