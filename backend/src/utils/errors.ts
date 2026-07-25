const KNOWN_ERRORS = [
  'Email already in use',
  'Invalid credentials',
  'User not found',
  'Task not found',
];

export const errorMessage = (error: unknown): string => {
  if (error instanceof Error && KNOWN_ERRORS.includes(error.message)) {
    return error.message;
  }
  return 'Something went wrong';
};
