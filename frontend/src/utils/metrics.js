const COLORS = {
  NORMAL: "#37f58c",
  WARNING: "#f5c637",
  CRITICAL: "#ff4d4d",
  DEFAULT: "#aaa",
  BACKGROUND: "#2b2f36",
};

const CLASSES = {
  NORMAL: "metric-normal",
  WARNING: "metric-warning",
  CRITICAL: "metric-critical",
};

export function getMetricStatus(param, value) {
  if (value == null) {
    return {
      color: COLORS.DEFAULT,
      background: COLORS.BACKGROUND,
      cssClass: "",
      isAlert: false,
    };
  }

  let status = COLORS.NORMAL;
  let isAlert = false;

  switch (param) {
    case "co_ppm":
      if (value > 100) {
        status = COLORS.CRITICAL;
        isAlert = true;
      }
      else if (value >= 50) {
        status = COLORS.WARNING;
        isAlert = true;
      }
      break;

    case "co2_ppm":
      if (value > 5000) {
        status = COLORS.CRITICAL;
        isAlert = true;
      }
      else if (value >= 1000) {
        status = COLORS.WARNING;
        isAlert = true;
      }
      break;

    case "o2_percent":
      if (value < 18) {
        status = COLORS.CRITICAL;
        isAlert = true;
      }
      else if (value < 19.5) {
        status = COLORS.WARNING;
        isAlert = true;
      }
      break;

    case "lel_percent":
      if (value > 25) {
        status = COLORS.CRITICAL;
        isAlert = true;
      }
      else if (value > 10) {
        status = COLORS.WARNING;
        isAlert = true;
      }
      break;

    case "temperature_c":
      if (value > 60) {
        status = COLORS.CRITICAL;
        isAlert = true;
      }
      else if (value > 40) {
        status = COLORS.WARNING;
        isAlert = true;
      }
      break;

    default:
      break;
  }

  let cssClass = "";
  if (status === COLORS.CRITICAL) {
    cssClass = CLASSES.CRITICAL;
  } else if (status === COLORS.WARNING) {
    cssClass = CLASSES.WARNING;
  } else if (status === COLORS.NORMAL) {
    cssClass = CLASSES.NORMAL;
  }

  return {
    color: status,
    background: isAlert ? status : COLORS.BACKGROUND,
    cssClass: cssClass,
    isAlert: isAlert
  };
}

export function getEnvValueColor(param, value) {
  return getMetricStatus(param, value).color;
}