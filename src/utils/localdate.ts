import { LocalDate } from '@js-joda/core'

export function atStartOfWeek(date: LocalDate): LocalDate {
    const dayOfWeek = date.dayOfWeek().value()
    return date.minusDays(dayOfWeek - 1)
}

export function localDateToJsDate(localDate: LocalDate): Date {
    return new Date(
        localDate.year(),
        localDate.monthValue() - 1,
        localDate.dayOfMonth()
    )
}

export function jsDateToLocalDate(date: Date): LocalDate {
    return LocalDate.of(date.getFullYear(), date.getMonth() + 1, date.getDate())
}
