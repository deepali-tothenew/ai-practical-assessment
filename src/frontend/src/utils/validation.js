import { TICKET_PRIORITIES } from './constants';

export function mapApiFieldErrors(details) {
  if (!details?.length) {
    return {};
  }

  return Object.fromEntries(details.map(({ field, message }) => [field, message]));
}

export function validateCreateTicket(values) {
  const errors = {};

  if (!values.title?.trim()) {
    errors.title = 'Title is required and must be non-empty';
  }

  if (!values.description?.trim()) {
    errors.description = 'Description is required and must be non-empty';
  }

  if (!values.priority) {
    errors.priority = 'Priority is required';
  } else if (!TICKET_PRIORITIES.includes(values.priority)) {
    errors.priority = 'Priority must be one of: Low, Medium, High, Critical';
  }

  if (!values.createdBy) {
    errors.createdBy = 'Created By is required';
  }

  return errors;
}

export function validateUpdateTicket(values) {
  const errors = {};

  if (!values.title?.trim()) {
    errors.title = 'Title is required and must be non-empty';
  }

  if (!values.description?.trim()) {
    errors.description = 'Description is required and must be non-empty';
  }

  if (!values.priority) {
    errors.priority = 'Priority is required';
  } else if (!TICKET_PRIORITIES.includes(values.priority)) {
    errors.priority = 'Priority must be one of: Low, Medium, High, Critical';
  }

  return errors;
}
