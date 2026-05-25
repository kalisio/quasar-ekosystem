const UNITS = {
  m: 'm',
  ft: 'ft',
  mi: 'mi',
  NM: 'NM',
  'm^2': 'm²',
  'km^2': 'km²',
  acre: 'a',
  hectare: 'ha',
  'm/s': 'm/s',
  'km/h': 'km/h',
  'mi/h': 'mph',
  kt: 'kt',
  degC: '°C',
  degF: '°F',
  K: 'K',
  deg: '°',
  rad: 'rad',
  ppm: 'ppm',
  'ug/m^3': 'µg/m³',
  'm^3/s': 'm³/s',
  bq: 'Bq',
  'bq/m^2': 'Bq/m²',
  'bq/m^3': 'Bq/m³',
  sv: 'Sv',
  msv: 'mSv',
  usv: 'µSv',
  nsv: 'nSv',
  svs: 'Sv/s',
  msvs: 'mSv/s',
  usvs: 'µSv/s',
  nsvs: 'nSv/s',
  svh: 'Sv/h',
  msvh: 'mSv/h',
  usvh: 'µSv/h',
  nsvh: 'nSv/h'
}

export const units = {
  getSymbol (unit) {
    if (!unit) return unit
    return UNITS[unit] ?? unit
  }
}
