import { type BusinessInfo, type DayOfWeek, type TimePeriod } from '@/types/business-profile';
import { useFetchApi } from '@gj/hooks';

const DAY_ORDER: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_LABELS: Record<DayOfWeek, string> = {
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
    SUNDAY: 'Sunday',
};

// JS getDay() returns 0=Sun, 1=Mon … 6=Sat
const JS_DAY_TO_GMB: Record<number, DayOfWeek> = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY',
};

function formatTime(hours: number, minutes: number): string {
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 === 0 ? 12 : hours % 12;
    const m = minutes.toString().padStart(2, '0');
    return `${h}:${m} ${suffix}`;
}

function isOpenNow(periods: TimePeriod[]): boolean {
    const now = new Date();
    const currentDay = JS_DAY_TO_GMB[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const period of periods) {
        if (period.openDay !== currentDay) continue;
        const openMin = period.openTime.hours * 60 + period.openTime.minutes;
        const closeMin = period.closeTime.hours * 60 + period.closeTime.minutes;
        if (closeMin > openMin) {
            if (currentMinutes >= openMin && currentMinutes < closeMin) return true;
        } else {
            // Wraps midnight
            if (currentMinutes >= openMin || currentMinutes < closeMin) return true;
        }
    }
    return false;
}

function periodForDay(periods: TimePeriod[], day: DayOfWeek): TimePeriod | undefined {
    return periods.find((p) => p.openDay === day);
}

export default function BusinessHours() {
    const { data, loading } = useFetchApi<BusinessInfo>('/api/business/info');

    if (loading) {
        return (
            <div className="animate-pulse rounded-lg border border-(--accent) bg-(--card) p-5">
                <div className="mb-3 h-4 w-32 rounded bg-gray-700" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="mb-2 flex justify-between">
                        <div className="h-3 w-24 rounded bg-gray-700" />
                        <div className="h-3 w-28 rounded bg-gray-700" />
                    </div>
                ))}
            </div>
        );
    }

    if (!data?.regularHours?.periods?.length) return null;

    const periods = data.regularHours.periods;
    const open = isOpenNow(periods);
    const today = JS_DAY_TO_GMB[new Date().getDay()];

    return (
        <div className="rounded-lg border border-(--accent) bg-(--card) p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Business Hours</h3>
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        open ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
                    }`}
                >
                    <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-green-400' : 'bg-red-400'}`} />
                    {open ? 'Open now' : 'Closed'}
                </span>
            </div>

            <ul className="space-y-1.5 text-sm">
                {DAY_ORDER.map((day) => {
                    const period = periodForDay(periods, day);
                    const isToday = day === today;
                    return (
                        <li key={day} className={`flex justify-between gap-4 ${isToday ? 'font-semibold text-white' : 'text-gray-400'}`}>
                            <span>{DAY_LABELS[day]}</span>
                            <span>
                                {period
                                    ? `${formatTime(period.openTime.hours, period.openTime.minutes)} – ${formatTime(period.closeTime.hours, period.closeTime.minutes)}`
                                    : 'Closed'}
                            </span>
                        </li>
                    );
                })}
            </ul>

            {data.metadata?.mapsUrl && (
                <a
                    href={data.metadata.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block text-center text-xs text-(--primary) underline hover:text-white"
                >
                    View on Google Maps →
                </a>
            )}
            {data.metadata?.newReviewUrl && (
                <a
                    href={data.metadata.newReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-center text-xs text-(--primary) underline hover:text-white"
                >
                    Leave us a Google review →
                </a>
            )}
        </div>
    );
}
