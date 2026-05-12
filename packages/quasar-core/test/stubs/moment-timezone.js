import moment from 'moment'

const tz = (datetime) => moment(datetime)
tz.guess = () => 'UTC'
tz.zone = () => null
moment.tz = tz

export default moment
