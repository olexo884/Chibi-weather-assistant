import ClearSkyIcon from '../assets/icon/weather/01d.svg';
import FewCloudsIcon from '../assets/icon/weather/02d.svg';
import ScatteredCloudsIcon from '../assets/icon/weather/03d.svg';
import BrokenCloudsIcon from '../assets/icon/weather/04d.svg';
import ShowerRainIcon from '../assets/icon/weather/09d.svg';
import RainIcon from '../assets/icon/weather/10d.svg';
import ThunderstormIcon from '../assets/icon/weather/11d.svg';
import SnowIcon from '../assets/icon/weather/13d.svg';
import MistIcon from '../assets/icon/weather/50d.svg';

export const WeatherIconMap: Record<string, string> = {
    '01': ClearSkyIcon,
    '02': FewCloudsIcon,
    '03': ScatteredCloudsIcon,
    '04': BrokenCloudsIcon,
    '09': ShowerRainIcon,
    '10': RainIcon,
    '11': ThunderstormIcon,
    '13': SnowIcon,
    '50': MistIcon,
}

export const WeatherDayMap: Record<number, string> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
}

export const WeatherMonthMap: Record<number, string> = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
};