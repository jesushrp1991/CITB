import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFilter'
})
export class TimeFilterPipe implements PipeTransform {

  transform(value: number): string {
    if (value == 0) {
        return '---:----:---'
    }
    value = Math.round(value /1000);
    let seconds: number | string = value
    let minutes: number | string = 0
    let hours: number | string = 0
    if (value) {
        seconds = value % 60
        minutes = value / 60
        if (minutes >= 60) {
            hours = minutes / 60
            minutes = minutes % 60
        }
    }
    minutes = Math.trunc(minutes)
    hours = Math.trunc(hours)
    if (hours < 10) {
        hours = `0${hours}`
    }
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    seconds = seconds.toString()
    seconds = seconds[0] + seconds[1]
    return `${hours}:${minutes}:${seconds}`
}

}
