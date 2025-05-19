export enum severityType {
  success = 'success',
  warn = 'warn',
  danger = 'danger',
  info = 'info',
}

const THRESHOLDS = {
  SUCCESS: 70,
  WARNING_MAX: 70,
  WARNING_MIN: 30,
};

export const getTagSeverity = (valor: number | undefined): severityType => {
  if (valor === undefined) return severityType.danger;
  if (valor >= THRESHOLDS.SUCCESS) {
    return severityType.success;
  } else if (
    valor >= THRESHOLDS.WARNING_MIN &&
    valor < THRESHOLDS.WARNING_MAX
  ) {
    return severityType.warn;
  }
  return severityType.danger;
};
