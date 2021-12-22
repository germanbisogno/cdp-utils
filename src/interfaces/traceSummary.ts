export interface TraceSummary {
    scripting: number,
    other: number,
    rendering: number,
    loading: number,
    painting: number,
    idle: number,
    startTime: number,
    endTime: number,
}