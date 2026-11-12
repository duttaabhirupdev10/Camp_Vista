/**
 * Parses a Date or YYYY-MM-DD string into a UTC midnight Date object.
 * Returns null if the input is missing or invalid.
 */
function parseDateOnlyUTC(dateInput) {
    if (!dateInput) return null;
    if (dateInput instanceof Date) {
        if (Number.isNaN(dateInput.getTime())) return null;
        return new Date(Date.UTC(dateInput.getUTCFullYear(), dateInput.getUTCMonth(), dateInput.getUTCDate()));
    }
    const str = String(dateInput).trim();
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
    if (match) {
        const year = Number(match[1]);
        const month = Number(match[2]) - 1;
        const day = Number(match[3]);
        const d = new Date(Date.UTC(year, month, day));
        if (d.getUTCFullYear() === year && d.getUTCMonth() === month && d.getUTCDate() === day) {
            return d;
        }
        return null;
    }
    const parsed = new Date(str);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
}

function formatDateOnlyUTC(dateObj) {
    const y = dateObj.getUTCFullYear();
    const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * Resolves a check-in / check-out range into half-open UTC dates [start, end).
 * Defaults to [today, tomorrow) when valid dates are not provided.
 */
function resolveDateRange(checkIn, checkOut) {
    const parsedStart = parseDateOnlyUTC(checkIn);
    const parsedEnd = parseDateOnlyUTC(checkOut);

    if (parsedStart && parsedEnd && parsedEnd > parsedStart) {
        return {
            start: parsedStart,
            end: parsedEnd,
            checkInStr: formatDateOnlyUTC(parsedStart),
            checkOutStr: formatDateOnlyUTC(parsedEnd),
            hasCustomDates: true
        };
    }

    if (parsedStart) {
        const nextDay = new Date(parsedStart);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);
        return {
            start: parsedStart,
            end: nextDay,
            checkInStr: formatDateOnlyUTC(parsedStart),
            checkOutStr: formatDateOnlyUTC(nextDay),
            hasCustomDates: true
        };
    }

    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    return {
        start,
        end,
        checkInStr: formatDateOnlyUTC(start),
        checkOutStr: formatDateOnlyUTC(end),
        hasCustomDates: false
    };
}

/**
 * Checks whether a non-cancelled booking overlaps [rangeStart, rangeEnd).
 */
function isBookingOverlapping(booking, rangeStart, rangeEnd) {
    if (!booking || booking.status === 'cancelled') return false;
    const bStart = parseDateOnlyUTC(booking.check_in);
    const bEnd = parseDateOnlyUTC(booking.check_out);
    if (!bStart || !bEnd) return true;
    return bStart < rangeEnd && bEnd > rangeStart;
}

/**
 * Computes room availability for a campground given its bookings and optional dates.
 */
function computeAvailability(campground, bookings = [], checkIn = null, checkOut = null) {
    const range = resolveDateRange(checkIn, checkOut);
    const rawTotal = campground && campground.total_rooms !== undefined && campground.total_rooms !== null
        ? Number(campground.total_rooms)
        : 5;
    const totalRooms = Number.isFinite(rawTotal) ? Math.max(0, Math.floor(rawTotal)) : 5;

    const bookedRooms = Array.isArray(bookings)
        ? bookings.filter((b) => isBookingOverlapping(b, range.start, range.end)).length
        : 0;
    const availableRooms = Math.max(0, totalRooms - bookedRooms);

    return {
        total_rooms: totalRooms,
        booked_rooms: bookedRooms,
        available_rooms: availableRooms,
        check_in: range.checkInStr,
        check_out: range.checkOutStr,
        hasCustomDates: range.hasCustomDates
    };
}

module.exports = {
    parseDateOnlyUTC,
    formatDateOnlyUTC,
    resolveDateRange,
    isBookingOverlapping,
    computeAvailability
};
